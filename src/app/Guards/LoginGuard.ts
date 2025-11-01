import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../Services/AuthService';

export const loginGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  

  if(auth.isLoggedIn())
      {
        router.navigate(["/bills"]); 
        return false;
      }
  
  else
    return true;
  

  return true;
};
