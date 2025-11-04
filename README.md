# Portfolio - Desarrollador Frontend

![Vista previa del portfolio](./public/assets/RuXxDeV1.webp)

## 🚀 Sobre el Proyecto

Este es el portfolio personal de un desarrollador frontend, construido con Angular. El sitio web es completamente responsivo y está optimizado para dispositivos móviles y tablets, ofreciendo una experiencia de usuario fluida en todas las plataformas.

El portfolio incluye secciones para mostrar proyectos, certificados, habilidades técnicas, y un formulario de contacto. Además, cuenta con funcionalidades interactivas como un reproductor de audio y optimización de imágenes.

## ✨ Características

- **Diseño Responsivo**: Adaptable a móviles, tablets y escritorio.
- **Internacionalización (i18n)**: Soporte para múltiples idiomas (español e inglés).
- **Componentes Interactivos**: Incluye un reproductor de audio, imágenes interactivas y formularios dinámicos.
- **Optimización de Imágenes**: Servicio integrado para mejorar el rendimiento de las imágenes.
- **Secciones Principales**:
  - Hero: Presentación inicial.
  - Proyectos: Galería de trabajos realizados.
  - Certificados: Credenciales y logros.
  - Contacto: Formulario para comunicación.
  - Ruta de Aprendizaje: Sección educativa.

## 🛠 Tecnologías Utilizadas

- **Framework**: Angular
- **Lenguajes**: TypeScript, HTML, CSS, SCSS
- **Herramientas**:
  - Angular CLI
  - Service Worker (PWA)
  - Optimización de Imágenes
- **Dependencias**: Ver `package.json` para la lista completa.

## 📦 Instalación

Sigue estos pasos para instalar y ejecutar el proyecto localmente:

1. **Clona el repositorio**:
   ```bash
   git clone https://github.com/tu-usuario/RuXx-site-action.git
   cd RuXx-site-action
   ```

2. **Instala las dependencias**:
   ```bash
   npm install
   ```

3. **Ejecuta el servidor de desarrollo**:
   ```bash
   ng serve
   ```

4. **Abre tu navegador** y ve a `http://localhost:4200`.

## 🚀 Uso

Una vez instalado, puedes:

- Navegar por las diferentes secciones del portfolio.
- Cambiar el idioma usando los controles de internacionalización.
- Interactuar con el reproductor de audio y las imágenes.
- Enviar mensajes a través del formulario de contacto.

Para construir la aplicación para producción:
```bash
ng build --prod
```

Los archivos generados estarán en la carpeta `dist/`.

## 📖 Ejemplos

### Agregar un Nuevo Proyecto

Para agregar un nuevo proyecto a la sección de proyectos, edita el archivo `src/app/components/proyectos/proyectos.ts` y añade un nuevo objeto al array de proyectos.

### Personalizar el Tema

Modifica los estilos en `src/styles.css` o en los archivos CSS de componentes individuales para cambiar colores, fuentes, etc.

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Si deseas mejorar este proyecto:

