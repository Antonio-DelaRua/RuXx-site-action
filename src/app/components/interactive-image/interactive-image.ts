import { Component, ElementRef, OnInit, ViewChild, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
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
export class InteractiveImageComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatMessages') private chatMessagesContainer!: ElementRef;
  @ViewChild('chatInput') private chatInput!: ElementRef; // Para manejar el input
  
  isActivated = false;
  isChatOpen = false;
  chatMessage = '';
  messages: string[] = [];
  showImage = false;
  showHint = false;
  loading = false;
  private clickTimeout: any = null;
  private shouldScroll = false; // Control para el scroll automático

  constructor(
    public translate: TranslateService,
    private languageService: LanguageService,
    private sendChatService: SendChat,
    private cdRef: ChangeDetectorRef
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

  // Método auxiliar para forzar scroll después de actualizaciones
  private triggerScroll() {
    this.shouldScroll = true;
    this.cdRef.detectChanges(); // Forzar detección de cambios
  }

  openChat() {
    this.isChatOpen = true;
    this.showHint = false;
    this.translate.get('CHATBOX.WELCOME_MESSAGE').subscribe((message: string) => {
      this.messages.push(`🤖 ${message}`);
      this.triggerScroll(); // Scroll después del mensaje de bienvenida
    });
  }

  closeChat() {
    this.isChatOpen = false;
    this.messages = [];
    this.chatMessage = '';
  }

  // Manejar tecla Enter en el input
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
    
    // Scroll después del mensaje del usuario
    this.triggerScroll();

    try {
      const response = await this.sendChatService.getData(userMessage);

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
      
      if (error.message?.includes('Workflow no activado') || error.status === 404) {
        this.messages.push('⚠️ El asistente no está disponible en este momento. Por favor, intenta más tarde.');
      } else {
        this.messages.push('⚠️ Error de conexión. Verifica tu internet e intenta nuevamente.');
      }
    } finally {
      this.loading = false;
      // Scroll después de la respuesta
      setTimeout(() => this.triggerScroll(), 100);
    }
  }

  // Focus en el input cuando se abre el chat
  focusInput() {
    setTimeout(() => {
      if (this.chatInput?.nativeElement) {
        this.chatInput.nativeElement.focus();
      }
    }, 300);
  }
}