import { Component } from '@angular/core';
import { Form } from "../form/form";

@Component({
  selector: 'app-contact',
  standalone: true,
  templateUrl: './contact.html',
  styleUrls: ['./contact.css'],
  imports: [Form]
})
export class Contact {
}