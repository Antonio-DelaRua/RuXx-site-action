import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Skills } from './pages/skills/skills';
import { Contact } from './pages/contact/contact';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    title: 'RuXxDev - Inicio'
  },
    {
    path: 'skills',
    component: Skills,
    title: 'RuXxDev - Skills'
  },
      {
    path: 'Contacto',
    component: Contact,
    title: 'RuXxDev - Contacto'
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];