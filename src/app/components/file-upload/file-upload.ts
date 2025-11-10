import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AudioBookService, Book } from '../../services/audio-book';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './file-upload.html',
  styleUrls: ['./file-upload.css']
})
export class FileUploadComponent implements OnInit, OnDestroy {
  books: Book[] = [];
  isLoading = false;
  errorMessage = '';
  selectedBook: Book | null = null;
  isPlaying = false;
  audio = new Audio();

  constructor(private audioBookService: AudioBookService) {
    // Audio event listeners
    this.audio.addEventListener('loadedmetadata', () => {
      // Force change detection when metadata loads
      this.updateProgress();
    });

    this.audio.addEventListener('timeupdate', () => {
      this.updateProgress();
    });

    this.audio.addEventListener('ended', () => {
      this.isPlaying = false;
      this.selectedBook = null;
    });

    this.audio.addEventListener('error', () => {
      this.isPlaying = false;
      this.selectedBook = null;
    });
  }

  ngOnInit(): void {
    this.loadBooks();
  }

  ngOnDestroy() {
    // Cleanup audio
    this.audio.pause();
    this.audio.src = '';
  }

  getPagesCount(textLength: number): number {
    // Rough estimation: ~2500 characters per page
    return Math.ceil(textLength / 2500);
  }

  getProgressPercentage(): number {
    if (!this.audio.duration) return 0;
    return (this.audio.currentTime / this.audio.duration) * 100;
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  updateProgress(): void {
    // Force change detection for progress updates
    // This method is called by audio event listeners
  }

  seekAudio(event: any): void {
    const seekTime = event.target.value;
    this.audio.currentTime = seekTime;
  }

  rewindAudio(): void {
    this.audio.currentTime = Math.max(0, this.audio.currentTime - 10);
  }

  forwardAudio(): void {
    this.audio.currentTime = Math.min(this.audio.duration || 0, this.audio.currentTime + 10);
  }

  loadBooks(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.audioBookService.getBooks().subscribe({
      next: (books: Book[]) => {
        this.books = books;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.isLoading = false;
        this.errorMessage = error.error?.error || 'Error al cargar los libros';
        console.error('Load books error:', error);
      }
    });
  }

  playBook(book: Book): void {
    if (this.selectedBook?.id === book.id && this.isPlaying) {
      // Pause current playback
      this.audio.pause();
      this.isPlaying = false;
      return;
    }

    if (this.selectedBook?.id === book.id && !this.isPlaying) {
      // Resume current playback
      this.audio.play().then(() => {
        this.isPlaying = true;
      }).catch(error => {
        console.error('Error resuming audio:', error);
        this.isPlaying = false;
      });
      return;
    }

    // Start new book playback
    this.audio.pause();
    this.audio.currentTime = 0;

    this.selectedBook = book;
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
  }

  deleteBook(book: Book): void {
    if (confirm(`¿Estás seguro de que quieres eliminar "${book.title}"?`)) {
      this.audioBookService.deleteBook(book.id).subscribe({
        next: () => {
          this.books = this.books.filter(b => b.id !== book.id);
        },
        error: (error: any) => {
          this.errorMessage = 'Error al eliminar el libro';
          console.error('Delete book error:', error);
        }
      });
    }
  }
}