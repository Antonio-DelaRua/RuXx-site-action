import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { trigger, style, animate, transition } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { AudioBookService } from '../../services/audio-book';

interface Book {
  id: number;
  title: string;
  text_length: number;
  upload_date: string;
}

@Component({
  selector: 'app-audiolibro',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './audiolibro.html',
  styleUrls: ['./audiolibro.css'],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('800ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class Audiolibro implements OnInit {
  isLoaded = false;
  books: Book[] = [];
  currentPlayingBook: Book | null = null;
  isPlaying = false;
  audio = new Audio();

  constructor(private http: HttpClient, private audioBookService: AudioBookService) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.isLoaded = true;
    }, 300);
    this.loadBooks();
  }

  loadBooks(): void {
    this.http.get<Book[]>('http://127.0.0.1:8000/books').subscribe({
      next: (books) => {
        this.books = books;
      },
      error: (error) => {
        console.error('Error loading books:', error);
      }
    });
  }

  playBook(book: Book): void {
    if (this.currentPlayingBook?.id === book.id && this.isPlaying) {
      this.audio.pause();
      this.isPlaying = false;
      return;
    }

    // Stop any current playback
    this.audio.pause();
    this.audio.currentTime = 0;

    this.currentPlayingBook = book;
    this.audio.src = `http://127.0.0.1:8000/play/${book.id}`;

    // Wait a bit before loading to avoid conflicts
    setTimeout(() => {
      this.audio.load();
      this.audio.play().then(() => {
        this.isPlaying = true;
      }).catch(error => {
        console.error('Error playing audio:', error);
        this.isPlaying = false;
      });
    }, 100);

    this.audio.onended = () => {
      this.isPlaying = false;
      this.currentPlayingBook = null;
    };

    this.audio.onerror = () => {
      this.isPlaying = false;
      this.currentPlayingBook = null;
    };
  }

  deleteBook(book: Book): void {
    if (confirm(`¿Eliminar "${book.title}"?`)) {
      this.http.delete(`http://127.0.0.1:8000/books/${book.id}`).subscribe({
        next: () => {
          this.books = this.books.filter(b => b.id !== book.id);
        },
        error: (error) => {
          console.error('Error deleting book:', error);
        }
      });
    }
  }
}
