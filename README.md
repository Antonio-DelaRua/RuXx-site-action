# 🚀 RuXx Portfolio & Audio Book API

[![Angular](https://img.shields.io/badge/Angular-17-red.svg)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue.svg)](https://www.typescriptlang.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104-green.svg)](https://fastapi.tiangolo.com/)
[![Licencia: No Comercial](https://img.shields.io/badge/Licencia-No%20Comercial-orange.svg)](LICENSE)

![Vista previa del portfolio](./public/assets/RuXxDeV1.webp)

Un portfolio moderno de desarrollador frontend construido con **Angular**, acompañado de una API segura para conversión de texto a audio desarrollada con **FastAPI**.

## 📋 Tabla de Contenidos

- [🎯 Características](#-características)
- [🛠️ Tecnologías](#️-tecnologías)
- [📦 Instalación](#-instalación)
- [🚀 Uso](#-uso)
- [📖 Ejemplos](#-ejemplos)
- [🎧 Audio Book API](#-audio-book-api-secure-edition)
- [🤝 Contribuciones](#-contribuciones)
- [📄 Licencia](#-licencia)
- [📧 Contacto](#-contacto)

## 🎯 Características

### Portfolio Frontend
- **🎨 Diseño Responsivo**: Optimizado para móviles, tablets y escritorio
- **🌍 Internacionalización (i18n)**: Soporte para español e inglés
- **🎵 Componentes Interactivos**: Reproductor de audio, imágenes interactivas y formularios dinámicos
- **🖼️ Optimización de Imágenes**: Servicio integrado para mejorar rendimiento
- **📱 PWA**: Service Worker para experiencia offline
- **🔧 Secciones Principales**:
  - **Hero**: Presentación inicial con animaciones
  - **Proyectos**: Galería de trabajos realizados
  - **Certificados**: Credenciales y logros profesionales
  - **Contacto**: Formulario de comunicación integrado
  - **Ruta de Aprendizaje**: Sección educativa interactiva

### Audio Book API
- **🔒 Seguridad Avanzada**: Validación MIME, antivirus ClamAV, límites de tamaño
- **⚡ Procesamiento Seguro**: Extracción de texto en subprocesos aislados con timeouts
- **🧹 Limpieza Automática**: Eliminación de archivos temporales
- **🔑 Autenticación**: Endpoints protegidos con API Key
- **📊 Logging**: Registro completo de actividades para auditoría

## 🛠️ Tecnologías

### Frontend (Portfolio)
- **Framework**: Angular 17+
- **Lenguajes**: TypeScript, HTML5, SCSS
- **Herramientas**:
  - Angular CLI
  - Angular i18n
  - Firebase Auth
  - Service Worker (PWA)
- **Dependencias**: Ver [`package.json`](package.json)

### Backend (API)
- **Framework**: FastAPI
- **Lenguajes**: Python 3.8+
- **Bibliotecas**:
  - PyPDF2 (extracción PDF)
  - pyttsx3 (TTS)
  - python-magic (validación MIME)
  - clamd (antivirus)
  - multiprocessing (aislamiento)

## 📦 Instalación

### Portfolio Frontend

1. **Clona el repositorio**:
   ```bash
   git clone https://github.com/RuXx/RuXx-site-action.git
   cd RuXx-site-action
   ```

2. **Instala dependencias**:
   ```bash
   npm install
   ```

3. **Ejecuta el servidor de desarrollo**:
   ```bash
   ng serve
   ```

4. **Accede**: Abre `http://localhost:4200` en tu navegador.

### Audio Book API

1. **Instala dependencias Python**:
   ```bash
   pip install fastapi uvicorn PyPDF2 pyttsx3 python-magic clamd
   ```

2. **Configura ClamAV** (opcional para producción):
   ```bash
   docker run -d --name clamav -p 3310:3310 mkodockx/docker-clamav:alpine
   ```

3. **Ejecuta la API**:
   ```bash
   uvicorn api:app --host 0.0.0.0 --port 8000 --reload
   ```

## 🚀 Uso

### Portfolio
- Navega por secciones: Hero, Proyectos, Certificados, Contacto
- Cambia idioma con controles i18n
- Interactúa con reproductor de audio y elementos dinámicos
- Envía mensajes vía formulario de contacto

**Construcción para producción**:
```bash
ng build --configuration production
```

### API
- **Subir archivo**: `POST /upload-file/` con FormData
- **Obtener audio**: `GET /audio/{file_id}.mp3`
- **Limpiar audios**: `DELETE /audio/cleanup` (requiere API Key)
- **Health check**: `GET /health`

## 📖 Ejemplos

### Agregar Proyecto al Portfolio
Edita `src/app/components/proyectos/proyectos.ts`:

```typescript
export class ProyectosComponent {
  proyectos = [
    // ... proyectos existentes
    {
      titulo: 'Nuevo Proyecto',
      descripcion: 'Descripción del proyecto',
      imagen: 'assets/proyecto.jpg',
      enlace: 'https://github.com/usuario/proyecto'
    }
  ];
}
```

### Personalizar Tema
Modifica `src/styles.css` o componentes individuales:

```scss
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
}
```

### Uso de la API
```python
import requests

# Subir archivo
files = {'file': open('documento.pdf', 'rb')}
response = requests.post('http://127.0.0.1:8000/upload-file/', files=files)
data = response.json()
audio_url = data['audio_url']
```

## 🎧 Audio Book API (Secure Edition)

API robusta para conversión de documentos a audio con medidas de seguridad avanzadas.

### 🛡️ Medidas de Seguridad

| Medida | Descripción |
|--------|-------------|
| **Validación MIME** | Verificación real del tipo de archivo con `python-magic` |
| **Límite de Tamaño** | Máximo configurable (10MB por defecto) |
| **Antivirus ClamAV** | Escaneo automático de malware |
| **Aislamiento de Procesos** | Extracción en subprocesos con timeout |
| **Limpieza Automática** | Eliminación de archivos temporales |
| **API Key** | Autenticación para endpoints administrativos |
| **UUIDs** | Nombres de archivos aleatorios |
| **Cabeceras Seguras** | Headers HTTP para prevenir ataques |
| **CORS Restringido** | Dominios permitidos explícitamente |
| **Logging** | Registro de actividades para auditoría |

### ⚙️ Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `MAX_UPLOAD_SIZE` | Tamaño máximo en bytes | `10485760` |
| `ADMIN_KEY` | Clave para endpoints admin | `secure_key_here` |
| `CLAMAV_HOST` | Host ClamAV | `clamav` |
| `CLAMAV_PORT` | Puerto ClamAV | `3310` |

### 🧪 Endpoints

| Método | Endpoint | Descripción | Seguridad |
|--------|----------|-------------|----------|
| `POST` | `/upload-file/` | Subir PDF/TXT para conversión | Validación completa |
| `GET` | `/audio/{file_id}.mp3` | Descargar audio generado | Archivos aislados |
| `DELETE` | `/audio/cleanup` | Limpiar todos los audios | API Key requerida |
| `GET` | `/health` | Estado de la API | Público |

### 🚀 Despliegue en Producción

- Usa HTTPS con NGINX/Traefik/Caddy
- Configura variables de entorno de forma segura
- Ejecuta ClamAV en contenedor Docker
- Desactiva `--reload` en producción
- Monitorea logs y almacenamiento

## 🤝 Contribuciones

¡Contribuciones bienvenidas! Sigue estos pasos:

1. **Fork** el repositorio
2. **Crea** una rama: `git checkout -b feature/nueva-funcionalidad`
3. **Commit** cambios: `git commit -m 'Agrega nueva funcionalidad'`
4. **Push** a la rama: `git push origin feature/nueva-funcionalidad`
5. **Abre** un Pull Request

Asegúrate de seguir las mejores prácticas de Angular y FastAPI.

## 📄 Licencia

Este proyecto está bajo la **Licencia MIT**. Ver [`LICENSE`](LICENSE) para detalles.

## 📧 Contacto

**Antonio De la Rua Fernández**

- **Email**: [ruxxdeveloper@gmail.com](mailto:ruxxdeveloper@gmail.com)
- **LinkedIn**: [Tu Perfil](https://www.linkedin.com/in/antonio-de-la-rua-fernandez-508b98243/)
- **Sitio Web**: [Tu Portfolio](https://ruxx.devspn.tech/)
- **GitHub**: [@RuXx](https://github.com/Antonio-DelaRua)

---

⭐ **¡Gracias por visitar mi portfolio!** Espero que te inspire en tus proyectos.
