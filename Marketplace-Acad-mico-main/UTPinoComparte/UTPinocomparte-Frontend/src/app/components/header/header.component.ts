import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

declare var bootstrap: any; // Permite controlar los modales de Bootstrap mediante JS

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  usuarioLogueado: string | null = null;
  inicialUsuario: string = '';
  fotoUsuario: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // Nos suscribimos al observable escuchando múltiples variantes de campos de Laravel
    this.authService.usuario$.subscribe((data: any) => {
      console.log('Datos del usuario en el Header:', data);

      // Detecta nombre en español, inglés o en tu campo personalizado de base de datos
      const nombreUsuario = data?.nombre || data?.name || data?.nom_us;
      const rawFoto = data?.foto || data?.avatar || data?.img_us;

      if (data && nombreUsuario) {
        this.usuarioLogueado = nombreUsuario;
        this.inicialUsuario = (nombreUsuario as string).charAt(0).toUpperCase();

        // 🔑 AQUÍ CONSTRUIMOS LA RUTA DE LA FOTO CORRECTAMENTE:
        if (rawFoto) {
          // Si ya viene con http/https lo dejamos igual, si no, le pegamos la URL del servidor Laravel
          this.fotoUsuario = rawFoto.startsWith('http') 
            ? rawFoto 
            : `http://127.0.0.1:8000/storage/${rawFoto}`;
        } else {
          this.fotoUsuario = null;
        }

      } else {
        this.usuarioLogueado = null;
        this.fotoUsuario = null;
        this.inicialUsuario = '';
      }
    });
  }

  // Función para cerrar sesión usando el servicio
  cerrarSesion() {
    this.authService.cerrarSesion();
    this.router.navigate(['/inicio']); // Redirige al inicio
  }

  // Función que controla si abre el modal de publicar o pide iniciar sesión
  
  // Función para verificar el acceso y abrir el formulario completo
  verificarAccesoPublicar(): void {
    if (this.usuarioLogueado) {
      this.router.navigate(['/publicar']);
    } else {
      alert('Por favor, inicia sesión para poder publicar un artículo.');
      this.router.navigate(['/auth']);
    }
  }
}