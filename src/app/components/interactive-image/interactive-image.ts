import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../services/language-service'; 
import { SendChat } from '../../services/send-chat';

@Component({
  selector: 'app-interactive-image',
  standalone: true,
  imports: [FormsModule, CommonModule, TranslateModule],
  templateUrl: './interactive-image.html',
  styleUrls: ['./interactive-image.css'],
})
export class InteractiveImageComponent implements OnInit {
  isActivated = false;
  isChatOpen = false;
  chatMessage = '';
  messages: string[] = [];
  showImage = false;
  showHint = false;
  loading = false;
  private clickTimeout: any = null;

  constructor(
    public translate: TranslateService,
    private languageService: LanguageService,
    private sendChatService: SendChat
  ) {}

  ngOnInit() {
    this.languageService.currentLang$.subscribe(lang => {
      this.translate.use(lang);
    });
    this.translate.use(this.languageService.currentLang);
  }

  activateChatbot() {
    this.isActivated = true;
    this.showImage = true;
  }

  onImageClick(event: MouseEvent) {
    event.preventDefault();
    if (this.clickTimeout) {
      clearTimeout(this.clickTimeout);
      this.clickTimeout = null;
      return;
    }
    this.clickTimeout = setTimeout(() => {
      this.showHintMessage();
      this.clickTimeout = null;
    }, 300);
  }

  onDoubleClick(event: MouseEvent) {
    event.preventDefault();
    if (this.clickTimeout) {
      clearTimeout(this.clickTimeout);
      this.clickTimeout = null;
    }
    this.openChat();
  }

  showHintMessage() {
    if (!this.isChatOpen) {
      this.showHint = true;
      setTimeout(() => {
        this.showHint = false;
      }, 3000);
    }
  }

  openChat() {
    this.isChatOpen = true;
    this.showHint = false;
    this.translate.get('CHATBOX.WELCOME_MESSAGE').subscribe((message: string) => {
      this.messages.push(`🤖 ${message}`);
    });
  }

  closeChat() {
    this.isChatOpen = false;
    this.messages = [];
    this.chatMessage = '';
  }

  async sendMessage() {
    if (!this.chatMessage.trim()) return;

    const userMessage = this.chatMessage.trim();
    this.messages.push(`🧑‍💻 Tú: ${userMessage}`);
    this.chatMessage = '';
    this.loading = true;

    try {
      // ✅ Ahora sí coincide el nombre del método
      const response = await this.sendChatService.getData(userMessage);

      // ✅ Manejo flexible de la respuesta - ajusta según lo que devuelva n8n
      let aiMessage = 'No response';
      
      if (typeof response === 'string') {
        aiMessage = response;
      } else if (response?.output) {
        aiMessage = response.output;
      } else if (response?.data) {
        aiMessage = response.data;
      } else if (response) {
        aiMessage = JSON.stringify(response);
      }

      this.messages.push(`🤖 IA: ${aiMessage}`);
      
    } catch (error: any) {
      console.error('Error enviando mensaje:', error);
      
      // ✅ Mensajes de error más específicos
      if (error.message?.includes('Workflow no activado') || error.status === 404) {
        this.messages.push('⚠️ El asistente no está disponible en este momento. Por favor, intenta más tarde.');
      } else {
        this.messages.push('⚠️ Error de conexión. Verifica tu internet e intenta nuevamente.');
      }
    } finally {
      this.loading = false;
    }
  }
}