import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { ProductService } from '../../services/product.service';
import { Producto } from '../../services/product.service';
import { ChatService } from '../../services/chat.service';

import {
  ProductCardComponent,
  ProductCardData
} from '../../components/product-card/product-card.component';

interface Item {
  id?: number;
  productoid?: number;
  usuarioid?: number | null;

  title: string;
  subtitle: string;
  price: string;
  oldPrice?: number | null;

  category: string;
  type: string;
  image: string;

  nom_prod?: string;
  img_prod?: string | null;
  precio?: number | null;
  stock?: number;
  categoria?: string;
  tipoPublicacion?: string;
  estado?: string;

  isFavorite: boolean;
}

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    ProductCardComponent
  ],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css'
})
export class InicioComponent implements OnInit {

  private productService = inject(ProductService);
  private chatService = inject(ChatService);
  private router = inject(Router);


  
convertirPrecio(precio: string | number): number {
  const numero = Number(String(precio).replace(/[^\d.-]/g, ''));
  return Number.isFinite(numero) ? numero : 0;
}

convertirTipo(tipo: string): 'venta' | 'intercambio' {
  return tipo === 'intercambio' ? 'intercambio' : 'venta';
}


  isArticleModalOpen = false;

newArticle = {
  title: '',
  price: null as number | null,
  category: '',
  subtitle: '',
  image: ''
};
activeCategory = 'all';
activeTab = 'all';
  // Modales
  mostrarModalAuth = false;
  mostrarModalArticulo = false;

  // Autenticación e interfaz
  usuarioLogueado: string | null = null;
  mostrarRegistro = false;

  // Filtros
 selectedCategory = 'all';
selectedTab = 'all';
  textoBusqueda = '';

  // Productos
  items: Item[] = [
    {
      title: 'iPhone 13 Pro',
      subtitle: 'Tecnología',
      price: 'S/ 2500.00',
      category: 'electronica',
      type: 'venta',
      image: 'imgs/Iphone.webp',
      isFavorite: false
    },
    {
      title: 'Bicicleta Urbana',
      subtitle: 'Deportes',
      price: 'Intercambio',
      category: 'deportes',
      type: 'intercambio',
      image: 'imgs/Bicicleta.jpeg',
      isFavorite: false
    },
    {
      title: 'Libro HTML, CSS y JS',
      subtitle: 'Libros',
      price: 'Intercambio',
      category: 'libros',
      type: 'intercambio',
      image: 'imgs/LibroHTML,CSS,JS.jpeg',
      isFavorite: false
    },
    {
      title: 'MacBook Pro',
      subtitle: 'Tecnología',
      price: 'S/ 4500.00',
      category: 'electronica',
      type: 'venta',
      image: 'imgs/MacBook.webp',
      isFavorite: false
    },
    {
      title: 'Pluma estilo gráfica',
      subtitle: 'Arte',
      price: 'S/ 750.00',
      category: 'arte',
      type: 'venta',
      image: 'imgs/PlumaEstiloGrafica.jpg',
      isFavorite: false
    }
  ];

  // Datos de publicación
  tituloArticulo = '';
  precioArticulo: number | null = null;
  categoriaArticulo = '';
  tipoArticulo = 'venta';
  estadoArticulo = '';
  imagenArticulo = '';

  ngOnInit(): void {
    this.usuarioLogueado = localStorage.getItem('usuario');
    this.cargarProductos();
  }

  // =========================================
  // CARGAR PRODUCTOS DESDE LARAVEL
  // =========================================

 
cargarProductos(): void {
  this.productService.getProductos().subscribe({
    next: (productos: Producto[]) => {
      if (!productos || productos.length === 0) {
        return;
      }

      this.items = productos.map((producto: Producto) => {
        const categoriaBD: any = producto.categoria;

        const categoriaNombre = String(
          categoriaBD?.nombre ??
          categoriaBD?.nom_cat ??
          'Producto'
        );

        const categoriaFiltro = this.normalizarCategoria(categoriaNombre);

        const tipo = String(
          producto.tipo_publicacion ?? 'venta'
        ).toLowerCase();

        const imagen = producto.img_prod
          ? (
              producto.img_prod.startsWith('http')
                ? producto.img_prod
                : `http://127.0.0.1:8000/storage/${producto.img_prod}`
            )
          : 'imgs/logo.png.jpeg';

        // Comprobar si el producto tiene vendedor
        console.log(
          console.log('Datos del producto:', JSON.stringify(producto, null, 2))
        );

        return {
          id: producto.productoid,
          productoid: producto.productoid,
          usuarioid: producto.usuarioid ?? null,

          title: producto.nom_prod,
          nom_prod: producto.nom_prod,

          subtitle: categoriaNombre,
          categoria: categoriaNombre,

          price: tipo === 'intercambio'
            ? 'Intercambio'
            : `S/ ${Number(producto.precio ?? 0).toFixed(2)}`,

          precio: Number(producto.precio ?? 0),
          oldPrice: null,

          category: categoriaFiltro,
          type: tipo,
          tipoPublicacion: tipo,

          image: imagen,
          img_prod: imagen,

          stock: producto.stock,
          estado: producto.estado,

          isFavorite: false
        };
      });
    },
    error: (error: any) => {
      console.error('Error al cargar productos:', error);
    }
  });
}

  

  // =========================================
  // NORMALIZAR CATEGORÍAS
  // =========================================

