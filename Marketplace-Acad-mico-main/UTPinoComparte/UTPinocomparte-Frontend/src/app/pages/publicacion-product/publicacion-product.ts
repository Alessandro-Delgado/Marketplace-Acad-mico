
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  ProductService,
  ProductoPayload
} from '../../services/product.service';

@Component({
  selector: 'app-publicacionproduct',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './publicacion-product.html',
  styleUrls: ['./publicacion-product.css']
})
export class PublicacionProductComponent {
  private readonly productService = inject(ProductService);
  private readonly router = inject(Router);

  errorMessage = '';
  loading = false;

  
categorias = [
  { id: 1, nombre: 'Tecnología' },
  { id: 2, nombre: 'Ropa' },
  { id: 3, nombre: 'Libros' },
  { id: 4, nombre: 'Arte' },
  { id: 5, nombre: 'Deportes' },
  { id: 6, nombre: 'Colección' }
];

  producto: ProductoPayload = {
    nom_prod: '',
    img_prod: '',
    precio: 0,
    stock: 1,
    estado: 'disponible',
    cat_prodid: 0,
    tipo_publicacion: 'venta'
  };

  cambiarTipoPublicacion(tipo: string): void {
    this.producto.tipo_publicacion = tipo;

    if (tipo === 'intercambio') {
      this.producto.precio = 0;
    } else if (this.producto.precio <= 0) {
      this.producto.precio = 0;
    }
  }

  crearProducto(): void {
    this.errorMessage = '';

    if (!this.producto.nom_prod.trim()) {
      this.errorMessage = 'El nombre del producto es obligatorio.';
      return;
    }

    if (
      this.producto.tipo_publicacion === 'venta' &&
      this.producto.precio <= 0
    ) {
      this.errorMessage = 'El precio debe ser mayor que 0 para una venta.';
      return;
    }

    if (this.producto.stock < 0) {
      this.errorMessage = 'El stock no puede ser negativo.';
      return;
    }

    if (!this.producto.cat_prodid) {
      this.errorMessage = 'Debes seleccionar una categoría.';
      return;
    }

    if (!this.producto.estado.trim()) {
      this.errorMessage = 'Debes seleccionar un estado.';
      return;
    }

    const payload: ProductoPayload = {
      ...this.producto,
      precio: this.producto.tipo_publicacion === 'intercambio'
        ? 0
        : Number(this.producto.precio)
    };

    this.loading = true;

    this.productService.crearProducto(payload).subscribe({
      next: () => {
        alert('Producto creado correctamente.');
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Error al crear producto:', error);

        if (error.error?.errors) {
          this.errorMessage = Object.values(error.error.errors)
            .flat()
            .join(' ');
        } else {
          this.errorMessage =
            error.error?.message ||
            'No se pudo crear el producto. Revisa el backend.';
        }

        this.loading = false;
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/']);
  }
}
