
import { Routes } from '@angular/router';

import { InicioComponent } from './pages/inicio/inicio';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { PerfilComponent } from './pages/perfil/perfil';
import { ChatComponent } from './pages/chat/chat';
import { DetailProductComponent } from './pages/detail-product/detail-product';
import { PublicacionProductComponent } from './pages/publicacion-product/publicacion-product';
import { AuthModalComponent } from './pages/authmodal/authmodal';

export const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'auth', component: AuthModalComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegisterComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'producto/:id', component: DetailProductComponent },
  { path: 'publicar', component: PublicacionProductComponent },
  { path: '**', redirectTo: '' }
];
