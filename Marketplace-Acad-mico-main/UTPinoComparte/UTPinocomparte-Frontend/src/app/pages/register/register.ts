import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para *ngIf y [ngClass]
import { FormsModule } from '@angular/forms';   // Necesario para [(ngModel)] y (ngSubmit)
import { RouterLink, Router } from '@angular/router'; // Necesario para routerLink
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink], 
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  // Variables binding con el HTML
  registerName = '';
  registerCodEst: string = '';
  registerEmail = '';
  registerPassword = '';
  registerPasswordConfirm = '';
  registerMessage = '';

  showRegisterPassword = false;
  showConfirmPassword = false;
  selectedFile: File | null = null;

  private authService = inject(AuthService);
  private router = inject(Router);

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onRegister() {
    // Validamos que las contraseñas coincidan antes de enviar
    if (this.registerPassword !== this.registerPasswordConfirm) {
      this.registerMessage = 'Las contraseñas no coinciden.';
      return;
    }

    const codEst = this.registerCodEst || this.registerEmail.split('@')[0].toUpperCase();

    // Usamos FormData para empaquetar los textos y la foto del usuario de manera correcta
    const formData = new FormData();
    formData.append('cod_est', codEst);
    formData.append('nom_us', this.registerName);
    formData.append('correo', this.registerEmail);
    formData.append('contrasena', this.registerPassword);
    formData.append('contrasena_confirmation', this.registerPasswordConfirm);

    if (this.selectedFile) {
      formData.append('foto', this.selectedFile);
    }

    // Una única petición limpia hacia Laravel
    this.authService.register(formData).subscribe({
      next: (response: any) => {
        console.log('Registro exitoso:', response);
        
        // 🔑 Guardamos la sesión completa (token y usuario) para que el header reaccione al instante
        const token = response.token;
        const usuario = response.user || response;
        this.authService.saveSession(token, usuario);

        alert('¡Cuenta creada con éxito en UTPinoComparte!');
        this.router.navigate(['/inicio']);
      },
      error: (err) => {
        console.error('Error en el registro', err);
        if (err.error && err.error.message) {
          this.registerMessage = err.error.message;
        } else {
          this.registerMessage = 'Ocurrió un error al registrarse.';
        }
      }
    });
  }
}