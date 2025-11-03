import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  email = '';
  password = '';
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async loginWithGoogle() {
    this.isLoading = true;
    this.errorMessage = '';
    try {
      await this.authService.loginWithGoogle();
      this.router.navigate(['/libro']);
    } catch (error: any) {
      this.errorMessage = this.getErrorMessage(error);
    } finally {
      this.isLoading = false;
    }
  }

  async loginWithEmail() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor, completa todos los campos';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    try {
      await this.authService.loginWithEmail(this.email, this.password);
      this.router.navigate(['/libro']);
    } catch (error: any) {
      this.errorMessage = this.getErrorMessage(error);
    } finally {
      this.isLoading = false;
    }
  }

  private getErrorMessage(error: any): string {
    switch (error.code) {
      case 'auth/user-not-found':
        return 'Usuario no encontrado';
      case 'auth/wrong-password':
        return 'Contraseña incorrecta';
      case 'auth/invalid-email':
        return 'Email inválido';
      case 'auth/user-disabled':
        return 'Usuario deshabilitado';
      case 'auth/too-many-requests':
        return 'Demasiados intentos. Intenta más tarde';
      case 'auth/popup-closed-by-user':
        return 'Ventana de Google cerrada';
      default:
        return 'Error de autenticación. Intenta de nuevo';
    }
  }
}