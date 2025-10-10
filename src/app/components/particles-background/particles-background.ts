import { Component, afterNextRender } from '@angular/core';
import { NgxParticlesModule } from "@tsparticles/angular";
import { loadSlim } from "@tsparticles/slim";
import { tsParticles } from "@tsparticles/engine";

@Component({
  selector: 'app-particles-background',
  standalone: true,
  imports: [NgxParticlesModule], // Importa el módulo de partículas
  templateUrl: './particles-background.html',
  styleUrl: './particles-background.css',
})
export class ParticlesBackground {
  // Esta es la misma configuración que ya tienes
  particlesOptions = {
    // ... tu configuración actual de particlesOptions
background: {
      color: {
        value: "transparent",
      },
    },
    fpsLimit: 120,
    interactivity: {
      events: {
        onClick: {
          enable: true,
          mode: "push",
        },
        onHover: {
          enable: true,
          mode: "repulse",
        },
      },
    },
    particles: {
      color: {
        value: "#ffffff",
      },
      links: {
        color: "#ffffff",
        distance: 150,
        enable: true,
        opacity: 0.5,
        width: 1,
      },
      move: {
        enable: true,
        speed: 2,
      },
      number: {
        density: {
          enable: true,
          area: 800,
        },
        value: 80,
      },
      opacity: {
        value: 0.5,
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 1, max: 5 },
      },
    },
    detectRetina: true,
  };

  constructor() {
    afterNextRender(() => {
      loadSlim(tsParticles);
    });
  }
}