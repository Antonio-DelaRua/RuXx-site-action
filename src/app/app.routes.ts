import { Routes } from '@angular/router';
import { FileUploadComponent } from './components/file-upload/file-upload';
import { LoginComponent } from './components/login/login';
import { AuthGuard } from './guards/auth.guard';


export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home').then(m => m.Home)
  },

  {
    path: 'login',
    component: LoginComponent,
    title: 'Iniciar Sesión'
  },


  {
    path: 'upload',
    component: FileUploadComponent,
    title: 'Subir Audiolibro',
    canActivate: [AuthGuard]
  },

  {
    path: '**',
    redirectTo: ''
  }
];