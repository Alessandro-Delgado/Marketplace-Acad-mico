import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  // Variables que enlazan con el HTML (login.html)
  loginEmail = '';
  loginPassword = '';
  loginMessage = '';
  
  showLoginPassword = false;

  private authService = inject(AuthService);
  private router = inject(Router);

  onLogin() {
    const credentials = {
      correo: this.loginEmail,
      contrasena: this.loginPassword
    };

    this.authService.login(credentials).subscribe({
      next: (response: any) => {
        console.log('Login exitoso:', response);
        
        // 🔑 Guardamos de forma segura buscando tanto en response.user como en la respuesta general
        const token = response.token;
        const usuario = response.user || response;

        this.authService.saveSession(token, usuario);

        // Redirigimos al inicio de inmediato para que el header reaccione
        this.router.navigate(['/inicio']);
      },
      error: (err) => {
        console.error('Error en el login', err);
        this.loginMessage = err.error?.message || 'Credenciales incorrectas.';
      }
    });
  }
}