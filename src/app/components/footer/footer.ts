import { Component, AfterViewInit, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../services/language-service';


@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer implements AfterViewInit, OnInit {

  ngAfterViewInit() {
    this.initBackToTop();
  }

  private initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', () => {
      // Force iframe reload to prevent vibration bug
        const iframes = document.querySelectorAll('iframe');
        iframes.forEach(iframe => {
          const src = iframe.src;
          iframe.src = '';
          setTimeout(() => {
            iframe.src = src;
          }, 10);
        });
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
      if (window.pageYOffset > 300) {
        backToTopBtn.style.display = 'flex';
      } else {
        backToTopBtn.style.display = 'none';
      }
    }
  }

    constructor(
    public translate: TranslateService,
    private languageService: LanguageService 
  ) {}

  get PROYECTOS() {
    return this.translate.instant('PROYECTOS');
  }

  ngOnInit() {
    // Suscribirse a los cambios de idioma del servicio
    this.languageService.currentLang$.subscribe(lang => {
      this.translate.use(lang);
    });
  }
}

