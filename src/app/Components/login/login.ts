import { ChangeDetectorRef, Component } from '@angular/core';
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
  
  constructor(private auth:AuthService,private router:Router,private cdr:ChangeDetectorRef) {
  }
  process:boolean = false;
  email:string="";
  password:string="";
  login(){
    this.process = true;
    this.auth.login({email:this.email,password:this.password}).subscribe({
      next :(resp)=>{
        this.process=false;
        localStorage.setItem("Token",resp.token);
        localStorage.setItem("UserId",resp.id);
        this.router.navigate(["/bills"]);
        this.auth.setLoggedInStatus(true);
        this.cdr.detectChanges();
      },
      error:(err)=>{
        console.log(err);
        this.router.navigate(["/login"]);

      }
    });
    
  }

}
