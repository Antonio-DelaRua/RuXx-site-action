import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AudioBookService, Book } from '../../services/audio-book';

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
  isGeneratingAudio = false; // Nuevo estado para generación de audio
  audio = new Audio();

  constructor(private audioBookService: AudioBookService) {
    // === AUDIO EVENTOS ===
    this.audio.addEventListener('loadedmetadata', () => this.updateProgress());
    this.audio.addEventListener('timeupdate', () => this.updateProgress());
    this.audio.addEventListener('ended', () => this.handleAudioEnded());
    this.audio.addEventListener('error', () => this.handleAudioError());
  }

  ngOnInit(): void {
    this.loadBooks();
  }

  ngOnDestroy(): void {
    this.cleanupAudio();
  }

  /* --------------------------
     FUNCIONES AUXILIARES
  ---------------------------*/
  getPagesCount(textLength: number): number {
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
    // Solo fuerza la detección visual
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

  /* --------------------------
     CARGA DE LIBROS
  ---------------------------*/
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

  /* --------------------------
     REPRODUCCIÓN Y FLIP 3D
  ---------------------------*/
  playBook(book: Book): void {
    // Si ya está sonando este mismo libro → pausa y vuelve al frente
    if (this.selectedBook?.id === book.id && this.isPlaying) {
      this.audio.pause();
      this.isPlaying = false;
      return;
    }

    // Si está pausado → reanudar
    if (this.selectedBook?.id === book.id && !this.isPlaying) {
      this.audio.play().then(() => {
        this.isPlaying = true;
      }).catch(error => {
        console.error('Error al reanudar audio:', error);
        this.isPlaying = false;
      });
      return;
    }

    // Nuevo libro seleccionado → voltear card INMEDIATAMENTE
    this.stopAudio(false); // no limpiar selectedBook aún
    this.selectedBook = book;
    this.isPlaying = false; // Aún no está reproduciendo, pero la card ya gira

    // Timeout para mostrar indicador de carga solo si tarda
    let loadingTimeout = setTimeout(() => {
      this.isGeneratingAudio = true;
    }, 2000); // Mostrar loading después de 2 segundos

    // Fetch audio blob from API en background
    this.audioBookService.getAudio(book.id).subscribe({
      next: (audioBlob: Blob) => {
        clearTimeout(loadingTimeout); // Cancelar timeout si carga rápido
        this.isGeneratingAudio = false; // Asegurar que esté oculto
        const audioUrl = URL.createObjectURL(audioBlob);
        this.audio.src = audioUrl;

        // Cargar y reproducir cuando esté listo
        this.audio.load();
        this.audio.play().then(() => {
          this.isPlaying = true; // Ahora sí está reproduciendo
        }).catch(error => {
          console.error('Error al reproducir audio:', error);
          this.isPlaying = false;
          this.selectedBook = null;
          URL.revokeObjectURL(audioUrl); // Clean up
        });
      },
      error: (error: any) => {
        clearTimeout(loadingTimeout); // Cancelar timeout en error
        this.isGeneratingAudio = false; // Ocultar indicador
        console.error('Error al cargar audio:', error);
        this.errorMessage = 'Error al cargar el audio del libro';
        this.isPlaying = false;
        this.selectedBook = null;
      }
    });
  }

  stopAudio(resetBook: boolean = true): void {
    this.audio.pause();
    this.isPlaying = false;
    if (resetBook) {
      this.selectedBook = null;
      // Revoke object URL when stopping
      if (this.audio.src) {
        URL.revokeObjectURL(this.audio.src);
      }
    }
  }

  /* --------------------------
      EVENTOS AUDIO
   ---------------------------*/
  private handleAudioEnded(): void {
    this.isPlaying = false;
    this.selectedBook = null;
    // Revoke object URL to free memory
    if (this.audio.src) {
      URL.revokeObjectURL(this.audio.src);
    }
  }

  private handleAudioError(): void {
    console.error('Audio playback error');
    this.isPlaying = false;
    this.selectedBook = null;
    // Revoke object URL to free memory
    if (this.audio.src) {
      URL.revokeObjectURL(this.audio.src);
    }
  }

  /* --------------------------
      LIMPIEZA
   ---------------------------*/
  private cleanupAudio(): void {
    this.audio.pause();
    if (this.audio.src) {
      URL.revokeObjectURL(this.audio.src);
    }
    this.audio.src = '';
    if ((this as any).playTimeout) {
      clearTimeout((this as any).playTimeout);
    }
  }

  /* --------------------------
     ELIMINAR LIBRO
  ---------------------------*/
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
