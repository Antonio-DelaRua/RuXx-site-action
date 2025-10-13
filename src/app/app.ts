import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./components/navbar/navbar";
import { Hero } from "./components/hero/hero";
import { Proyectos } from "./components/proyectos/proyectos";
import { RutalearningComponent } from "./components/rutalearning/rutalearning";
import { Certificates } from './components/certificates/certificates';
import { Contact } from './components/contact/contact';
import { Footer } from "./components/footer/footer";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, Hero, Proyectos, RutalearningComponent, Certificates, Contact, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Selina-web');
}
