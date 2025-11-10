from flask import Flask
from flask_sqlalchemy import SQLAlchemy
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

with app.app_context():
    books = Book.query.all()
    print(f'Total books: {len(books)}')
    for book in books:
        print(f'ID: {book.id}, Title: {book.title}, Text length: {len(book.text_content)}')
        # Check for encoding issues
        try:
            book.text_content.encode('utf-8')
            print(f'  UTF-8 encoding: OK')
        except UnicodeEncodeError as e:
            print(f'  UTF-8 encoding ERROR: {e}')

        # Check for non-ASCII characters
        non_ascii = [char for char in book.text_content if ord(char) > 127]
        if non_ascii:
            print(f'  Non-ASCII chars: {len(non_ascii)} found')
            print(f'  Sample non-ASCII: {non_ascii[:10]}')
        else:
            print(f'  Non-ASCII chars: None')