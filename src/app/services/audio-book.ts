import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, timeout } from 'rxjs/operators';

export interface UploadResponse {
  file_id: string;
  original_filename: string;
  text_length: number;
  audio_url: string;
  text_preview: string;
}

export interface UploadProgress {
  progress: number;
  loaded: number;
  total?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AudioBookService {
  private apiUrl = 'http://localhost:8000';
  private uploadTimeout = 300000; // 5 minutos para conversión larga
  private audioTimeout = 30000; // 30 segundos para cargar audio

  constructor(private http: HttpClient) { }

  uploadFile(file: File): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<UploadResponse>(
      `${this.apiUrl}/upload-file/`, 
      formData
    ).pipe(
      timeout(this.uploadTimeout),
      catchError(this.handleError.bind(this))
    );
  }

  uploadFileWithProgress(file: File): Observable<UploadProgress | UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<UploadResponse>(
      `${this.apiUrl}/upload-file/`, 
      formData,
      { 
        reportProgress: true, 
        observe: 'events' 
      }
    ).pipe(
      timeout(this.uploadTimeout),
      map(event => this.getUploadProgress(event)),
      catchError(this.handleError.bind(this))
    );
  }

  private getUploadProgress(event: HttpEvent<any>): UploadProgress | UploadResponse {
    switch (event.type) {
      case HttpEventType.UploadProgress:
        const progress = event.total ? Math.round(100 * event.loaded / event.total) : 0;
        return {
          progress,
          loaded: event.loaded,
          total: event.total
        };
      case HttpEventType.Response:
        return event.body as UploadResponse;
      default:
        return { progress: 0, loaded: 0 };
    }
  }

  getAudioUrl(fileId: string): string {
    return `${this.apiUrl}/audio/${fileId}.mp3`;
  }

  healthCheck(): Observable<any> {
    return this.http.get(`${this.apiUrl}/health`).pipe(
      timeout(5000),
      catchError(this.handleError.bind(this))
    );
  }

  private handleError(error: HttpErrorResponse | any) {
    let errorMessage = 'Ocurrió un error inesperado';
    
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else if (error.name === 'TimeoutError') {
      // Timeout
      errorMessage = 'La operación tardó demasiado tiempo. Inténtalo de nuevo.';
    } else {
      // Error del servidor
      if (error.status === 0) {
        errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión.';
      } else if (error.error?.detail) {
        errorMessage = error.error.detail;
      } else {
        errorMessage = `Error ${error.status}: ${error.message}`;
      }
    }
    
    console.error('Error en AudioBookService:', error);
    return throwError(() => new Error(errorMessage));
  }
}