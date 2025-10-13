import { Component, OnInit, AfterViewInit, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-learning-path',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rutalearning.html',
  styleUrls: ['./rutalearning.css']
})
export class RutalearningComponent implements OnInit, AfterViewInit {

  @ViewChildren('timelineStep') timelineSteps!: QueryList<ElementRef>;
  timelineStepsArray: ElementRef[] = [];

  
  steps = [
    {
      title: 'Fundamentos Web',
      period: '2021 - 2022',
      description: 'Comencé mi viaje en el desarrollo web aprendiendo los fundamentos: HTML, CSS y JavaScript. Creé mis primeras páginas web estáticas y comprendí los principios del diseño responsive.',
      skills: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design'],
      progress: 100,
      icon: 'fab fa-html5',
      side: 'left'
    },
    {
      title: 'JavaScript Avanzado',
      period: '2022 - 2022',
      description: 'Profundicé en JavaScript, explorando ES6+, programación asíncrona, APIs y comenzando con Node.js para el desarrollo del lado del servidor.',
      skills: ['ES6+', 'Async/Await', 'APIs REST', 'Node.js'],
      progress: 100,
      icon: 'fab fa-js-square',
      side: 'right'
    },
    {
      title: 'Frameworks Frontend',
      period: '2023 - 2023',
      description: 'Me especialicé en Angular, explorando su ecosistema completo: TypeScript, RxJS, servicios, componentes y routing. También experimenté con React para ampliar mis habilidades.',
      skills: ['Angular', 'TypeScript', 'RxJS', 'React'],
      progress: 95,
      icon: 'fab fa-angular',
      side: 'left'
    },
    {
      title: 'Backend & Bases de Datos',
      period: '2023 - 2024',
      description: 'Ampliando mis habilidades al backend con Node.js, Express, y diferentes bases de datos como MongoDB y MySQL.',
      skills: ['Node.js', 'Express', 'MongoDB', 'MySQL'],
      progress: 85,
      icon: 'fas fa-server',
      side: 'right'
    },
    {
      title: 'DevOps & Cloud',
      period: '2024 - Presente',
      description: 'Explorando deployment, CI/CD, Docker y servicios cloud para llevar mis aplicaciones a producción.',
      skills: ['Docker', 'AWS', 'CI/CD', 'Git'],
      progress: 70,
      icon: 'fas fa-cloud',
      side: 'left'
    },
    {
      title: 'Especialización Avanzada',
      period: 'Futuro',
      description: 'Continuando mi aprendizaje en arquitecturas avanzadas, microservicios y nuevas tecnologías emergentes.',
      skills: ['Microservicios', 'GraphQL', 'WebSockets', 'Testing'],
      progress: 30,
      icon: 'fas fa-rocket',
      side: 'right'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.observeTimelineSteps();
  }

  private observeTimelineSteps(): void {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    this.timelineSteps.forEach((step) => {
      observer.observe(step.nativeElement);
    });
  }
}