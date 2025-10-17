import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../services/language-service';
import { ImageOptimizationService, ImageConfig } from '../../services/image-optimization.service';

interface Certificate {
  id: number;
  titleKey: string;
  issuer: string;
  tech: string;
  image: string;
  year: string;
}

@Component({
  selector: 'app-certificates',
  imports: [CommonModule, TranslateModule],
  templateUrl: './certificates.html',
  styleUrl: './certificates.css'
})
export class Certificates implements OnInit {
  activeFilter: string = 'all';

  certificates: Certificate[] = [
    {
      id: 1,
      titleKey: 'TITLES.ANGULAR_BASIC',
      issuer: 'OpenBootCamp - 2022',
      tech: 'angular',
      image: 'assets/opt-angular.webp',
      year: '2022'
    },
    {
      id: 2,
      titleKey: 'TITLES.WEB_DESIGN',
      issuer: 'freeCodeCamp - 2023',
      tech: 'web',
      image: 'assets/opt-deve.webp',
      year: '2023'
    },
    {
      id: 3,
      titleKey: 'TITLES.MODERN_JAVASCRIPT',
      issuer: 'OpenBootCamp - 2022',
      tech: 'javascript',
      image: 'assets/opt-javascript.webp',
      year: '2022'
    },
    {
      id: 4,
      titleKey: 'TITLES.HTML',
      issuer: 'OpenBootCamp - 2022',
      tech: 'HTML',
      image: 'assets/opt-html.webp',
      year: '2022'
    },
    {
      id: 5,
      titleKey: 'TITLES.PYTHON',
      issuer: 'Udemy - 2025',
      tech: 'python',
      image: 'assets/opt-piyon2.webp',
      year: '2025'
    },
    {
      id: 6,
      titleKey: 'TITLES.TYPESCRIPT',
      issuer: 'OpenBootCamp - 2022',
      tech: 'typescript',
      image: 'assets/opt-typescript.webp',
      year: '2022'
    }
  ];

  filteredCertificates: Certificate[] = this.certificates;

  constructor(
    public translate: TranslateService,
    private languageService: LanguageService,
    private imageOptimizationService: ImageOptimizationService
  ) {}

  ngOnInit() {
    this.languageService.currentLang$.subscribe(lang => {
      this.translate.use(lang);
    });
    this.translate.use(this.languageService.currentLang);
  }

  filterCertificates(tech: string): void {
    this.activeFilter = tech;
    this.filteredCertificates = tech === 'all' 
      ? this.certificates 
      : this.certificates.filter(cert => cert.tech === tech);
  }

  viewCertificate(certificate: Certificate): void {
    const config = this.getCertificateImageConfig(certificate.image);
    this.createModal(certificate, config);
  }

  getCertificateImageConfig(image: string): ImageConfig {
    return this.imageOptimizationService.getCertificateImageConfig(image);
  }

  private createModal(certificate: Certificate, config?: ImageConfig): void {
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      cursor: pointer;
    `;

    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
      max-width: 90%;
      max-height: 90%;
      background: white;
      border-radius: 10px;
      overflow: hidden;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '×';
    closeBtn.style.cssText = `
      position: absolute;
      top: 10px;
      right: 15px;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      border: none;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1001;
    `;

    const img = document.createElement('img');
    img.src = config ? config.src : certificate.image;
    img.alt = this.translate.instant(certificate.titleKey);
    img.style.cssText = `
      max-width: 100%;
      max-height: 100%;
      display: block;
      object-fit: contain;
    `;

    // Set dimensions immediately if available to prevent reflow
    if (config && config.width && config.height) {
      img.width = config.width;
      img.height = config.height;
    }

    modalContent.appendChild(img);
    modalContent.appendChild(closeBtn);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    const closeModal = () => document.body.removeChild(modal);
    
    modal.addEventListener('click', closeModal);
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeModal();
    });

    // Remove unused breakpoint subscription that could cause reflow
    // this.breakpointService.isMobile$.subscribe(isMobile => {
    //   this.isMobile = isMobile;
    // });
  }
  }
