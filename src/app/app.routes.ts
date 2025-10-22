import { Routes } from '@angular/router';
import { FileUploadComponent } from './components/file-upload/file-upload';


export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home').then(m => m.Home)
  },

   { 
    path: 'libro', 
    component: FileUploadComponent,
    title: 'Lector de Audiolibros'
  },

  {
    path: '**',
    redirectTo: ''
  }
];