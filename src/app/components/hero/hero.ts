// hero.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class Hero implements OnInit, OnDestroy {
  isMobile = false;
  robotLoaded = false;
  iframeVisible = false;

  // Glitch + Typing texts
  loadingTexts = [
    'Initializing intelligence…',
    'Calibrating sensors…',
    'Booting neural core…',
    'Establishing link…'
  ];

  currentText = this.loadingTexts[0];

  // Parallax
  parallaxX = 0;
  parallaxY = 0;

  private textInterval: any;
  private robotTimeout: any;

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

    // Start glitch text rotation (2 seconds per text)
    this.startTextRotation();
  }

  ngOnDestroy() {
    if (this.textInterval) {
      clearInterval(this.textInterval);
    }
    if (this.robotTimeout) {
      clearTimeout(this.robotTimeout);
    }
  }

  private startTextRotation() {
    let i = 0;
    this.textInterval = setInterval(() => {
      if (!this.robotLoaded) {
        i = (i + 1) % this.loadingTexts.length;
        this.currentText = this.loadingTexts[i];
      }
    }, 2000);
  }

  onRobotLoad() {
    // Robot has finished loading, but we delay appearance
    // so text disappears first, then robot appears
    this.robotLoaded = true;
    
    if (this.textInterval) {
      clearInterval(this.textInterval);
    }

    // Wait for overlay transition to complete (500ms), then show iframe
    this.robotTimeout = setTimeout(() => {
      this.iframeVisible = true;
    }, 500);
  }

  onMouseMove(e: MouseEvent) {
    if (this.isMobile || this.robotLoaded) return;

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    this.parallaxX = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
    this.parallaxY = ((e.clientY - rect.top) / rect.height - 0.5) * 6;
  }

  resetParallax() {
    this.parallaxX = 0;
    this.parallaxY = 0;
  }
}
