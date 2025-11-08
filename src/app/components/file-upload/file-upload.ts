import { Component, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AudioBookService, UploadResponse, UploadProgress } from '../../services/audio-book';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './file-upload.html',
  styleUrls: ['./file-upload.css']
})
export class FileUploadComponent implements OnChanges, OnDestroy {
  selectedFile: File | null = null;
  isUploading = false;
  uploadProgress = 0;
  uploadResult: UploadResponse | null = null;
  errorMessage = '';

  constructor(private audioBookService: AudioBookService) {}

  ngOnChanges(changes: SimpleChanges) {
    // Not used, but for interface
  }

  ngOnDestroy() {
    // Cleanup if needed
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

    // Use the new Flask endpoint
    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.audioBookService.uploadFile(formData).subscribe({
      next: (response: any) => {
        this.uploadResult = response;
        this.isUploading = false;
        this.uploadProgress = 100;
      },
      error: (error: any) => {
        this.isUploading = false;
        this.errorMessage = error.error?.error || 'Error al procesar el archivo';
        console.error('Upload error:', error);
      }
    });
  }

  getAudioUrl(): string {
    if (!this.uploadResult) return '';
    return `http://127.0.0.1:8000/play/${this.uploadResult.file_id}`;
  }
}