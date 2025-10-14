import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true, // ✅ falta en tu versión
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.css'], // ✅ debe ser styleUrls (plural)
})
export class AppComponent {
  title = signal('RuXxDev'); // ✅ no es necesario "protected readonly" aquí
}