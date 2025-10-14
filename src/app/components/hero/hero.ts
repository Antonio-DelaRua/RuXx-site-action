import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './hero.html',
  styleUrl: './hero.css'
})
export class Hero {

}
