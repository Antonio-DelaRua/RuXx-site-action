#!/usr/bin/env python3
"""
Script para agregar libros manualmente a la base de datos.
Uso: python add_book.py "Título del libro" "ruta/al/archivo.txt" "Descripción opcional" "url/de/imagen/opcional"
"""

import sys
import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

# Configurar Flask app
app = Flask(__name__)
import os
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
db_path = os.path.join(BASE_DIR, "instance", "books.db")
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{db_path.replace(os.sep, '/')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Book model (igual que en api.py)
class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    text_content = db.Column(db.Text, nullable=False)
    description = db.Column(db.Text, nullable=True)
    image_url = db.Column(db.String(500), nullable=True)
    upload_date = db.Column(db.DateTime, default=datetime.utcnow)

def add_book(title, text_file_path, description=None, image_url=None):
    """Agrega un libro a la base de datos desde un archivo de texto."""

    # Verificar que el archivo existe
    if not os.path.exists(text_file_path):
        print(f"Error: El archivo '{text_file_path}' no existe.")
        return False

    # Leer el contenido del archivo
    try:
        with open(text_file_path, 'r', encoding='utf-8') as f:
            text_content = f.read()
    except Exception as e:
        print(f"Error al leer el archivo: {e}")
        return False

    # Verificar que el texto no esté vacío
    if not text_content.strip():
        print("Error: El archivo está vacío.")
        return False

    # Crear el libro
    book = Book(
        title=title,
        text_content=text_content,
        description=description,
        image_url=image_url
    )

    # Agregar a la base de datos
    with app.app_context():
        db.create_all()  # Crear tablas si no existen
        db.session.add(book)
        db.session.commit()

        print("Libro agregado exitosamente:")
        print(f"  ID: {book.id}")
        print(f"  Título: {book.title}")
        print(f"  Longitud del texto: {len(text_content)} caracteres")
        print(f"  Descripción: {book.description or 'Sin descripción'}")
        print(f"  URL de imagen: {book.image_url or 'Sin imagen'}")
        print(f"  Fecha: {book.upload_date}")

    return True

def main():
    if len(sys.argv) < 3:
        print("Uso: python add_book.py \"Título\" \"ruta/al/archivo.txt\" [\"Descripción\"] [\"URL de imagen\"]")
        print("\nEjemplos:")
        print("  python add_book.py \"Mi Libro\" libro.txt")
        print("  python add_book.py \"Mi Libro\" libro.txt \"Una descripción breve\"")
        print("  python add_book.py \"Mi Libro\" libro.txt \"Descripción\" \"https://ejemplo.com/imagen.jpg\"")
        return

    title = sys.argv[1]
    text_file_path = sys.argv[2]
    description = sys.argv[3] if len(sys.argv) > 3 else None
    image_url = sys.argv[4] if len(sys.argv) > 4 else None

    success = add_book(title, text_file_path, description, image_url)
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()