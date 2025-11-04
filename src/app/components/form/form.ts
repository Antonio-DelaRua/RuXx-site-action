import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LanguageService } from '../../services/language-service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import emailjs from '@emailjs/browser';



@Component({
  selector: 'app-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, TranslateModule],
  templateUrl: './form.html',
  styleUrl: './form.css'
})
export class Form implements OnInit{

  contactForm: FormGroup;
  isLoading = false;
  isSuccess = false;

  constructor(
    private fb: FormBuilder,
    public translate: TranslateService,
    private languageService: LanguageService
    ) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });

    // Initialize EmailJS with your public key
    emailjs.init('47clf-2HxwKqq2ACT');
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.isLoading = true;
      this.isSuccess = false;

      const templateParams = {
        from_name: this.contactForm.value.name,
        from_email: this.contactForm.value.email,
        subject: this.contactForm.value.subject,
        message: this.contactForm.value.message,
        to_name: 'RuXx Developer', // Your name or recipient name
      };

      emailjs.send('service_umv0e6s', 'template_p1cqn4u', templateParams)
        .then((response) => {
          console.log('SUCCESS!', response.status, response.text);
          this.isLoading = false;
          this.isSuccess = true;
          this.contactForm.reset();
          // Reset success state after 3 seconds
          setTimeout(() => {
            this.isSuccess = false;
          }, 3000);
        }, (error) => {
          console.log('FAILED...', error);
          this.isLoading = false;
          alert('Error al enviar el mensaje. Por favor, inténtalo de nuevo.');
        });
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

    ngOnInit() {
    // Suscribirse a los cambios de idioma del servicio
    this.languageService.currentLang$.subscribe(lang => {
      this.translate.use(lang);
    });

    // Establecer el idioma inicial
    this.translate.use(this.languageService.currentLang);
  }
}

