import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent implements OnInit {
  isMobileMenuOpen = false;
  isLanguageMenuOpen = false;
  currentLanguage = 'es';
  
  // Las rutas ahora apuntan correctamente a public/assets/
  flagPaths = {
    es: 'assets/spain-flag.jpg',
    en: 'assets/uk-flag.jpg'
  };

  ngOnInit() {
    this.checkScreenSize();
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
    if (this.isMobileMenuOpen) {
      this.isLanguageMenuOpen = false;
    }
  }

  toggleLanguageMenu(event: Event) {
    event.stopPropagation();
    this.isLanguageMenuOpen = !this.isLanguageMenuOpen;
  }

  changeLanguage(lang: string) {
    this.currentLanguage = lang;
    this.isLanguageMenuOpen = false;
    console.log('Idioma cambiado a:', lang);
  }

  closeMenus() {
    this.isMobileMenuOpen = false;
    this.isLanguageMenuOpen = false;
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    this.closeMenus();
  }

  @HostListener('document:click')
  onDocumentClick() {
    if (this.isLanguageMenuOpen) {
      this.isLanguageMenuOpen = false;
    }
  }
}