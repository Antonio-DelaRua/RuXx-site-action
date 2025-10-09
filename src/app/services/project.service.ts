import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  getProjects() {
    return [
      {
        title: 'Angular Firebase',
        description: 'Una aplicación web basada en una wikipedia de coches, realizada con Angular y Firebase.',
        technologies: ['Angular', 'Firebase', 'TypeScript', 'SCSS', 'RxJS'],
        demoUrl: 'https://github.com/Antonio-DelaRua/login-firebase',
        githubUrl: 'https://github.com/Antonio-DelaRua',
        image: 'assets/angular.gif'
      },
      {
        title: 'React E-commerce',
        description: 'Sistema de gestión de tareas con funcionalidades CRUD completas.',
        technologies: ['React', 'Node.js', 'Javascript', 'RxJS', 'PostgresSQL'],
        demoUrl: 'https://funny-valkyrie-1651a5.netlify.app/',
        githubUrl: 'https://github.com/Antonio-DelaRua/React_projects',
        image: 'assets/react.png'
      },

      {
        title: 'Portfolio Personal',
        description: 'Mi portfolio personal desarrollado con Angular.',
        technologies: ['Html', 'CSS', 'Javascript', 'RxJS'],
        demoUrl: 'https://github.com/Antonio-DelaRua/RuXxDeSiNgWEB',
        githubUrl: 'https://github.com/tuusuario/portfolio',
        image: 'assets/html.jpg'
      },
      {
        title: 'Shimeji con llm local',
        description: 'Aplicación chat ia, con automatizacion por voz, y con llm especializado en python',
        technologies: ['Python', 'Sqlite', 'Tkinter', 'langchain'],
        demoUrl: 'https://github.com/Antonio-DelaRua/Selina_IA',
        githubUrl: 'https://github.com/Antonio-DelaRua',
        image: 'assets/giphy.gif'
      },{
        title: 'Ruta de aprendizaje Spring Boot',
        description: 'Mi portfolio personal desarrollado con Angular.',
        technologies: ['SpringBoot', 'Maven', 'ApiRest', 'Pdf'],
        demoUrl: 'https://mi-portfolio.com',
        githubUrl: 'https://github.com/tuusuario/portfolio',
        image: 'assets/maven.gif'
      },
      {
        title: 'Bootcamp Angular online',
        description: 'Mi portfolio personal desarrollado con Angular.',
        technologies: ['Angular', 'TypeScript', 'Scss', 'RxJS'],
        demoUrl: 'https://mi-portfolio.com',
        githubUrl: 'https://github.com/tuusuario/portfolio',
        image: 'assets/abt.png'
      },

    ];
  }
}