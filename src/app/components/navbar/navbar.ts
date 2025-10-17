import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../services/language-service'; // <-- Importa tu servicio
import { BreakpointService } from '../../services/breakpoints';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent implements OnInit {
  isMobileMenuOpen = false;
  isLanguageMenuOpen = false;
  isMobile = false;

  constructor(
    public langService: LanguageService,
    private breakpointService: BreakpointService
  ) {} // <-- Inyección del servicio

  ngOnInit() {
    this.checkScreenSize();

    // Suscribirse a los cambios de breakpoint
    this.breakpointService.isMobile$.subscribe(isMobile => {
      this.isMobile = isMobile;
    });
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    if (window.innerWidth > 768) {
      this.isMobileMenuOpen = false;
      this.isLanguageMenuOpen = false;
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (this.isMobileMenuOpen) this.isLanguageMenuOpen = false;
  }

  toggleLanguageMenu(event: Event) {
    event.stopPropagation();
    this.isLanguageMenuOpen = !this.isLanguageMenuOpen;
  }

  changeLanguage(lang: string) {
    this.langService.switch(lang); // <-- Usa el servicio centralizado
    this.isLanguageMenuOpen = false;
  }

  closeMenus() {
    this.isMobileMenuOpen = false;
    this.isLanguageMenuOpen = false;
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
    this.closeMenus();
  }

  @HostListener('document:click')
  onDocumentClick() {
    if (this.isLanguageMenuOpen) this.isLanguageMenuOpen = false;
  }

  /** Para mostrar la bandera correcta */
  get currentFlag(): string {
    return this.langService.currentLang === 'es'
      ? 'assets/opt-spain-flag.webp'
      : 'assets/uk-flag.webp';
  }

  
}
