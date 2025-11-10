import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

export interface Book {
  id: number;
  title: string;
  description: string;
  image_url: string;
  text_length: number;
  upload_date: string;
}

@Injectable({
  providedIn: 'root'
})
export class AudioBookService {
  private apiUrl = 'http://127.0.0.1:8000';
  private audioTimeout = 60000; // 60 segundos para cargar audio

  constructor(private http: HttpClient) { }

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/books`).pipe(
      timeout(30000), // Increased timeout to 30 seconds for book loading
      catchError(this.handleError.bind(this))
    );
  }

  getAudio(bookId: number): Observable<Blob> {
    const audioUrl = `${this.apiUrl}/play/${bookId}`;
    return this.http.get(audioUrl, { responseType: 'blob' }).pipe(
      timeout(this.audioTimeout),
      catchError(this.handleError.bind(this))
    );
  }

  deleteBook(bookId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/books/${bookId}`).pipe(
      timeout(10000),
      catchError(this.handleError.bind(this))
    );
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