// hero.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../services/language-service';
import { BreakpointService } from '../../services/breakpoints';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './hero.html',
  styleUrl: './hero.css'
})
export class Hero implements OnInit {
  isMobile = false;

  constructor(
    public translate: TranslateService,
    private languageService: LanguageService,
    private breakpointService: BreakpointService
  ) {}

  ngOnInit() {
    // Suscribirse a los cambios de idioma del servicio
    this.languageService.currentLang$.subscribe(lang => {
      this.translate.use(lang);
    });

    // Establecer el idioma inicial
    this.translate.use(this.languageService.currentLang);

    // Suscribirse a los cambios de breakpoint
    this.breakpointService.isMobile$.subscribe(isMobile => {
      this.isMobile = isMobile;
    });
  }
}