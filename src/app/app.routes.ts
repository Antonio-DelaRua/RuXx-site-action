import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Skills } from './pages/skills/skills';

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
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];