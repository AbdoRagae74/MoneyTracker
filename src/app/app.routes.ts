import { Routes } from '@angular/router';
import { Bills } from './Components/bills/bills';
import { Login } from './Components/login/login';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'bills', component: Bills },
  { path: 'login', component: Login },
  { path: '**', redirectTo: '/bills' }
];
