import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-soporte',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './soporte.component.html',
  styleUrl: './soporte.component.css'
})
export class SoporteComponent {

  reporte = {
    tipoProblema: '',
    nombre: '',
    correo: '',
    telefono: '',
    transaccion: '',
    descripcion: ''
  };

  archivos: File[] = [];
  errorArchivo = '';

  enviado = false;

  readonly tamanoMaximo = 5 * 1024 * 1024;

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files) {
      this.agregarArchivos(Array.from(input.files));
    }

    input.value = '';
  }

  onFilesDropped(event: DragEvent): void {
    event.preventDefault();

    if (event.dataTransfer?.files) {
      this.agregarArchivos(Array.from(event.dataTransfer.files));
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  private agregarArchivos(nuevosArchivos: File[]): void {
    this.errorArchivo = '';

    for (const archivo of nuevosArchivos) {
      if (archivo.size > this.tamanoMaximo) {
        this.errorArchivo =
          `El archivo "${archivo.name}" supera el límite de 5 MB.`;
        continue;
      }

      const yaExiste = this.archivos.some(
        existente =>
          existente.name === archivo.name &&
          existente.size === archivo.size &&
          existente.lastModified === archivo.lastModified
      );

      if (!yaExiste) {
        this.archivos.push(archivo);
      }
    }
  }

  eliminarArchivo(indice: number): void {
    this.archivos.splice(indice, 1);
  }

  enviarReporte(formulario: NgForm): void {
    if (formulario.invalid) {
      formulario.control.markAllAsTouched();
      return;
    }

    this.enviado = true;

    console.log('Datos del reporte:', this.reporte);
    console.log('Archivos seleccionados:', this.archivos);
  }

      nuevoReporte(): void {
      this.reporte = {
        tipoProblema: '',
        nombre: '',
        correo: '',
        telefono: '',
        transaccion: '',
        descripcion: ''
      };

      this.archivos = [];
      this.errorArchivo = '';
      this.enviado = false; 
  }
}