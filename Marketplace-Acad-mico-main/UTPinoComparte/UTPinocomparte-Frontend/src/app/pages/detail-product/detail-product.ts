import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService, Producto } from '../../services/product.service';

@Component({
  selector: 'app-detailproduct',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './detail-product.html',
  styleUrls: ['./detail-product.css']
})
export class DetailProductComponent implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productService = inject(ProductService);

  producto: Producto | null = null;

  loading: boolean = true;
  errorMessage: string = '';

  ngOnInit(): void {

    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    if (!id) {

      this.errorMessage =
        'El producto solicitado no es válido.';

      this.loading = false;

      return;
    }

    this.cargarProducto(id);
  }

  cargarProducto(id: number): void {

    this.productService.getProducto(id).subscribe({

      next: (producto) => {

        this.producto = producto;

        this.loading = false;
      },

      error: (error) => {

        console.error(
          'Error al obtener producto:',
          error
        );

        this.errorMessage =
          'No se pudo encontrar el producto.';

        this.loading = false;
      }

    });
  }

  volver(): void {

    this.router.navigate(['/']);
  }

  eliminarProducto(): void {

    if (!this.producto?.productoid) {
      return;
    }

    const confirmar = confirm(
      '¿Estás seguro de que deseas eliminar este producto?'
    );

    if (!confirmar) {
      return;
    }

    this.productService
      .eliminarProducto(this.producto.productoid)
      .subscribe({

        next: () => {

          alert('Producto eliminado correctamente.');

          this.router.navigate(['/']);
        },

        error: (error) => {

          console.error(
            'Error al eliminar:',
            error
          );

          this.errorMessage =
            'No se pudo eliminar el producto.';
        }

      });
  }
}
