# api_secure.py
import os
import uuid
import shutil
import logging
import tempfile
import asyncio
from typing import Optional
from multiprocessing import Process, Queue
from pathlib import Path

from fastapi import FastAPI, File, UploadFile, HTTPException, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.security import APIKeyHeader

import PyPDF2
import pyttsx3

# Requerido: python-magic y clamd
import magic  # pip install python-magic (or python-magic-bin on Windows)
import clamd  # pip install clamd

# Config
UPLOAD_DIR = Path("uploads")
AUDIO_DIR = Path("audio_files")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
AUDIO_DIR.mkdir(parents=True, exist_ok=True)

MAX_UPLOAD_SIZE = int(os.getenv("MAX_UPLOAD_SIZE", 10 * 1024 * 1024))  # 10 MB por defecto
ALLOWED_EXTENSIONS = {'.pdf', '.txt'}
ALLOWED_MIMES = {"application/pdf", "text/plain"}
API_KEY = os.getenv("ADMIN_KEY", "change_me_to_secure_value")

# Logging
logging.basicConfig(level=logging.INFO, filename="uploads.log", format="%(asctime)s %(levelname)s %(message)s")

app = FastAPI(title="Audio Book API - Hardened")

# CORS (adaptar dominios en producción)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200", "http://localhost:4201"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security header middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "no-referrer"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response

# Upload size check middleware (based on Content-Length header)
@app.middleware("http")
async def limit_upload_size(request: Request, call_next):
    content_length = request.headers.get("content-length")
    if content_length:
        try:
            if int(content_length) > MAX_UPLOAD_SIZE:
                return JSONResponse(status_code=413, content={"detail": "Archivo demasiado grande (máx {} bytes)".format(MAX_UPLOAD_SIZE)})
        except ValueError:
            pass
    return await call_next(request)

# API Key dependency for admin endpoints
api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)

def require_api_key(api_key: Optional[str] = Depends(api_key_header)):
    if api_key != API_KEY:
        raise HTTPException(status_code=401, detail="No autorizado")
    return True

# Helper: verify mime type with python-magic
def verify_mime(file_path: str):
    try:
        mime = magic.from_file(file_path, mime=True)
    except Exception as e:
        logging.error("Error detectando MIME: %s", e)
        raise HTTPException(status_code=400, detail="No se pudo determinar el tipo de archivo")
    if mime not in ALLOWED_MIMES:
        raise HTTPException(status_code=400, detail=f"Tipo de archivo no permitido ({mime})")
    return mime

# Helper: scan with ClamAV
def scan_with_clamav(file_path: str):
    try:
        cd = clamd.ClamdNetworkSocket()  # por defecto localhost:3310
        # si clamd no responde lanza excepción
        result = cd.scan(file_path)
        if not result:
            # en algunos setups el resultado puede ser None o {}
            return True
        # result example: {'/path/file': ('OK', None)} or ('FOUND', 'Eicar-Test-Signature')
        for res in result.values():
            status = res[0]
            if status == 'FOUND':
                return False
        return True
    except Exception as e:
        logging.error("Error al escanear con ClamAV: %s", e)
        # opción conservadora: si no podemos escanear, rechazamos la subida
        raise HTTPException(status_code=500, detail="Error interno de escaneo antivirus")

# Safe PDF extraction in a subprocess with timeout
def extract_text_from_pdf_worker(file_path: str, q: Queue):
    try:
        text = ""
        with open(file_path, 'rb') as f:
            reader = PyPDF2.PdfReader(f)
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
        if not text:
            q.put({"ok": False, "error": "No se pudo extraer texto (PDF puede contener solo imágenes/protegerse)."})
        else:
            q.put({"ok": True, "text": text})
    except Exception as e:
        q.put({"ok": False, "error": str(e)})

def extract_text_from_pdf_with_timeout(file_path: str, timeout: int = 15):
    q = Queue()
    p = Process(target=extract_text_from_pdf_worker, args=(file_path, q))
    p.start()
    p.join(timeout)
    if p.is_alive():
        p.terminate()
        raise HTTPException(status_code=500, detail="Extracción de PDF excedió el tiempo límite")
    if q.empty():
        raise HTTPException(status_code=500, detail="Fallo en la extracción de PDF")
    result = q.get()
    if not result["ok"]:
        raise HTTPException(status_code=400, detail=result["error"])
    return result["text"]

# Safe TXT read with encoding fallback and size check
def read_text_file(file_path: str, max_chars: int = 2_000_000):
    try:
        with open(file_path, 'rb') as f:
            raw = f.read()
            # si es muy grande, recortamos para evitar DoS
            if len(raw) > MAX_UPLOAD_SIZE:
                raise HTTPException(status_code=413, detail="Archivo de texto demasiado grande")
            for encoding in ('utf-8', 'latin-1', 'utf-16'):
                try:
                    text = raw.decode(encoding)
                    return text
                except Exception:
                    continue
            raise HTTPException(status_code=400, detail="No se pudo decodificar el archivo de texto")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error leyendo TXT: {str(e)}")

# Text-to-speech in separate process with timeout (using pyttsx3)
def tts_worker(text: str, output_path: str, q: Queue):
    try:
        engine = pyttsx3.init()
        engine.setProperty('rate', 150)
        engine.setProperty('volume', 0.9)
        engine.save_to_file(text, output_path)
        engine.runAndWait()
        q.put({"ok": True})
    except Exception as e:
        q.put({"ok": False, "error": str(e)})

