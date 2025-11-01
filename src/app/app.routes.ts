import { Routes } from '@angular/router';
import { Bills } from './Components/bills/bills';
import { Login } from './Components/login/login';
import { AuthGuard } from './Guards/AuthGuard';
import { loginGuard } from './Guards/LoginGuard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'bills', component: Bills ,canActivate:[AuthGuard]},
  { path: 'login', component: Login , canActivate:[loginGuard]},
  { path: '**', redirectTo: '/bills' }
];
