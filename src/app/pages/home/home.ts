import { Component, OnInit, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar';
import { Hero } from '../../components/hero/hero';
import { Proyectos } from '../../components/proyectos/proyectos';
import { RutalearningComponent } from '../../components/rutalearning/rutalearning';
import { Certificates } from '../../components/certificates/certificates';
import { Contact } from '../../components/contact/contact';
import { Footer } from '../../components/footer/footer';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InteractiveImageComponent } from "../../components/interactive-image/interactive-image";
import { Audiolibro } from '../../components/audiolibro/audiolibro';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [    
    CommonModule,
    RouterModule,
    NavbarComponent,
    Hero,
    Proyectos,
    RutalearningComponent,
    Audiolibro,
    Certificates,
    Contact,
    Footer,
    InteractiveImageComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements AfterViewInit, OnDestroy {
  loadProyectos = false;
  loadLearningPath = false;
  loadCertificates = false;
  loadContact = false;

  private observer?: IntersectionObserver;

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    // Creamos el observer después de que el DOM esté listo
    this.observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            switch (id) {
              case 'proyectos-section':
                this.loadProyectos = true;
                break;
              case 'learning-path-section':
                this.loadLearningPath = true;
                break;
              case 'certificates-section':
                this.loadCertificates = true;
                break;
              case 'contact-section':
                this.loadContact = true;
                break;
            }
            this.observer?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    // Observar secciones marcadas
    ['proyectos-section', 'learning-path-section', 'certificates-section', 'contact-section'].forEach(
      id => {
        const section = this.el.nativeElement.querySelector(`#${id}`);
        if (section) this.observer?.observe(section);
      }
    );
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
