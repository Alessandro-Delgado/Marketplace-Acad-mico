import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:8000/api'; // URL de tu API en Laravel
  private backendUrl = 'http://127.0.0.1:8000'; // URL base para los archivos públicos

  // 1. BehaviorSubject para manejar el estado reactivo del usuario en tiempo real
  private usuarioSubject = new BehaviorSubject<any>(this.obtenerUsuarioGuardado());
  public usuario$: Observable<any> = this.usuarioSubject.asObservable();

  // Método para Registrarse
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  // Método para Iniciar Sesión
  login(credentials: { correo: string; contrasena: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  // Guardar el token y los datos del usuario en el LocalStorage y actualizar el estado
  saveSession(token: string, usuarioData: any): void {
    const usuarioProcesado = this.normalizarFotoUsuario(usuarioData);

    localStorage.setItem('auth_token', token);
    localStorage.setItem('usuario_data', JSON.stringify(usuarioProcesado));
    
    // Emite el cambio a toda la app para que el Header reaccione
    this.usuarioSubject.next(usuarioProcesado); 
  }

  // Mantener compatibilidad si usas saveToken suelto
  saveToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  // Obtener el token guardado
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  // Recuperar los datos del usuario desde localStorage al iniciar la app
  private obtenerUsuarioGuardado(): any {
    const data = localStorage.getItem('usuario_data');
    if (!data) return null;

    try {
      const parsedData = JSON.parse(data);
      return this.normalizarFotoUsuario(parsedData);
    } catch (e) {
      return null;
    }
  }

  // Helper para anteponer la URL de Laravel a la foto de perfil si viene como ruta relativa
  private normalizarFotoUsuario(usuario: any): any {
    if (!usuario) return null;

    const copiaUsuario = { ...usuario };
    const rawFoto = copiaUsuario.foto || copiaUsuario.avatar || copiaUsuario.img_us;

    if (rawFoto) {
      copiaUsuario.foto = rawFoto.startsWith('http')
        ? rawFoto
        : `${this.backendUrl}/storage/${rawFoto}`;
    }

    return copiaUsuario;
  }

  // Cerrar sesión limpiando todo y avisando al BehaviorSubject
  cerrarSesion(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('usuario_data');
    this.usuarioSubject.next(null); // Emite un valor nulo para cambiar a "modo invitado"
  }
}