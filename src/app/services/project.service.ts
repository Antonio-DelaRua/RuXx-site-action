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
        demoUrl: 'https://github.com',
        githubUrl: 'https://github.com',
        image: 'assets/ang1.jpg'
      },
      {
        title: 'React E-commerce',
        description: 'Sistema de gestión de tareas con funcionalidades CRUD completas.',
        technologies: ['React', 'Node.js', 'Javascript', 'RxJS', 'PostgresSQL'],
        demoUrl: 'https://demo-taskmanager.com',
        githubUrl: 'https://github.com/tuusuario/task-manager',
        image: 'assets/react.png'
      },

      {
        title: 'Portfolio Personal',
        description: 'Mi portfolio personal desarrollado con Angular.',
        technologies: ['Angular', 'TypeScript', 'CSS3', 'RxJS'],
        demoUrl: 'https://mi-portfolio.com',
        githubUrl: 'https://github.com/tuusuario/portfolio'
      },
      {
        title: 'Chat App',
        description: 'Aplicación de mensajería en tiempo real.',
        technologies: ['Angular', 'Socket.io', 'Node.js', 'MongoDB'],
        demoUrl: 'https://demo-chat.com',
        githubUrl: 'https://github.com/tuusuario/chat-app'
      },{
        title: 'Portfolio Personal',
        description: 'Mi portfolio personal desarrollado con Angular.',
        technologies: ['Angular', 'TypeScript', 'CSS3', 'RxJS'],
        demoUrl: 'https://mi-portfolio.com',
        githubUrl: 'https://github.com/tuusuario/portfolio'
      },
      {
        title: 'Portfolio Personal',
        description: 'Mi portfolio personal desarrollado con Angular.',
        technologies: ['Angular', 'TypeScript', 'CSS3', 'RxJS'],
        demoUrl: 'https://mi-portfolio.com',
        githubUrl: 'https://github.com/tuusuario/portfolio'
      },

    ];
  }
}