  private normalizarCategoria(categoria: string): string {
    const valor = categoria.toLowerCase();

    if (
      valor.includes('tecnología') ||
      valor.includes('tecnologia') ||
      valor.includes('electrónica') ||
      valor.includes('electronica')
    ) {
      return 'electronica';
    }

    if (valor.includes('ropa') || valor.includes('vestimenta')) {
      return 'ropa';
    }

    if (
      valor.includes('vehículo') ||
      valor.includes('vehiculo') ||
      valor.includes('auto')
    ) {
      return 'vehiculos';
    }

    if (valor.includes('libro')) {
      return 'libros';
    }

    if (valor.includes('arte')) {
      return 'arte';
    }

    if (
      valor.includes('deporte') ||
      valor.includes('bicicleta')
    ) {
      return 'deportes';
    }

    if (
      valor.includes('colección') ||
      valor.includes('coleccion')
    ) {
      return 'coleccion';
    }

    if (valor.includes('hogar')) {
      return 'hogar';
    }

    return valor;
  }

  // =========================================
  // PRODUCTOS FILTRADOS
  // =========================================

  get filteredItems(): Item[] {
    const busqueda = this.textoBusqueda.trim().toLowerCase();

    return this.items.filter(item => {
      const coincideCategoria =
        this.activeCategory === 'all' ||
        item.category === this.activeCategory;

      const coincideTipo =
        this.activeTab === 'all' ||
        item.type === this.activeTab;

      const coincideBusqueda =
        !busqueda ||
        item.title.toLowerCase().includes(busqueda) ||
        item.subtitle.toLowerCase().includes(busqueda) ||
        item.category.toLowerCase().includes(busqueda);

      return (
        coincideCategoria &&
        coincideTipo &&
        coincideBusqueda
      );
    });
  }

  // =========================================
  // CAMBIAR FILTROS
  // =========================================

  filterCategory(categoria: string): void {
    this.activeCategory = categoria;
  }

  filterTab(tipo: string): void {
    this.activeTab = tipo;
  }

  applyFilters(): void {
    // Los filtros se actualizan automáticamente
    // mediante el getter filteredItems.
  }

  // =========================================
  // CONTADOR DE RESULTADOS
  // =========================================

  contarResultados(): number {
    return this.filteredItems.length;
  }

  // =========================================
  // MODAL DE AUTENTICACIÓN
  // =========================================

  abrirModal(): void {
    this.mostrarModalAuth = true;
  }

  openAuthModal(): void {
    this.abrirModal();
  }

  cerrarModal(): void {
    this.mostrarModalAuth = false;
    this.mostrarRegistro = false;
  }

  // =========================================
  // INICIAR SESIÓN
  // =========================================

  onLogin(): void {
    console.log('Formulario de inicio de sesión pendiente de conectar.');
  }

  // =========================================
  // REGISTRO
  // =========================================

  onRegister(): void {
    console.log('Formulario de registro pendiente de conectar.');
  }

  // =========================================
  // PUBLICAR ARTÍCULO
  // =========================================

  onAddArticle(): void {
    console.log('Formulario de publicación pendiente de conectar.');
  }

  // =========================================
  // CONTACTAR DESDE LA TARJETA REUTILIZABLE
  // =========================================

  contactarDesdeTarjeta(producto: ProductCardData): void {
    this.contactarVendedor({
      id: producto.productoid,
      productoid: producto.productoid,
      usuarioid: producto.usuarioid,
      title: producto.nom_prod,
      nom_prod: producto.nom_prod,
      subtitle: producto.categoria ?? 'Producto',
      categoria: producto.categoria,
      price: producto.tipoPublicacion === 'intercambio'
        ? 'Intercambio'
        : `S/ ${Number(producto.precio ?? 0).toFixed(2)}`,
      precio: producto.precio ?? null,
      category: this.normalizarCategoria(
        producto.categoria ?? 'Producto'
      ),
      type: producto.tipoPublicacion ?? 'venta',
      tipoPublicacion: producto.tipoPublicacion,
      image: producto.img_prod ?? '',
      img_prod: producto.img_prod,
      stock: producto.stock,
      estado: producto.estado,
      isFavorite: false
    });
  }

  // =========================================
  // INICIAR CONVERSACIÓN CON EL VENDEDOR
  // =========================================

  contactarVendedor(item: any): void {
    const token = localStorage.getItem('auth_token');

    if (!token) {
      alert('Inicia sesión para contactar al vendedor.');
      this.abrirModal();
      return;
    }

    if (!item.id || !item.usuarioid) {
      alert(
        'Este producto no tiene un vendedor identificado. ' +
        'Comprueba que haya sido publicado correctamente.'
      );
      return;
    }

    this.chatService.crearConversacion(Number(item.id)).subscribe({
      next: (respuesta: any) => {
        const conversacionId =
          respuesta.conversacion?.conversacionid;

        if (conversacionId) {
          this.router.navigate(['/chat'], {
            queryParams: { conversacionId }
          });
        } else {
          alert(
            'La conversación se creó, pero no se recibió su identificador.'
          );
        }
      },
      error: (error: any) => {
        console.error(
          'Error al iniciar la conversación:',
          error
        );

        alert(
          error.error?.message ||
          'No se pudo iniciar el chat. Comprueba tu sesión e inténtalo nuevamente.'
        );
      }
    });
  }
}
