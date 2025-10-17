import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../services/language-service';
import { BreakpointService } from '../../services/breakpoints';
import { ImageOptimizationService, ImageConfig } from '../../services/image-optimization.service';
import { Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-proyectos',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './proyectos.html',
  styleUrls: ['./proyectos.css'] // ✅ corregido plural
})
export class Proyectos implements OnInit, OnDestroy {
  // Ahora es un observable, no un booleano
  isMobile$: Observable<boolean>;
  private destroy$ = new Subject<void>();

  constructor(
    public translate: TranslateService,
    private languageService: LanguageService,
    private breakpointService: BreakpointService,
    private imageOptimizationService: ImageOptimizationService
  ) {
    // Se asigna directamente el observable desde el servicio
    this.isMobile$ = this.breakpointService.isMobile$;
  }

  get PROYECTOS() {
    return this.translate.instant('PROYECTOS');
  }

  ngOnInit() {
    // ✅ Solo necesitamos manejar la traducción manualmente
    this.languageService.currentLang$
      .pipe(takeUntil(this.destroy$))
      .subscribe(lang => this.translate.use(lang));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getProjectImageConfig(image: string, alt: string): ImageConfig {
    return this.imageOptimizationService.getProjectImageConfig(image, alt);
  }

  openModal(imagePath: string): void {
    this.createModal(imagePath);
  }

  private createModal(imagePath: string): void {
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
    img.src = imagePath;
    img.alt = 'Project Image';
    img.style.cssText = `
      max-width: 100%;
      max-height: 100%;
      display: block;
    `;

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
  }
}
