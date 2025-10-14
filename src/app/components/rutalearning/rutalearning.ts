import { Component, OnInit, AfterViewInit, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-learning-path',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './rutalearning.html',
  styleUrls: ['./rutalearning.css']
})
export class RutalearningComponent implements OnInit, AfterViewInit {

  @ViewChildren('timelineStep') timelineSteps!: QueryList<ElementRef>;
  timelineStepsArray: ElementRef[] = [];

  steps = [
    {
      titleKey: 'LEARNING_PATH.STEPS.FUNDAMENTOS_WEB.TITLE',
      periodKey: 'LEARNING_PATH.STEPS.FUNDAMENTOS_WEB.PERIOD',
      descriptionKey: 'LEARNING_PATH.STEPS.FUNDAMENTOS_WEB.DESCRIPTION',
      skillsKey: 'LEARNING_PATH.STEPS.FUNDAMENTOS_WEB.SKILLS',
      progress: 100,
      icon: 'fab fa-html5',
      side: 'left'
    },
    {
      titleKey: 'LEARNING_PATH.STEPS.JAVASCRIPT_AVANZADO.TITLE',
      periodKey: 'LEARNING_PATH.STEPS.JAVASCRIPT_AVANZADO.PERIOD',
      descriptionKey: 'LEARNING_PATH.STEPS.JAVASCRIPT_AVANZADO.DESCRIPTION',
      skillsKey: 'LEARNING_PATH.STEPS.JAVASCRIPT_AVANZADO.SKILLS',
      progress: 100,
      icon: 'fab fa-js-square',
      side: 'right'
    },
    {
      titleKey: 'LEARNING_PATH.STEPS.FRAMEWORKS_FRONTEND.TITLE',
      periodKey: 'LEARNING_PATH.STEPS.FRAMEWORKS_FRONTEND.PERIOD',
      descriptionKey: 'LEARNING_PATH.STEPS.FRAMEWORKS_FRONTEND.DESCRIPTION',
      skillsKey: 'LEARNING_PATH.STEPS.FRAMEWORKS_FRONTEND.SKILLS',
      progress: 95,
      icon: 'fab fa-angular',
      side: 'left'
    },
    {
      titleKey: 'LEARNING_PATH.STEPS.BACKEND_BD.TITLE',
      periodKey: 'LEARNING_PATH.STEPS.BACKEND_BD.PERIOD',
      descriptionKey: 'LEARNING_PATH.STEPS.BACKEND_BD.DESCRIPTION',
      skillsKey: 'LEARNING_PATH.STEPS.BACKEND_BD.SKILLS',
      progress: 85,
      icon: 'fas fa-server',
      side: 'right'
    },
    {
      titleKey: 'LEARNING_PATH.STEPS.DEVOPS_CLOUD.TITLE',
      periodKey: 'LEARNING_PATH.STEPS.DEVOPS_CLOUD.PERIOD',
      descriptionKey: 'LEARNING_PATH.STEPS.DEVOPS_CLOUD.DESCRIPTION',
      skillsKey: 'LEARNING_PATH.STEPS.DEVOPS_CLOUD.SKILLS',
      progress: 70,
      icon: 'fas fa-cloud',
      side: 'left'
    },
    {
      titleKey: 'LEARNING_PATH.STEPS.ESPECIALIZACION_AVANZADA.TITLE',
      periodKey: 'LEARNING_PATH.STEPS.ESPECIALIZACION_AVANZADA.PERIOD',
      descriptionKey: 'LEARNING_PATH.STEPS.ESPECIALIZACION_AVANZADA.DESCRIPTION',
      skillsKey: 'LEARNING_PATH.STEPS.ESPECIALIZACION_AVANZADA.SKILLS',
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