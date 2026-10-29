
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Producto {
  productoid?: number;
  usuarioid?: number | null;
  nom_prod: string;
  img_prod?: string | null;
  precio: number;
  stock: number;
  estado: string;
  cat_prodid: number;
  categoria?: any;
  tipo_publicacion: string;
}

export interface ProductoPayload {
  nom_prod: string;
  img_prod?: string;
  precio: number;
  stock: number;
  estado: string;
  cat_prodid: number;
  tipo_publicacion: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://127.0.0.1:8000/api/productos';

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }

  getProducto(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`);
  }

  crearProducto(producto: ProductoPayload): Observable<any> {
    return this.http.post<any>(this.apiUrl, producto);
  }

  actualizarProducto(
    id: number,
    producto: ProductoPayload
  ): Observable<Producto> {
    return this.http.put<Producto>(`${this.apiUrl}/${id}`, producto);
  }

  eliminarProducto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
