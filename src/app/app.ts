import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Loader } from './components/loader/loader';

@Component({
  selector: 'app-root',
  standalone: true, 
  imports: [RouterOutlet, Loader],
  templateUrl: './app.html',
  styleUrls: ['./app.css'], 
})
export class AppComponent {
  title = signal('RuXxDev'); 
}