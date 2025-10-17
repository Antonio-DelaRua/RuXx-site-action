import { Injectable } from '@angular/core';
import { BreakpointService } from './breakpoints';

export interface ImageConfig {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  sizes?: string;
  srcset?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ImageOptimizationService {
  constructor(private breakpointService: BreakpointService) {}

  /**
   * Genera configuración optimizada para imágenes responsive
   */
  getOptimizedImage(src: string, alt: string, width?: number, height?: number): ImageConfig {
    const baseConfig: ImageConfig = {
      src,
      alt,
      width,
      height,
      loading: 'lazy'
    };

    // Para imágenes que necesitan ser responsive
    if (width && height && width > 200) {
      baseConfig.sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
      baseConfig.srcset = this.generateSrcset(src, width, height);
    }

    return baseConfig;
  }

  /**
   * Genera srcset para diferentes tamaños
   */
  private generateSrcset(src: string, width: number, height: number): string {
    const breakpoints = [480, 768, 1024, 1200];
    const srcset: string[] = [];

    // Tamaño original
    srcset.push(`${src} ${width}w`);

    // Generar versiones más pequeñas
    breakpoints.forEach(bp => {
      if (bp < width) {
        const scaledWidth = Math.min(bp, width);
        const scaledHeight = Math.round((scaledWidth / width) * height);
        srcset.push(`${src.replace('.webp', `-${scaledWidth}.webp`)} ${scaledWidth}w`);
      }
    });

    return srcset.join(', ');
  }

  /**
   * Genera múltiples tamaños de imagen para responsive design
   */
  generateResponsiveImages(baseSrc: string, width: number, height: number): { src: string, width: number, height: number }[] {
    const breakpoints = [480, 768, 1024, 1200];
    const images: { src: string, width: number, height: number }[] = [];

    // Agregar tamaño original
    images.push({ src: baseSrc, width, height });

    // Generar versiones más pequeñas
    breakpoints.forEach(bp => {
      if (bp < width) {
        const scaledWidth = Math.min(bp, width);
        const scaledHeight = Math.round((scaledWidth / width) * height);
        images.push({
          src: baseSrc.replace('.webp', `-${scaledWidth}.webp`),
          width: scaledWidth,
          height: scaledHeight
        });
      }
    });

    return images;
  }

  /**
   * Obtiene la URL de imagen optimizada basada en el breakpoint actual
   */
  getResponsiveImageUrl(baseSrc: string, isMobile: boolean): string {
    if (isMobile) {
      // Para móviles, usar versión más pequeña si existe
      return baseSrc.replace('.webp', '-mobile.webp');
    }
    return baseSrc;
  }

  /**
   * Configuración específica para diferentes tipos de imágenes
   */
  getCertificateImageConfig(image: string): ImageConfig {
    return this.getOptimizedImage(image, 'Certificado', 353, 200);
  }

  getProjectImageConfig(image: string, alt: string): ImageConfig {
    return this.getOptimizedImage(image, alt, 353, 200);
  }

  getIconImageConfig(image: string, alt: string, size: number = 100): ImageConfig {
    return this.getOptimizedImage(image, alt, size, size);
  }

  getBackgroundImageConfig(image: string): ImageConfig {
    return {
      src: image,
      alt: 'Background',
      loading: 'eager',
      width: 800,
      height: 600
    };
  }
}