from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import os
import hashlib
import re
from datetime import datetime

app = Flask(__name__)
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
db_path = os.path.join(BASE_DIR, "instance", "books.db")
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{db_path.replace(os.sep, '/')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['AUDIO_CACHE_DIR'] = 'audio_cache'

db = SQLAlchemy(app)

class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    text_content = db.Column(db.Text, nullable=False)
    description = db.Column(db.Text, nullable=True)
    image_url = db.Column(db.String(500), nullable=True)
    upload_date = db.Column(db.DateTime, default=datetime.utcnow)

def prepare_text_for_tts(text: str) -> str:
    text = re.sub(r'\n+', '. ', text)
    text = re.sub(r'([,;:])', r'\1 ', text)
    text = re.sub(r'([.?!])', r'\1  ', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def get_audio_cache_path(text_hash):
    return os.path.join(app.config['AUDIO_CACHE_DIR'], f"{text_hash}.mp3")

def delete_book_and_cache(book_id):
    with app.app_context():
        book = Book.query.get(book_id)
        if book:
            print(f"Deleting book {book_id}: {book.title}")
            # Prepare text for hash
            text = prepare_text_for_tts(book.text_content)
            text_hash = hashlib.md5(text.encode('utf-8')).hexdigest()
            cache_path = get_audio_cache_path(text_hash)
            if os.path.exists(cache_path):
                os.remove(cache_path)
                print(f"Removed cache file: {cache_path}")
            else:
                print(f"No cache file found for book {book_id}")
            db.session.delete(book)
            db.session.commit()
            print(f"Book {book_id} deleted from database")
        else:
            print(f"Book {book_id} not found")

if __name__ == '__main__':
    # IDs to delete
    ids_to_delete = [7]
    for book_id in ids_to_delete:
        delete_book_and_cache(book_id)
    print("Deletion complete")