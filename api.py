from flask import Flask, jsonify, send_file, Response
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
import os, re, pyttsx3, io, math, wave, struct, comtypes

app = Flask(__name__)

# ---------------- CONFIG ----------------
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
db_path = os.path.join(BASE_DIR, "instance", "books.db")
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{db_path.replace(os.sep, '/')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['AUDIO_DIR'] = os.path.join(BASE_DIR, "audio_books")

os.makedirs(app.config['AUDIO_DIR'], exist_ok=True)
CORS(app, origins=["http://localhost:4200", "http://localhost:51615", "http://localhost:50547"])

db = SQLAlchemy(app)

# ---------------- MODELO ----------------
class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    text_content = db.Column(db.Text, nullable=False)
    description = db.Column(db.Text, nullable=True)
    image_url = db.Column(db.String(500), nullable=True)
    upload_date = db.Column(db.DateTime, default=datetime.utcnow)

# ---------------- FUNCIONES ----------------
def prepare_text_for_tts(text: str) -> str:
    text = re.sub(r'\n+', '. ', text)
    text = re.sub(r'([,;:])', r'\1 ', text)
    text = re.sub(r'([.?!])', r'\1  ', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def generate_fallback_audio():
    """Beep si el TTS falla"""
    sample_rate = 44100
    duration = 1
    frequency = 440
    samples = [int(32767 * math.sin(2 * math.pi * frequency * i / sample_rate)) for i in range(int(sample_rate * duration))]
    wav_buffer = io.BytesIO()
    with wave.open(wav_buffer, 'wb') as wav_file:
        wav_file.setnchannels(1)
        wav_file.setsampwidth(2)
        wav_file.setframerate(sample_rate)
        wav_file.writeframes(b''.join(struct.pack('<h', s) for s in samples))
    wav_buffer.seek(0)
    return Response(wav_buffer, mimetype='audio/wav')

# ---------------- ENDPOINTS ----------------
@app.route('/books', methods=['GET'])
def list_books():
    books = Book.query.all()
    return jsonify([{
        'id': b.id,
        'title': b.title,
        'description': b.description or '',
        'image_url': b.image_url or '',
        'text_length': len(b.text_content),
        'upload_date': b.upload_date.isoformat()
    } for b in books])

@app.route('/books/<int:book_id>', methods=['DELETE'])
def delete_book(book_id):
    book = Book.query.get_or_404(book_id)
    db.session.delete(book)
    db.session.commit()

    # Eliminar el MP3 si existe
    mp3_path = os.path.join(app.config['AUDIO_DIR'], f"{book.title.replace(' ', '_')}.mp3")
    if os.path.exists(mp3_path):
        os.remove(mp3_path)

    return jsonify({'message': 'Book deleted'}), 200


@app.route('/play/<int:book_id>', methods=['GET'])
def play_book(book_id):
    try:
        book = Book.query.get_or_404(book_id)
        safe_title = re.sub(r'[^a-zA-Z0-9_-]', '_', book.title)
        mp3_path = os.path.join(app.config['AUDIO_DIR'], f"{safe_title}.mp3")

        # Si ya existe el audio, servirlo directamente
        if os.path.exists(mp3_path):
            print(f"🎧 Reproduciendo audio existente: {mp3_path}")
            return send_file(mp3_path, mimetype='audio/mpeg')

        print(f"🎙️ Generando nuevo MP3 para el libro: {book.title}")

        text = prepare_text_for_tts(book.text_content)

        # Inicializar TTS
        comtypes.CoInitialize()
        engine = pyttsx3.init()
        voices = engine.getProperty('voices')
        for voice in voices:
            if any(word in voice.name.lower() for word in ['spanish', 'español', 'es-es']):
                engine.setProperty('voice', voice.id)
                break
        engine.setProperty('rate', 180)
        engine.setProperty('volume', 0.9)

        # Guardar audio directamente como MP3
        engine.save_to_file(text, mp3_path)
        engine.runAndWait()
        engine.stop()

        if os.path.exists(mp3_path):
            print(f"✅ MP3 generado correctamente: {mp3_path}")
            return send_file(mp3_path, mimetype='audio/mpeg')
        else:
            print("⚠️ No se generó el archivo MP3.")
            return generate_fallback_audio()

    except Exception as e:
        print(f"❌ Error al generar o reproducir audio: {e}")
        return generate_fallback_audio()


@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'})


# ---------------- MAIN ----------------
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=8000)
