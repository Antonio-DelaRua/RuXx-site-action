import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class SendChat {
  private n8nWebhookUrl = 'https://automation.durbanod.com/webhook/ecc6e333-4f1a-4f7e-801a-d84ce040f972';  

  constructor(private http: HttpClient) {}

  async getData(message: string): Promise<any> {
    try {
      // CORRECCIÓN: Enviar chatInput directamente en el nivel raíz
      const payload = {
        chatInput: message,  // ← Directamente aquí, no dentro de 'body'
        timestamp: new Date().toISOString(),
        source: 'angular-app',
        sessionId: uuidv4()
      };

      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      });

      console.log('📤 Enviando a n8n:', JSON.stringify(payload, null, 2));
      
      const response = await this.http.post(this.n8nWebhookUrl, payload, { headers }).toPromise();
      return response;
    } catch (error: any) {
      console.error('Error in SendChat service:', error);
      throw error;
    }
  }

  // Método alternativo también corregido
  sendMessage(message: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const payload = {
      chatInput: message,  // ← Directamente aquí también
      timestamp: new Date().toISOString()
    };

    return this.http.post(this.n8nWebhookUrl, payload, { headers });
  }
}