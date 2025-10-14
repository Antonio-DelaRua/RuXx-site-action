// language-service.ts
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLangSubject = new BehaviorSubject<string>('es');
  public currentLang$ = this.currentLangSubject.asObservable();

  constructor(private translate: TranslateService) {
    // Configuración inicial
    this.translate.setDefaultLang('es');
    
    // Recuperar idioma guardado o usar el del navegador
    const savedLang = localStorage.getItem('userLang');
    const browserLang = this.translate.getBrowserLang();
    const initialLang = savedLang || browserLang || 'es';
    
    this.switch(initialLang);
  }

  get currentLang(): string {
    return this.currentLangSubject.value;
  }

  switch(lang: string) {
    this.translate.use(lang);
    this.currentLangSubject.next(lang);
    localStorage.setItem('userLang', lang);
  }
}