1. Haz un fork del repositorio.
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza tus cambios y haz commit (`git commit -am 'Agrega nueva funcionalidad'`).
4. Push a la rama (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request.

Por favor, asegúrate de que tu código siga las mejores prácticas de Angular y esté bien documentado.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.

## 📧 Contacto

Si tienes preguntas o sugerencias, puedes contactarme a través de:

- Email: tu-email@example.com
- LinkedIn: [Tu Perfil](https://linkedin.com/in/tu-perfil)
- Sitio Web: [Tu Portfolio](https://tu-portfolio.com)

---
# 🎧 Audio Book API (Secure Edition)

Una API desarrollada con **FastAPI** que permite subir archivos `.pdf` o `.txt`, extraer su texto y convertirlo en audio (`.mp3`) mediante **pyttsx3**.

> ⚡ Esta versión incluye un conjunto completo de **medidas de seguridad y buenas prácticas** para evitar vulnerabilidades comunes en servicios de subida y procesamiento de archivos.

---

## 🛡️ Medidas de Seguridad Implementadas

### 1️⃣ Validación de tipo de archivo (MIME y extensión)
- Solo se permiten archivos **PDF** y **TXT**.
- Se valida tanto la **extensión** como el **tipo MIME real** usando `python-magic`.
- Evita que un atacante suba archivos maliciosos disfrazados.

```python
verify_mime(upload_path)
2️⃣ Límite de tamaño máximo (MAX_UPLOAD_SIZE)
Configurable mediante variable de entorno.

Por defecto, máximo 10 MB (10485760 bytes).

Evita ataques de denegación de servicio (DoS) por subida de archivos grandes.

python
Copiar código
MAX_UPLOAD_SIZE = int(os.getenv("MAX_UPLOAD_SIZE", 10 * 1024 * 1024))
3️⃣ Escaneo antivirus con ClamAV
Cada archivo subido se analiza con ClamAV antes de procesarse.

Si se detecta malware, se rechaza automáticamente con error 400.

El antivirus se ejecuta en un contenedor Docker aislado, evitando riesgos en el host.

python
Copiar código
scan_with_clamav(upload_path)
4️⃣ Aislamiento y timeout en la extracción de PDFs
La extracción de texto se realiza en un subproceso separado (multiprocessing).

Se aplica un tiempo límite (timeout) para evitar bloqueos por archivos maliciosos o PDF corruptos.

Si el proceso excede el tiempo configurado, se cancela automáticamente.

5️⃣ Limpieza de archivos temporales
Todos los archivos subidos se eliminan una vez procesados.

En caso de error durante la conversión, los archivos temporales también se eliminan.

Evita filtraciones o acumulación de datos sensibles.

6️⃣ Endpoint /audio/cleanup protegido con API Key
Requiere una clave privada segura definida en la variable de entorno ADMIN_KEY.

Previene accesos no autorizados que podrían eliminar archivos de otros usuarios.

La clave no está incluida en el código y debe mantenerse privada.

python
Copiar código
if api_key != ADMIN_KEY:
    raise HTTPException(status_code=401, detail="No autorizado")
7️⃣ Nombres de archivos aleatorios (UUID)
Todos los archivos se renombran con identificadores únicos (UUID) antes de ser procesados.

Evita ataques de enumeración y acceso no autorizado a otros archivos.

python
Copiar código
file_id = str(uuid.uuid4())
8️⃣ Cabeceras HTTP seguras
Añadidas mediante middleware para reforzar la seguridad del navegador y reducir el riesgo de ataques XSS o clickjacking.

python
Copiar código
response.headers["X-Content-Type-Options"] = "nosniff"
response.headers["X-Frame-Options"] = "DENY"
response.headers["Referrer-Policy"] = "no-referrer"
response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
9️⃣ CORS restringido
Solo se permiten peticiones desde dominios explícitamente definidos (por ejemplo, tu aplicación Angular local).

python
Copiar código
allow_origins=[
    "http://localhost:4200",
    "http://localhost:4201"
]
🔟 Registro de actividad (logging)
Se registra cada subida con el nombre del archivo e IP de origen del cliente.

Permite auditoría y detección de patrones sospechosos o abusos.

⚙️ Variables de entorno
Variable	Descripción	Ejemplo
MAX_UPLOAD_SIZE	Tamaño máximo permitido para archivos en bytes	10485760
ADMIN_KEY	Clave privada para acceder a /audio/cleanup	************
CLAMAV_HOST	Host del servicio ClamAV (opcional)	clamav
CLAMAV_PORT	Puerto ClamAV (opcional)	3310

⚠️ Importante: Nunca publiques tu ADMIN_KEY ni la incluyas en tu repositorio.
Usa un archivo .env privado o configura la variable directamente en tu entorno de ejecución.

🐳 Integración con Docker (ClamAV)
Ejecuta ClamAV en un contenedor aislado:

bash
Copiar código
docker run -d --name clamav -p 3310:3310 mkodockx/docker-clamav:alpine
O usa docker-compose.yml:

yaml
Copiar código
version: "3.8"

services:
  clamav:
    image: mkodockx/docker-clamav:alpine
    container_name: clamav
    ports:
      - "3310:3310"
🧪 Endpoints principales
Método	Ruta	Descripción	Seguridad
POST	/upload-file/	Sube un archivo .pdf o .txt para convertirlo en audio	Validación, antivirus, límite de tamaño
GET	/audio/{file_id}.mp3	Obtiene el audio generado	Archivos aislados
DELETE	/audio/cleanup	Limpia todos los audios generados	Requiere X-API-Key
GET	/health	Comprueba el estado de la API	Público

🚀 Despliegue seguro en producción
Usa HTTPS (por ejemplo, con NGINX, Traefik o Caddy).

Configura las variables de entorno en tu servidor (no en el código fuente).

Ejecuta el servicio ClamAV en contenedor Docker o en otro host seguro.

Desactiva --reload en producción (uvicorn api:app --host 0.0.0.0 --port 8000).

Monitorea logs y tamaño del almacenamiento regularmente.

🧠 Stack técnico
FastAPI — Framework web principal

Uvicorn — Servidor ASGI

PyPDF2 — Extracción de texto de PDF

pyttsx3 — Conversión de texto a voz

python-magic — Validación de tipo MIME

clamd — Escaneo antivirus

multiprocessing — Aislamiento de tareas

🩵 Autor
Desarrollador Full Stack
(Clave y datos privados excluidos para seguridad)


¡Gracias por visitar mi portfolio! Espero que te inspire en tus propios proyectos.
