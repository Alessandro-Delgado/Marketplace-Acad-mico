import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Profile } from '../../model/profile.model';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css'
})
export class PerfilComponent implements OnInit {
  private profileService = inject(ProfileService);

  // Permitimos que sea Profile o null/undefined para que el '?.' del HTML tenga sentido
  usuario?: Profile; 

  ngOnInit(): void {
    this.profileService.getProfile().subscribe({
      next: (data) => {
        this.usuario = data;
      },
      error: (err) => {
        console.error('Error al cargar el perfil', err);
      }
    });
  }
}
