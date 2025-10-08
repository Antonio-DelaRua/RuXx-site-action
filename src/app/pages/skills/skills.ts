import { Component, afterNextRender } from '@angular/core';
import { NgxParticlesModule } from "@tsparticles/angular";
import { loadSlim } from "@tsparticles/slim";
import { tsParticles } from "@tsparticles/engine";

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [NgxParticlesModule],
  templateUrl: './skills.html',
  styleUrl: './skills.css',
})
export class Skills {

  // Fixed: Removed the duplicate 'particlesOptions =' declaration
  particlesOptions = {
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
    // This code block will only execute on the client side
    afterNextRender(() => {
      loadSlim(tsParticles);
      // Any initialization logic that requires the DOM can go here
      // The ngx-particles component handles its own initialization, so this hook
      // primarily ensures the component is not processed on the server
    });
  }
}