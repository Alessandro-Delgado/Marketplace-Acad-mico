
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private http = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:8000/api/conversaciones';

  private headers(): HttpHeaders {
    const token = localStorage.getItem('auth_token');

    return new HttpHeaders({
      Authorization: `Bearer ${token ?? ''}`,
      Accept: 'application/json'
    });
  }

  crearConversacion(productoid: number): Observable<any> {
    return this.http.post(
      this.apiUrl,
      { productoid },
      { headers: this.headers() }
    );
  }

  obtenerConversaciones(): Observable<any[]> {
    return this.http.get<any[]>(
      this.apiUrl,
      { headers: this.headers() }
    );
  }

  obtenerMensajes(conversacionId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/${conversacionId}/mensajes`,
      { headers: this.headers() }
    );
  }

  enviarMensaje(
    conversacionId: number,
    txt_msj: string
  ): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/${conversacionId}/mensajes`,
      { txt_msj },
      { headers: this.headers() }
    );
  }
}
