import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home').then(m => m.Home)
  },
  {
    path: 'proyectos',
    loadComponent: () =>
      import('./components/proyectos/proyectos').then(m => m.Proyectos)
  },
  {
    path: 'certificados',
    loadComponent: () =>
      import('./components/certificates/certificates').then(m => m.Certificates)
  },
  {
    path: 'contacto',
    loadComponent: () =>
      import('./components/contact/contact').then(m => m.Contact)
  },
  {
    path: '**',
    redirectTo: ''
  }
];