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
    background: rgba(0, 0, 0, 0.95);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    cursor: pointer;
    padding: 20px;
    box-sizing: border-box;
  `;

  const modalContent = document.createElement('div');
  modalContent.style.cssText = `
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
    cursor: default;
    max-width: 90vw;
    max-height: 90vh;
    width: auto;
    height: auto;
  `;

  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '×';
  closeBtn.style.cssText = `
    position: absolute;
    top: 15px;
    right: 20px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    border: none;
    width: 45px;
    height: 45px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1001;
    transition: all 0.3s ease;
    font-weight: bold;
  `;

  closeBtn.addEventListener('mouseenter', () => {
    closeBtn.style.background = '#e74c3c';
    closeBtn.style.transform = 'scale(1.1)';
  });
  closeBtn.addEventListener('mouseleave', () => {
    closeBtn.style.background = 'rgba(0, 0, 0, 0.8)';
    closeBtn.style.transform = 'scale(1)';
  });

  const imgContainer = document.createElement('div');
  imgContainer.style.cssText = `
    padding: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: white;
    max-width: 100%;
    max-height: calc(90vh - 100px);
    overflow: auto;
  `;

  const img = document.createElement('img');
  
  // USAR IMAGEN ORIGINAL SIN COMPRIMIR para certificados
  const originalImagePath = this.getOriginalImagePath(certificate.image);
  img.src = originalImagePath;
  img.alt = this.translate.instant(certificate.titleKey);
  
  img.style.cssText = `
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
    display: block;
    object-fit: contain;
  `;

  // Información del certificado
  const infoOverlay = document.createElement('div');
  infoOverlay.style.cssText = `
    width: 100%;
    background: rgba(255, 255, 255, 0.98);
    color: #333;
    padding: 20px;
    text-align: center;
    border-top: 1px solid #eee;
    box-sizing: border-box;
  `;

  const title = document.createElement('h3');
  title.textContent = this.translate.instant(certificate.titleKey);
  title.style.cssText = `
    margin: 0 0 5px 0;
    font-size: 20px;
    font-weight: 600;
    color: #2c3e50;
  `;

  const issuer = document.createElement('p');
  issuer.textContent = certificate.issuer;
  issuer.style.cssText = `
    margin: 0;
    font-size: 16px;
    color: #7f8c8d;
    font-weight: 500;
  `;

  infoOverlay.appendChild(title);
  infoOverlay.appendChild(issuer);

  imgContainer.appendChild(img);
  modalContent.appendChild(imgContainer);
  modalContent.appendChild(infoOverlay);
  modalContent.appendChild(closeBtn);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  document.body.style.overflow = 'hidden';

  const closeModal = () => {
    if (document.body.contains(modal)) {
      document.body.removeChild(modal);
    }
    document.body.style.overflow = '';
  };
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeModal();
  });

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', handleKeydown);
    }
  };
  document.addEventListener('keydown', handleKeydown);
}

// Método para obtener la imagen original sin comprimir
private getOriginalImagePath(optimizedPath: string): string {
  // Reemplazar 'opt-' por el nombre original
  const imageName = optimizedPath.split('/').pop();
  if (imageName && imageName.startsWith('opt-')) {
    const originalName = imageName.replace('opt-', '');
    return optimizedPath.replace(imageName, originalName);
  }
  return optimizedPath;
}
}