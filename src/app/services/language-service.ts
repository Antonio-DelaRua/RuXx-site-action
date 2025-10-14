import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  currentLang = 'es';
  supportedLangs = ['es', 'en']; 

  constructor(private translate: TranslateService) {
    // Establece español como idioma por defecto
    this.translate.setDefaultLang('es');

    // Intenta cargar idioma guardado en localStorage
    const savedLang = localStorage.getItem('userLanguage');

    if (savedLang && this.supportedLangs.includes(savedLang)) {
      this.useLanguage(savedLang);
    } else {
      // Detecta idioma del navegador (ejemplo: "en-US" → "en")
      const browserLang = navigator.language.split('-')[0];
      if (this.supportedLangs.includes(browserLang)) {
        this.useLanguage(browserLang);
      } else {
        this.useLanguage('es'); // fallback
      }
    }
  }

  /** Cambia el idioma globalmente y lo guarda */
  switch(lang: string) {
    this.useLanguage(lang);
    localStorage.setItem('userLanguage', lang);
  }

  /** Método centralizado para aplicar un idioma */
  private useLanguage(lang: string) {
    this.translate.use(lang);
    this.currentLang = lang;
  }
}
