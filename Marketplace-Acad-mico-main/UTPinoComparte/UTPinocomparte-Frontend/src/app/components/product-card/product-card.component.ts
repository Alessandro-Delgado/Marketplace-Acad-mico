
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

export type TipoPublicacion = 'venta' | 'intercambio';

export interface ProductCardData {
  productoid?: number;
  usuarioid?: number | null;
  nom_prod: string;
  img_prod?: string | null;
  precio?: number | null;
  stock?: number;
  categoria?: string;
  tipoPublicacion?: TipoPublicacion;
  estado?: string;
}

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  @Input({ required: true }) product!: ProductCardData;

  @Output() contactar = new EventEmitter<ProductCardData>();

  get esIntercambio(): boolean {
    return this.product.tipoPublicacion === 'intercambio';
  }

  contactarVendedor(): void {
    if (!this.product.productoid || !this.product.usuarioid) {
      alert('Este producto no tiene un vendedor identificado.');
      return;
    }

    this.contactar.emit(this.product);
  }
}
