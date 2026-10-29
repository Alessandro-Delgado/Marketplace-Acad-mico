import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-authmodal',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './authmodal.html',
  styleUrls: ['./authmodal.css'] // Asegúrate de que coincida con styleUrl o styleUrls según tu config
})
export class AuthModalComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {
    console.log('¡ESTOY EN EL MODAL DE BIENVENIDA /AUTH!');
  }

  // Lógica para autenticación con Microsoft (Lista para cuando la implementemos)
  loginConMicrosoft() {
    console.log('Redirigiendo a Microsoft Azure AD...');
    
    // Simulación interactiva funcional por ahora
    const correoSimulado = 'usuario.microsoft@utp.edu.pe';
    localStorage.setItem('usuario', 'Microsoft User');
    alert(`¡Autenticación exitosa con Microsoft!\nBienvenido: ${correoSimulado}`);
    this.router.navigate(['/inicio']);
  }
}