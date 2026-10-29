import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  openArticleModal() {
    // Aquí puedes poner la lógica de tu modal o dejarlo vacío por ahora
    console.log('Abriendo modal desde el footer...');
  }
}