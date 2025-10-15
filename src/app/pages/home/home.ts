import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar';
import { Hero } from '../../components/hero/hero';
import { Proyectos } from '../../components/proyectos/proyectos';
import { RutalearningComponent } from '../../components/rutalearning/rutalearning';
import { Certificates } from '../../components/certificates/certificates';
import { Contact } from '../../components/contact/contact';
import { Footer } from '../../components/footer/footer';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InteractiveImageComponent } from "../../components/interactive-image/interactive-image";


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavbarComponent,
    Hero,
    Proyectos,
    RutalearningComponent,
    Certificates,
    Contact,
    Footer,
    InteractiveImageComponent
],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

}
