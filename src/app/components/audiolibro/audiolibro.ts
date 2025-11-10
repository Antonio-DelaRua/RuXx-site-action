import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-audiolibro',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './audiolibro.html',
  styleUrl: './audiolibro.css',
})
export class Audiolibro implements OnInit {
  parallaxOffset = 0;

  ngOnInit(): void {
    this.updateParallax();
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any): void {
    this.updateParallax();
  }

  private updateParallax(): void {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    this.parallaxOffset = rate;
  }
}
