import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NavigationStart, NavigationEnd, NavigationCancel, NavigationError, Router } from '@angular/router';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.html',
  styleUrls: ['./loader.css']
})
export class Loader implements OnInit, OnDestroy {
  isLoading: boolean = true;
  private routerSubscription!: Subscription; // Usamos el operador de afirmación definida
  private minimumDisplayTime: number = 1500;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Ocultar el loader después de un tiempo mínimo para asegurar una experiencia fluida
    setTimeout(() => {
      this.isLoading = false;
    }, 2000); // Ajusta este tiempo según tus necesidades

    // Opcional: Suscribirse a eventos del router para mostrar/ocultar durante navegación
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isLoading = true;
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        // Pequeño delay para que la transición sea suave
        setTimeout(() => {
          this.isLoading = false;
        }, 500);
      }
    });
       // Fallback: si no hay navegación, ocultar después del tiempo mínimo
    setTimeout(() => {
      if (this.isLoading) {
        this.isLoading = false;
      }
    }, this.minimumDisplayTime);
  }
  

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}