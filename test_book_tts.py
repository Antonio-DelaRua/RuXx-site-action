from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import pyttsx3
import comtypes
import os
from datetime import datetime

app = Flask(__name__)
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
db_path = os.path.join(BASE_DIR, "instance", "books.db")
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{db_path.replace(os.sep, '/')}"
db = SQLAlchemy(app)

class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    text_content = db.Column(db.Text, nullable=False)
    description = db.Column(db.Text, nullable=True)
    image_url = db.Column(db.String(500), nullable=True)
    upload_date = db.Column(db.DateTime, default=datetime.utcnow)

def prepare_text_for_tts(text: str) -> str:
    import re
    text = re.sub(r'\n+', '. ', text)
    text = re.sub(r'([,;:])', r'\1 ', text)
    text = re.sub(r'([.?!])', r'\1  ', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def test_book_tts(book_id):
    print(f"=== TESTING BOOK {book_id} TTS ===")

    with app.app_context():
        book = Book.query.get(book_id)
        if not book:
            print(f"Book {book_id} not found")
            return

        print(f"Book: {book.title}")
        print(f"Text length: {len(book.text_content)}")

        # Prepare text
        text = prepare_text_for_tts(book.text_content)
        print(f"Prepared text length: {len(text)}")

        # Take a sample for testing
        sample_text = text[:1000]  # First 1000 characters
        print(f"Testing with sample text (length: {len(sample_text)})")
        print(f"Sample: {sample_text[:200]}...")

        try:
            # Initialize TTS
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

            # Test with sample
            output_file = f"test_book_{book_id}_sample.wav"
            print(f"Saving sample to: {output_file}")
            engine.save_to_file(sample_text, output_file)
            engine.runAndWait()

            if os.path.exists(output_file):
                size = os.path.getsize(output_file)
                print(f"Sample file created, size: {size} bytes")
                if size == 0:
                    print("ERROR: Sample file is empty!")
                else:
                    print("SUCCESS: Sample TTS worked")
            else:
                print("ERROR: Sample file not created")

        except Exception as e:
            print(f"TTS test failed: {e}")
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    # Test both books
    test_book_tts(1)  # Matatrolls
    test_book_tts(2)  # Alas de plata