import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FileUploadComponent } from './components/file-upload/file-upload';
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-root',
  standalone: true, 
  imports: [RouterOutlet, CommonModule, HttpClientModule, FileUploadComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css'], 
})
export class AppComponent {
  title = signal('RuXxDev'); 
}