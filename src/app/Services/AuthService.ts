import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAuthResponse } from '../Interfaces/IAuthResponse';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient) {
  }
  // baseUrl:string="https://localhost:7111/api/auth/login";
  baseUrl: string = "https://moneytracker.runasp.net/api/auth/login";

  getToken() {
    if (typeof window !== 'undefined' && localStorage) {
      return localStorage.getItem('Token');
    }
    return false;
  }

  login(loginData:any){
    return this.http.post<IAuthResponse>(this.baseUrl,loginData);  
  }


}
