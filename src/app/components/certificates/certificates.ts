import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Certificate {
  id: number;
  title: string;
  issuer: string;
  tech: string;
  image: string;
  year: string;
}

@Component({
  selector: 'app-certificates',
  imports: [CommonModule],
  templateUrl: './certificates.html',
  styleUrl: './certificates.css'
})
export class Certificates {
  activeFilter: string = 'all';

  certificates: Certificate[] = [
    {
      id: 1,
      title: 'Angular Básico',
      issuer: 'OpenBootCamp - 2022',
      tech: 'angular',
      image: 'assets/angular.png',
      year: '2022'
    },
    {
      id: 2,
      title: 'Web Design',
      issuer: 'freeCodeCamp - 2023',
      tech: 'web',
      image: 'assets/deve.png',
      year: '2023'
    },
    {
      id: 3,
      title: 'JavaScript Moderno',
      issuer: 'OpenBootCamp - 2022',
      tech: 'javascript',
      image: 'assets/javascript.png',
      year: '2022'
    },
    {
      id: 4,
      title: 'HTML',
      issuer: 'OpenBootCamp - 2022',
      tech: 'HTML',
      image: 'assets/htmlcer.png',
      year: '2022'
    },
    {
      id: 5,
      title: 'Python Profesional',
      issuer: 'Udemy - 2025',
      tech: 'python',
      image: 'assets/piyon.png',
      year: '2025'
    },
    {
      id: 6,
      title: 'Web Full Stack',
      issuer: 'OpenBootCamp - 2022',
      tech: 'typescript',
      image: 'assets/typescript.png',
      year: '2022'
    }
  ];

  filteredCertificates: Certificate[] = this.certificates;

  filterCertificates(tech: string): void {
    this.activeFilter = tech;
    if (tech === 'all') {
      this.filteredCertificates = this.certificates;
    } else {
      this.filteredCertificates = this.certificates.filter(cert => cert.tech === tech);
    }
  }

  viewCertificate(certificate: Certificate): void {
    // Simple modal implementation
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
    img.src = certificate.image;
    img.alt = certificate.title;
    img.style.cssText = `
      max-width: 100%;
      max-height: 100%;
      display: block;
    `;

    modalContent.appendChild(img);
    modalContent.appendChild(closeBtn);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    const closeModal = () => {
      document.body.removeChild(modal);
    };

    modal.addEventListener('click', closeModal);
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeModal();
    });
  }
}
