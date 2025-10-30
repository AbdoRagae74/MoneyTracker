import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../Services/AuthService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  
  constructor(private auth:AuthService,private router:Router) {
  }
  email:string="";
  password:string="";
  login(){

    this.auth.login({email:this.email,password:this.password}).subscribe({
      next :(resp)=>{
        // console.log(resp.token);
        // console.log(resp.id);
        localStorage.setItem("Token",resp.token);
        localStorage.setItem("UserId",resp.id);
        this.router.navigate(["/bills"]);
      },
      error:(err)=>{
        console.log(err);
        this.router.navigate(["/login"]);

      }
    });
    
  }
}
