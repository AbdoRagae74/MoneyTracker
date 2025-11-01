import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Services/AuthService';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class navbar implements OnInit {

  constructor(private auth:AuthService,private router:Router ) {}
  isloggedin=false;
  ngOnInit(): void {
    if (localStorage.getItem('Token')) {
      this.auth.setLoggedInStatus(true);
    }
    this.auth.subIsLoggedIn().subscribe({
      next :(resp)=>{
        this.isloggedin = resp;
      }
      ,
      error : (err)=> {
        console.log("Something went wrong");
      },
    })

  }
   logout() {
    localStorage.clear();
    this.auth.setLoggedInStatus(false);
    this.router.navigate(['/login']);
  }

}
