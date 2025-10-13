import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Form } from "../form/form";

@Component({
  selector: 'app-contact',
  templateUrl: './contact.html',
  styleUrls: ['./contact.css'],
  imports: [ReactiveFormsModule, Form]
})
export class Contact {
  contactForm: FormGroup;


  technologies = [
    { name: 'Angular', logo: 'assets/tss.png' },
    { name: 'TypeScript', logo: 'assets/logo1ang.png' },
    { name: 'Bootstrap', logo: 'assets/docker.jpg' },
    { name: 'HTML5', logo: 'assets/css.png' },
    { name: 'CSS3', logo: 'assets/html.png' },
    { name: 'Node.js', logo: 'assets/jss.png' },
    { name: 'Git', logo: 'assets/gtt.png' },
    { name: 'Docker', logo: 'assets/sp.png' }
  ];

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      console.log('Datos del formulario:', this.contactForm.value);
      // Aquí integrarías tu servicio para enviar el correo
      alert('¡Mensaje enviado! (Esta es una simulación)');
      this.contactForm.reset();
    } else {
      // Marcar todos los campos como "touched" para mostrar errores de validación
      Object.keys(this.contactForm.controls).forEach(key => {
        this.contactForm.get(key)?.markAsTouched();
      });
    }
  }

  // Métodos auxiliares para validación más limpia en el template
  get name() { return this.contactForm.get('name'); }
  get email() { return this.contactForm.get('email'); }
  get subject() { return this.contactForm.get('subject'); }
  get message() { return this.contactForm.get('message'); }
}