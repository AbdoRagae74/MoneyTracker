import { HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable()
export class jwtInterceptor implements HttpInterceptor  {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

     let accessToken:string|null = localStorage.getItem("Token");
     
    if(accessToken){
      let req2 = req.clone({
        setHeaders:{Authorization: `Bearer ${accessToken}`}
      });
      return next.handle(req2);
    } 
      return next.handle(req);


  }

}
