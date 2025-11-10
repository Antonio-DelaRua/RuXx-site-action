from flask import Flask, request, jsonify, send_file, Response
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
import os
import re
import pyttsx3
import io
import time
import random
import wave
import struct
import math
import hashlib

app = Flask(__name__)

# Config
import os
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
db_path = os.path.join(BASE_DIR, "instance", "books.db")
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{db_path.replace(os.sep, '/')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_POOL_SIZE'] = 20  # Increase pool size
app.config['SQLALCHEMY_MAX_OVERFLOW'] = 30  # Increase overflow limit
app.config['AUDIO_CACHE_DIR'] = 'audio_cache'

# Serve static files from public directory
app.static_folder = 'public'
app.static_url_path = '/'

# Ensure cache directory exists
os.makedirs(app.config['AUDIO_CACHE_DIR'], exist_ok=True)

# Enable CORS for all routes
CORS(app, origins=["http://localhost:4200", "http://localhost:51615", "http://localhost:50547"])

db = SQLAlchemy(app)

# Book model
class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    text_content = db.Column(db.Text, nullable=False)
    description = db.Column(db.Text, nullable=True)
    image_url = db.Column(db.String(500), nullable=True)
    upload_date = db.Column(db.DateTime, default=datetime.utcnow)

# Helper functions
def prepare_text_for_tts(text: str) -> str:
    text = re.sub(r'\n+', '. ', text)
    text = re.sub(r'([,;:])', r'\1 ', text)
    text = re.sub(r'([.?!])', r'\1  ', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()


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
    return jsonify({'message': 'Book deleted'}), 200

def get_audio_cache_path(text_hash):
    return os.path.join(app.config['AUDIO_CACHE_DIR'], f"{text_hash}.mp3")

@app.route('/play/<int:book_id>', methods=['GET'])
def play_book(book_id):
    try:
        book = Book.query.get_or_404(book_id)
        text = prepare_text_for_tts(book.text_content)
        print(f"Playing book {book_id}: {book.title} (length: {len(text)})")

        # Create hash of the text for caching
        text_hash = hashlib.md5(text.encode('utf-8')).hexdigest()
        cache_path = get_audio_cache_path(text_hash)

        # Check if audio is cached
        if os.path.exists(cache_path):
            print("Serving cached audio")
            return send_file(cache_path, mimetype='audio/wav')

        # Generate TTS for uncached books with proper error handling
        print("Book not cached, generating TTS...")
        lock_file = cache_path + '.lock'

        # Check if another process is already generating this audio
        if os.path.exists(lock_file):
            print("Another process is generating this audio, returning beep")
            return generate_fallback_audio()

        try:
            # Create lock file
            with open(lock_file, 'w') as f:
                f.write(str(os.getpid()))

            import comtypes
            comtypes.CoInitialize()
            engine = pyttsx3.init()

            # Configure voice
            voices = engine.getProperty('voices')
            if voices:
                for voice in voices:
                    if 'spanish' in voice.name.lower() or 'español' in voice.name.lower() or 'es-es' in voice.name.lower():
                        engine.setProperty('voice', voice.id)
                        print(f"Selected voice: {voice.name}")
                        break

            engine.setProperty('rate', 180)
            engine.setProperty('volume', 0.9)

            # Limit text length to avoid issues
            MAX_TEXT_LENGTH = 25000
            if len(text) > MAX_TEXT_LENGTH:
                print(f"Text too long ({len(text)}), truncating to {MAX_TEXT_LENGTH}")
                text = text[:MAX_TEXT_LENGTH] + "..."

            print(f"Generating TTS for {len(text)} characters")
            engine.save_to_file(text, cache_path)
            engine.runAndWait()

            # Check if file was created successfully
            if os.path.exists(cache_path) and os.path.getsize(cache_path) > 0:
                print(f"TTS generated successfully, size: {os.path.getsize(cache_path)} bytes")
                return send_file(cache_path, mimetype='audio/wav')
            else:
                print("TTS generation failed - empty or missing file")
                return generate_fallback_audio()

        except Exception as e:
            print(f"TTS generation failed: {str(e)}")
            return generate_fallback_audio()
        finally:
            # Remove lock file
            if os.path.exists(lock_file):
                try:
                    os.remove(lock_file)
                except:
                    pass

    except Exception as e:
        print(f"Error in play_book: {str(e)}")
        return generate_fallback_audio()

def combine_audio_files(audio_files, output_file):
    """Combine multiple WAV files into one"""
    import wave
    import struct

    if not audio_files:
        raise Exception("No audio files to combine")

    # Read all audio data
    combined_data = []
    sample_rate = None
    channels = None
    sampwidth = None

    for audio_file in audio_files:
        with wave.open(audio_file, 'rb') as wav:
            if sample_rate is None:
                sample_rate = wav.getframerate()
                channels = wav.getnchannels()
                sampwidth = wav.getsampwidth()
            elif sample_rate != wav.getframerate() or channels != wav.getnchannels() or sampwidth != wav.getsampwidth():
                raise Exception("Audio files have incompatible formats")

            frames = wav.readframes(wav.getnframes())
            combined_data.append(frames)

    # Write combined file
    with wave.open(output_file, 'wb') as output_wav:
        output_wav.setnchannels(channels)
        output_wav.setsampwidth(sampwidth)
        output_wav.setframerate(sample_rate)
        for data in combined_data:
            output_wav.writeframes(data)

def generate_fallback_audio():
    """Generate a simple beep sound when TTS fails"""
    # Create a simple beep using a sine wave (basic fallback)
    import wave
    import struct
    import math

    # Generate a 1-second beep at 440Hz
    sample_rate = 44100
    duration = 1
    frequency = 440

    # Generate sine wave
    samples = []
    for i in range(int(sample_rate * duration)):
        sample = int(32767 * math.sin(2 * math.pi * frequency * i / sample_rate))
        samples.append(struct.pack('<h', sample))

    # Create WAV file in memory
    wav_buffer = io.BytesIO()
    with wave.open(wav_buffer, 'wb') as wav_file:
        wav_file.setnchannels(1)  # Mono
        wav_file.setsampwidth(2)  # 16-bit
        wav_file.setframerate(sample_rate)
        wav_file.writeframes(b''.join(samples))

    wav_buffer.seek(0)
    return Response(wav_buffer, mimetype='audio/wav')

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    with app.app_context():
        import os
        db_path = os.path.join(os.getcwd(), 'instance', 'books.db')
        print(f"Current working directory: {os.getcwd()}")
        print(f"Database path: {db_path}")
        print(f"Instance directory exists: {os.path.exists('instance')}")
        print(f"Database file exists: {os.path.exists(db_path)}")
        if os.path.exists('instance'):
            print(f"Instance directory permissions: {oct(os.stat('instance').st_mode)}")
        if os.path.exists(db_path):
            print(f"Database file permissions: {oct(os.stat(db_path).st_mode)}")
        try:
            db.create_all()
            print("Database tables created successfully")
        except Exception as e:
            print(f"Error creating database: {e}")
            import traceback
            traceback.print_exc()
    app.run(debug=True, host='0.0.0.0', port=8000)
