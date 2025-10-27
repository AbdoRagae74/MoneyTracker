import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Bills } from "./Components/bills/bills";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HttpClientModule, Bills],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'MoneyTrackerFront';
}
