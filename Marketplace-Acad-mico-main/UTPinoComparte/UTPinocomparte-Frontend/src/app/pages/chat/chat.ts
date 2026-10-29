
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { ChatService } from '../../services/chat.service';

interface Mensaje {
  idRemitente: number;
  idDestinatario: number;
  contenido: string;
  fechaEnvio?: string;
}

interface Conversacion {
  conversacionid: number;
  nombre?: string;
  tipo?: string;
  participantes?: any[];
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css'
})
export class ChatComponent implements OnInit, OnDestroy {
  private chatService = inject(ChatService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  mensajes: Mensaje[] = [];
  conversaciones: Conversacion[] = [];
  nuevoMensajeTexto = '';

  idUsuarioActual = 0;
  conversacionId = 0;

  cargando = false;
  enviando = false;
  errorMensaje = '';

  private actualizacionSubscription?: Subscription;
  private rutaSubscription?: Subscription;

  ngOnInit(): void {
    this.obtenerUsuarioActual();

    if (!this.idUsuarioActual) {
      return;
    }

    this.cargarConversaciones();

    this.rutaSubscription = this.route.queryParamMap.subscribe(params => {
      const id = Number(params.get('conversacionId'));

      this.conversacionId = id > 0 ? id : 0;

      if (this.conversacionId) {
        this.cargarHistorial();
        this.iniciarActualizacion();
      } else {
        this.mensajes = [];
        this.actualizacionSubscription?.unsubscribe();
      }
    });
  }

  private obtenerUsuarioActual(): void {
    const usuarioGuardado = localStorage.getItem('usuario_data');

    if (!usuarioGuardado) {
      this.errorMensaje = 'Inicia sesión para utilizar el chat.';
      return;
    }

    try {
      const usuario = JSON.parse(usuarioGuardado);

      this.idUsuarioActual = Number(
        usuario.usuarioid ?? usuario.id ?? usuario.usuario_id
      );

      if (!this.idUsuarioActual) {
        this.errorMensaje = 'No se pudo identificar tu usuario. Inicia sesión nuevamente.';
      }
    } catch {
      this.errorMensaje = 'No se pudieron recuperar los datos de tu sesión.';
    }
  }

  cargarConversaciones(): void {
    this.chatService.obtenerConversaciones().subscribe({
      next: (data: any[]) => {
        this.conversaciones = data ?? [];
      },
      error: (error: any) => {
        console.error('Error al cargar conversaciones:', error);
        this.errorMensaje =
          error.error?.message ?? 'No se pudieron cargar tus chats.';
      }
    });
  }

  seleccionarConversacion(id: number): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { conversacionId: id },
      queryParamsHandling: 'merge'
    });
  }

  obtenerNombreChat(chat: Conversacion): string {
    const otroParticipante = chat.participantes?.find(
      p => Number(p.usuario?.usuarioid) !== this.idUsuarioActual
    );

    const usuario = otroParticipante?.usuario;

    return usuario?.name
      ?? usuario?.nombre
      ?? chat.nombre
      ?? `Conversación ${chat.conversacionid}`;
  }

  private iniciarActualizacion(): void {
    this.actualizacionSubscription?.unsubscribe();

    this.actualizacionSubscription = interval(5000).subscribe(() => {
      this.cargarHistorial(true);
      this.cargarConversaciones();
    });
  }

  cargarHistorial(silencioso = false): void {
    if (!this.conversacionId || !this.idUsuarioActual) {
      return;
    }

    if (!silencioso) {
      this.cargando = true;
      this.errorMensaje = '';
    }

    this.chatService.obtenerMensajes(this.conversacionId).subscribe({
      next: (data: any[]) => {
        this.mensajes = data.map((mensaje: any) => ({
          idRemitente: Number(
            mensaje.participante?.usuario?.usuarioid ??
            mensaje.participante?.usuario?.id ??
            mensaje.usuarioid ??
            0
          ),
          idDestinatario: 0,
          contenido: mensaje.txt_msj ?? '',
          fechaEnvio: mensaje.fech_envio ?? ''
        }));

        this.cargando = false;
      },
      error: (error: any) => {
        console.error('Error al cargar mensajes:', error);
        this.cargando = false;

        if (!silencioso) {
          this.errorMensaje =
            error.error?.message ?? 'No se pudieron cargar los mensajes.';
        }
      }
    });
  }

  enviar(): void {
    const contenido = this.nuevoMensajeTexto.trim();

    if (!contenido || !this.conversacionId || this.enviando) {
      return;
    }

    this.enviando = true;
    this.errorMensaje = '';

    this.chatService.enviarMensaje(this.conversacionId, contenido).subscribe({
      next: () => {
        this.nuevoMensajeTexto = '';
        this.enviando = false;
        this.cargarHistorial(true);
        this.cargarConversaciones();
      },
      error: (error: any) => {
        console.error('Error al enviar mensaje:', error);
        this.enviando = false;
        this.errorMensaje =
          error.error?.message ?? 'No se pudo enviar el mensaje.';
      }
    });
  }

  ngOnDestroy(): void {
    this.actualizacionSubscription?.unsubscribe();
    this.rutaSubscription?.unsubscribe();
  }
}
