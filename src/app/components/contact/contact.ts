import { Component, OnInit } from '@angular/core';
import { Form } from "../form/form";
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../services/language-service'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  templateUrl: './contact.html',
  styleUrls: ['./contact.css'],
  imports: [Form, CommonModule, TranslateModule]
})
export class Contact implements OnInit {
  
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