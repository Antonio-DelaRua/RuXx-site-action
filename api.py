from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import PyPDF2
import pyttsx3
import os
import uuid
import json
from typing import List
import io

app = FastAPI(title="Audio Book API")

# Configurar CORS para permitir requests desde Angular
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],  # URL de Angular
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directorios para archivos temporales
UPLOAD_DIR = "uploads"
AUDIO_DIR = "audio_files"
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(AUDIO_DIR, exist_ok=True)

class AudioBookProcessor:
    def __init__(self):
        self.engine = pyttsx3.init()
        self.engine.setProperty('rate', 150)
        self.engine.setProperty('volume', 0.9)
    
    def extract_text_from_pdf(self, file_path: str) -> str:
        """Extrae texto de un archivo PDF"""
        try:
            with open(file_path, 'rb') as file:
                reader = PyPDF2.PdfReader(file)
                text = ""
                for page in reader.pages:
                    text += page.extract_text() + "\n"
                return text
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error leyendo PDF: {str(e)}")
    
    def extract_text_from_txt(self, file_path: str) -> str:
        """Extrae texto de un archivo TXT"""
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                return file.read()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error leyendo TXT: {str(e)}")
    
    def text_to_speech(self, text: str, output_path: str):
        """Convierte texto a audio"""
        try:
            self.engine.save_to_file(text, output_path)
            self.engine.runAndWait()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error generando audio: {str(e)}")

processor = AudioBookProcessor()

@app.post("/upload-file/")
async def upload_file(file: UploadFile = File(...)):
    """Endpoint para subir archivos y convertirlos a audio"""
    
    # Validar tipo de archivo
    allowed_extensions = {'.pdf', '.txt'}
    file_extension = os.path.splitext(file.filename)[1].lower()
    
    if file_extension not in allowed_extensions:
        raise HTTPException(
            status_code=400, 
            detail="Formato no soportado. Use PDF o TXT"
        )
    
    # Generar nombres únicos
    file_id = str(uuid.uuid4())
    upload_path = f"{UPLOAD_DIR}/{file_id}{file_extension}"
    audio_path = f"{AUDIO_DIR}/{file_id}.mp3"
    
    try:
        # Guardar archivo subido
        with open(upload_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Extraer texto según el tipo de archivo
        if file_extension == '.pdf':
            text = processor.extract_text_from_pdf(upload_path)
        else:  # .txt
            text = processor.extract_text_from_txt(upload_path)
        
        # Convertir texto a audio
        processor.text_to_speech(text, audio_path)
        
        # Limpiar archivo temporal
        os.remove(upload_path)
        
        return {
            "file_id": file_id,
            "original_filename": file.filename,
            "text_length": len(text),
            "audio_url": f"/audio/{file_id}.mp3",
            "text_preview": text[:200] + "..." if len(text) > 200 else text
        }
        
    except Exception as e:
        # Limpiar en caso de error
        if os.path.exists(upload_path):
            os.remove(upload_path)
        if os.path.exists(audio_path):
            os.remove(audio_path)
        raise e

@app.get("/audio/{filename}")
async def get_audio_file(filename: str):
    """Endpoint para servir archivos de audio"""
    audio_path = f"{AUDIO_DIR}/{filename}"
    
    if not os.path.exists(audio_path):
        raise HTTPException(status_code=404, detail="Audio no encontrado")
    
    return FileResponse(
        audio_path, 
        media_type='audio/mpeg',
        filename=f"audiobook_{filename}"
    )

@app.get("/health")
async def health_check():
    """Endpoint de verificación de salud"""
    return {"status": "healthy", "service": "Audio Book API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)