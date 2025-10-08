import { Component, OnInit } from '@angular/core';
import { NavBar } from '../../components/navbar/navbar';
import { Footer } from "../../components/footer/footer";

@Component({
  selector: 'app-home',
  imports: [NavBar, Footer],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home  { // Ahora OnInit está definido
  constructor() {}


}