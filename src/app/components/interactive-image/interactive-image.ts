import { Component, ElementRef, OnInit, ViewChild, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { LanguageService } from '../../services/language-service';
import { SendChat } from '../../services/send-chat';
import { BreakpointService } from '../../services/breakpoints';

@Component({
  selector: 'app-interactive-image',
  standalone: true,
  imports: [FormsModule, CommonModule, TranslateModule, HttpClientModule],
  templateUrl: './interactive-image.html',
  styleUrls: ['./interactive-image.css'],
})
export class InteractiveImageComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatMessages') private chatMessagesContainer!: ElementRef;
  @ViewChild('chatInput') private chatInput!: ElementRef;

  isActivated = false;
  isChatOpen = false;
  chatMessage = '';
  messages: string[] = [];
  showImage = false;
  showHint = false;
  loading = false;
  isMobile = false;
  private clickTimeout: any = null;
  private shouldScroll = false;

  constructor(
    public translate: TranslateService,
    private languageService: LanguageService,
    private sendChatService: SendChat,
    private cdRef: ChangeDetectorRef,
    private breakpointService: BreakpointService
  ) {}

  ngOnInit() {
    this.languageService.currentLang$.subscribe(lang => {
      this.translate.use(lang);
    });
    this.translate.use(this.languageService.currentLang);

    this.breakpointService.isMobile$.subscribe(isMobile => {
      this.isMobile = isMobile;
    });
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

  ngAfterViewChecked() {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  private scrollToBottom(): void {
    try {
      if (this.chatMessagesContainer?.nativeElement) {
        const element = this.chatMessagesContainer.nativeElement;
        element.scrollTop = element.scrollHeight;
      }
    } catch(err) { 
      console.error('Error scrolling to bottom:', err);
    }
  }

  private triggerScroll() {
    this.shouldScroll = true;
    this.cdRef.detectChanges();
  }

  openChat() {
    this.isChatOpen = true;
    this.showHint = false;
    this.translate.get('CHATBOX.WELCOME_MESSAGE').subscribe((message: string) => {
      this.messages.push(`🤖 ${message}`);
      this.triggerScroll();
      this.focusInput();
    });
  }

  closeChat() {
    this.isChatOpen = false;
    this.messages = [];
    this.chatMessage = '';
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  async sendMessage() {
    if (!this.chatMessage.trim()) return;

    const userMessage = this.chatMessage.trim();
    this.messages.push(`🧑‍💻 Tú: ${userMessage}`);
    this.chatMessage = '';
    this.loading = true;
    
    this.triggerScroll();

    try {
      console.log('🔄 Enviando mensaje a n8n...');
      const response = await this.sendChatService.getData(userMessage);
      console.log('✅ Respuesta recibida de n8n:', response);

      let aiMessage = 'No se recibió respuesta del asistente.';
      
      // Manejo de respuesta
      if (typeof response === 'string') {
        aiMessage = response;
      } else if (response?.output) {
        aiMessage = response.output;
      } else if (response?.text) {
        aiMessage = response.text;
      } else if (response?.message) {
        aiMessage = response.message;
      } else if (response?.response) {
        aiMessage = response.response;
      } else if (response?.body) {
        aiMessage = response.body;
      } else if (response) {
        const stringProperties = Object.values(response).filter(val => typeof val === 'string');
        if (stringProperties.length > 0) {
          aiMessage = stringProperties[0] as string;
        } else {
          aiMessage = JSON.stringify(response);
        }
      }

      console.log('📝 Mensaje extraído:', aiMessage);
      this.messages.push(`🤖 IA: ${aiMessage}`);
      
    } catch (error: any) {
      console.error('❌ Error enviando mensaje:', error);
      
      let errorMessage = '⚠️ Error de conexión. Verifica tu internet e intenta nuevamente.';
      
      if (error?.status === 0 || error?.message?.includes('CORS')) {
        errorMessage = '⚠️ Error de CORS: El servidor no permite conexiones desde localhost.';
      } else if (error?.message?.includes('Workflow no activado') || error?.status === 404) {
        errorMessage = '⚠️ El asistente no está disponible en este momento. Por favor, intenta más tarde.';
      } else if (error?.status === 500) {
        errorMessage = '⚠️ Error interno del servidor. Contacta al administrador.';
      } else if (error?.error?.message) {
        errorMessage = `⚠️ Error: ${error.error.message}`;
      } else if (error?.message) {
        errorMessage = `⚠️ Error: ${error.message}`;
      }
      
      this.messages.push(errorMessage);
    } finally {
      this.loading = false;
      setTimeout(() => this.triggerScroll(), 100);
    }
  }

  focusInput() {
    setTimeout(() => {
      if (this.chatInput?.nativeElement) {
        this.chatInput.nativeElement.focus();
      }
    }, 100);
  }
}