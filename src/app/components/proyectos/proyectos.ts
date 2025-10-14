import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../services/language-service';

@Component({
  selector: 'app-proyectos',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './proyectos.html',
  styleUrl: './proyectos.css'
})
export class Proyectos implements OnInit {

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