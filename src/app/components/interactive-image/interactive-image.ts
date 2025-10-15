import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../services/language-service'; 


@Component({
  selector: 'app-interactive-image',
  standalone: true,
  imports: [FormsModule, CommonModule, TranslateModule],
  templateUrl: './interactive-image.html',
  styleUrls: ['./interactive-image.css'],
})
export class InteractiveImageComponent implements OnInit{
  isActivated = false;
  isChatOpen = false;
  chatMessage = '';
  messages: string[] = [];
  showImage = false;
  showHint = false;
  private clickTimeout: any = null;

  activateChatbot() {
    this.isActivated = true;
    this.showImage = true;
  }

  onImageClick(event: MouseEvent) {
    event.preventDefault();
    
    // Si ya hay un timeout pendiente, es un doble click
    if (this.clickTimeout) {
      clearTimeout(this.clickTimeout);
      this.clickTimeout = null;
      // No mostrar el hint en doble click
      return;
    }

    // Esperar para determinar si es click simple o doble
    this.clickTimeout = setTimeout(() => {
      this.showHintMessage();
      this.clickTimeout = null;
    }, 300); // Tiempo para detectar doble click (300ms)
  }

  onDoubleClick(event: MouseEvent) {
    event.preventDefault();
    
    // Cancelar cualquier timeout pendiente
    if (this.clickTimeout) {
      clearTimeout(this.clickTimeout);
      this.clickTimeout = null;
    }
    
    this.openChat();
  }

  showHintMessage() {
    // Solo mostrar el hint si no está abierto el chat
    if (!this.isChatOpen) {
      this.showHint = true;
      
      // Ocultar después de 3 segundos
      setTimeout(() => {
        this.showHint = false;
      }, 3000);
    }
  }

openChat() {
  this.isChatOpen = true;
  this.showHint = false;
  
  this.translate.get('CHATBOX.WELCOME_MESSAGE').subscribe((message: string) => {
    this.messages.push(message);
  });
}

  closeChat() {
    this.isChatOpen = false;
    this.messages = [];
    this.chatMessage = '';
  }

  sendMessage() {
    if (this.chatMessage.trim()) {
      this.messages.push(`Tú: ${this.chatMessage}`);
      this.messages.push('IA: Esta funcionalidad se implementará próximamente');
      this.chatMessage = '';
    }
  }

 

    constructor(
    public translate: TranslateService,
    private languageService: LanguageService 
  ) {}

  ngOnInit() {
    // Suscribirse a los cambios de idioma del servicio
    this.languageService.currentLang$.subscribe(lang => {
      this.translate.use(lang);
    });

    // Establecer el idioma inicial
    this.translate.use(this.languageService.currentLang);
  }
}
