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
    print('Books and their image URLs:')
    for book in books:
        print(f'ID: {book.id}, Title: {book.title}')
        print(f'  Image URL: {book.image_url or "None"}')

        # Check if image file exists in public/assets
        if book.image_url:
            # Extract filename from URL
            if book.image_url.startswith('/assets/'):
                filename = book.image_url[8:]  # Remove '/assets/'
                image_path = os.path.join(BASE_DIR, 'public', 'assets', filename)
                exists = os.path.exists(image_path)
                print(f'  Image file exists: {exists} (path: {image_path})')
            else:
                print(f'  Image URL format unexpected: {book.image_url}')
        else:
            print('  No image URL set')
        print()