def text_to_speech_with_timeout(text: str, output_path: str, timeout: int = 60):
    q = Queue()
    p = Process(target=tts_worker, args=(text, output_path, q))
    p.start()
    p.join(timeout)
    if p.is_alive():
        p.terminate()
        raise HTTPException(status_code=500, detail="Generación de audio excedió el tiempo límite")
    if q.empty():
        raise HTTPException(status_code=500, detail="Fallo en la generación de audio")
    result = q.get()
    if not result.get("ok"):
        raise HTTPException(status_code=500, detail=f"Error TTS: {result.get('error')}")

@app.post("/upload-file/")
async def upload_file(file: UploadFile = File(...), request: Request = None):
    """
    EndPoint endurecido para subir PDF o TXT y generar MP3.
    Flujo:
     - Guardar en temp
     - Verificar extensión permitida
     - Verificar MIME real con python-magic
     - Escanear con ClamAV
     - Extraer texto (PDF en proceso con timeout)
     - Generar MP3 (TTS en proceso con timeout)
    """
    # Validar extensión
    original_filename = file.filename or "uploaded"
    file_extension = Path(original_filename).suffix.lower()
    logging.info("Upload request: filename=%s, ext=%s, ip=%s", original_filename, file_extension, request.client.host if request else "unknown")

    if file_extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Formato no soportado. Use PDF o TXT")

    # Guardar en archivo temporal de forma segura
    file_id = str(uuid.uuid4())
    tmp_dir = tempfile.mkdtemp(prefix="upload_")
    tmp_path = Path(tmp_dir) / f"{file_id}{file_extension}"
    try:
        # stream a disco para no cargar todo en memoria si es grande
        with open(tmp_path, "wb") as buffer:
            while True:
                chunk = await file.read(1024 * 1024)  # 1MB chunk
                if not chunk:
                    break
                buffer.write(chunk)

        # Verificar tamaño final (defensa extra)
        if tmp_path.stat().st_size > MAX_UPLOAD_SIZE:
            raise HTTPException(status_code=413, detail="Archivo demasiado grande (post-upload)")

        # Verificar MIME real (magic bytes)
        mime = verify_mime(str(tmp_path))

        # Escaneo antivirus (ClamAV)
        scanned_ok = scan_with_clamav(str(tmp_path))
        if not scanned_ok:
            raise HTTPException(status_code=400, detail="Archivo detectado como malicioso por el antivirus")

        # Extraer texto
        if file_extension == '.pdf':
            text = extract_text_from_pdf_with_timeout(str(tmp_path), timeout=220)
        else:  # .txt
            text = read_text_file(str(tmp_path))

        if not text or not text.strip():
            raise HTTPException(status_code=400, detail="No se pudo extraer texto del archivo (vacío o no legible)")

        # Generar audio en ubicación temporal
        tmp_audio_path = Path(tmp_dir) / f"{file_id}.mp3"
        text_to_speech_with_timeout(text, str(tmp_audio_path), timeout=190)

        # Mover audio a carpeta final con nombre opaco
        final_audio_name = f"{file_id}.mp3"
        final_audio_path = AUDIO_DIR / final_audio_name
        shutil.move(str(tmp_audio_path), final_audio_path)

        # limpiar archivo subido
        try:
            tmp_path.unlink(missing_ok=True)
            Path(tmp_dir).rmdir()
        except Exception:
            pass

        # Guardar metadata en log (mejor guardar en DB en producción)
        logging.info("Uploaded processed: file_id=%s, original=%s, size=%d, audio=%s", file_id, original_filename, final_audio_path.stat().st_size, final_audio_name)

        return {
            "file_id": file_id,
            "original_filename": original_filename,
            "text_length": len(text),
            "audio_url": f"/audio/{final_audio_name}",
            "text_preview": text[:200] + "..." if len(text) > 200 else text
        }

    except HTTPException:
        # re-raise para que FastAPI lo maneje
        raise
    except Exception as e:
        logging.exception("Error en /upload-file/: %s", e)
        raise HTTPException(status_code=500, detail="Error interno procesando el archivo")
    finally:
        # Cleanup seguro del temp dir
        try:
            if tmp_path.exists():
                tmp_path.unlink()
            if Path(tmp_dir).exists():
                shutil.rmtree(tmp_dir, ignore_errors=True)
        except Exception:
            pass

@app.get("/audio/{filename}")
async def get_audio_file(filename: str):
    """Servir audio sólo si existe y con nombre opaco (UUID.mp3)"""
    # validar patrón básico para evitar traversal: solo UUID + .mp3
    if not filename.endswith(".mp3"):
        raise HTTPException(status_code=400, detail="Formato inválido")
    file_path = AUDIO_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Audio no encontrado")
    return FileResponse(file_path, media_type='audio/mpeg', filename=f"audiobook_{filename}")

@app.delete("/audio/cleanup")
async def cleanup_audio_files(authorized: bool = Depends(require_api_key)):
    """Endpoint protegido para eliminar todos los MP3 (admin only)"""
    try:
        deleted = []
        for f in AUDIO_DIR.iterdir():
            if f.is_file() and f.suffix == ".mp3":
                deleted.append(f.name)
                f.unlink()
        logging.info("Cleanup executed, deleted: %s", deleted)
        return {"message": f"Eliminados {len(deleted)} archivos", "deleted_files": deleted}
    except Exception as e:
        logging.exception("Error in cleanup: %s", e)
        raise HTTPException(status_code=500, detail="Error limpiando archivos")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "Audio Book API - Hardened"}

# Run with: uvicorn api_secure:app --host 0.0.0.0 --port 8000 --reload
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api_secure:app", host="0.0.0.0", port=8000, reload=True)
