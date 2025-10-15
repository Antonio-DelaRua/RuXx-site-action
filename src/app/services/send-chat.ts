import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { v4 as uuidv4} from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class SendChat {
  private n8nWebhookUrl = 'https://automation.durbanod.com/webhook-test/ecc6e333-4f1a-4f7e-801a-d84ce040f972';  

  constructor(private http: HttpClient) {}

  // Método que coincide con tu componente
  async getData(message: string): Promise<any> {
    try {
      const payload = {
        chatInput: message,
        timestamp: new Date().toISOString(),
        source: 'angular-app',
        sessionId: uuidv4()
      };

      const response = await this.http.post(this.n8nWebhookUrl, payload).toPromise();
      return response;
    } catch (error) {
      console.error('Error in SendChat service:', error);
      throw error;
    }
  }

  // Método alternativo más robusto
  sendMessage(message: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const payload = {
      chatInput: message,
      timestamp: new Date().toISOString()
    };

    return this.http.post(this.n8nWebhookUrl, payload, { headers });
  }
}