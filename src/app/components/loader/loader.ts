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
  private routerSubscription!: Subscription;
  private minimumDisplayTime: number = 1500;
  private timeoutIds: number[] = []; // Array para trackear todos los timeouts

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.setupRouterListening();
    this.setupFallbackTimeout();
  }

  private setupRouterListening(): void {
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.showLoader();
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.hideLoaderWithDelay(500);
      }
    });
  }

  private setupFallbackTimeout(): void {
    // Timeout de respaldo por si algo falla
    const timeoutId = window.setTimeout(() => {
      if (this.isLoading) {
        console.log('Fallback timeout triggered');
        this.isLoading = false;
      }
    }, this.minimumDisplayTime);
    
    this.timeoutIds.push(timeoutId);
  }

  private showLoader(): void {
    this.clearAllTimeouts(); // Limpiar timeouts anteriores
    this.isLoading = true;
  }

  private hideLoaderWithDelay(delay: number): void {
    this.clearAllTimeouts(); // Limpiar timeouts anteriores
    
    const timeoutId = window.setTimeout(() => {
      this.isLoading = false;
    }, delay);
    
    this.timeoutIds.push(timeoutId);
  }

  private clearAllTimeouts(): void {
    // Limpiar todos los timeouts pendientes
    this.timeoutIds.forEach(id => clearTimeout(id));
    this.timeoutIds = [];
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    this.clearAllTimeouts();
  }
}