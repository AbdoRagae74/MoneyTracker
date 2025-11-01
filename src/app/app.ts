import { ChangeDetectorRef, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Bills } from "./Components/bills/bills";

import { AuthService } from './Services/AuthService';
import { navbar } from './Components/navbar/navbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, navbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'MoneyTrackerFront';
  
  constructor(private auth:AuthService , private cdr:ChangeDetectorRef ) {}

    

}
