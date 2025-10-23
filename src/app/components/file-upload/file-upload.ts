import { Component, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AudioBookService, UploadResponse, UploadProgress } from '../../services/audio-book';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './file-upload.html',
  styleUrls: ['./file-upload.css']
})
export class FileUploadComponent implements OnChanges, OnDestroy {
  selectedFile: File | null = null;
  isUploading = false;
  uploadProgress = 0;
  uploadResult: UploadResponse | null = null;
  errorMessage = '';

  // Audio player properties
  private audio = new Audio();
  isPlaying = false;
  currentTime = 0;
  duration = 0;
  volume = 1;
  audioUrl = '';

  constructor(private audioBookService: AudioBookService) {}

  ngOnChanges(changes: SimpleChanges) {
    // Not used, but for interface
  }

  ngOnDestroy() {
    this.audio.pause();
    this.audio = new Audio();
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file: File = target.files?.[0] as File;
    
    if (file) {
      // Validar tipo de archivo
      const allowedTypes = ['application/pdf', 'text/plain'];
      if (!allowedTypes.includes(file.type) && !file.name.toLowerCase().endsWith('.txt')) {
        this.errorMessage = 'Por favor, selecciona un archivo PDF o TXT';
        return;
      }

      // Validar tamaño (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        this.errorMessage = 'El archivo es demasiado grande. Máximo 10MB';
        return;
      }

      this.selectedFile = file;
      this.errorMessage = '';
      this.uploadFile();
    }
  }

  uploadFile(): void {
    if (!this.selectedFile) return;

    this.isUploading = true;
    this.uploadProgress = 0;
    this.uploadResult = null;
    this.audioUrl = '';
    this.audio.pause();
    this.audio = new Audio();
    this.isPlaying = false;
    this.currentTime = 0;
    this.duration = 0;

    this.audioBookService.uploadFileWithProgress(this.selectedFile)
      .subscribe({
        next: (response: UploadProgress | UploadResponse) => {
          if ('progress' in response) {
            // Es un evento de progreso
            this.uploadProgress = response.progress;
          } else {
            // Es la respuesta final
            this.uploadResult = response;
            this.isUploading = false;
            this.uploadProgress = 100;
            this.audioUrl = this.getAudioUrl();
            this.setupAudio();
          }
        },
        error: (error: any) => {
          this.isUploading = false;
          this.errorMessage = error.error?.detail || 'Error al procesar el archivo';
          console.error('Upload error:', error);
        }
      });
  }

  getAudioUrl(): string {
    if (!this.uploadResult) return '';
    return this.audioBookService.getAudioUrl(this.uploadResult.file_id);
  }

  // Audio player methods
  private setupAudio(): void {
    if (!this.audioUrl) return;
    // Reset previous audio
    this.audio.pause();
    this.audio = new Audio();

    this.audio.src = this.audioUrl;
    this.audio.preload = 'metadata';
    this.audio.load();

    this.audio.ontimeupdate = () => {
      this.currentTime = this.audio.currentTime;
    };

    this.audio.onloadedmetadata = () => {
      this.duration = this.audio.duration;
      console.log('Audio loaded. Duration:', this.duration);
    };

    this.audio.oncanplay = () => {
      console.log('Audio can play. Duration:', this.audio.duration, 'ReadyState:', this.audio.readyState);
    };

    this.audio.onended = () => {
      this.isPlaying = false;
    };

    this.audio.onerror = (error) => {
      console.error('Error en audio:', error);
      this.isPlaying = false;
    };
  }

  togglePlay(): void {
    if (this.isPlaying) {
      this.audio.pause();
    } else {
      this.audio.play().catch(error => {
        console.error('Error al reproducir:', error);
      });
    }
    this.isPlaying = !this.isPlaying;
  }

  stop(): void {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.isPlaying = false;
  }

  seekTo(event: Event): void {
    const target = event.target as HTMLInputElement;
    const newTime = parseFloat(target.value);
    if (this.audio.readyState >= 2) {
      const oldTime = this.audio.currentTime;
      this.audio.currentTime = newTime;
      console.log('Seek from', oldTime, 'to', newTime, 'Actual currentTime:', this.audio.currentTime);
      // Force update after a short delay to see if it sticks
      setTimeout(() => {
        console.log('After delay, currentTime is:', this.audio.currentTime);
      }, 100);
    } else {
      console.warn('Audio not ready for seeking. ReadyState:', this.audio.readyState);
    }
    this.currentTime = newTime;
  }

  onSeekInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.currentTime = parseFloat(target.value);
  }

  setVolume(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.volume = parseFloat(target.value);
    this.audio.volume = this.volume;
  }

  get currentTimeFormatted(): string {
    return this.formatTime(this.currentTime);
  }

  get durationFormatted(): string {
    return this.formatTime(this.duration);
  }

  private formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}