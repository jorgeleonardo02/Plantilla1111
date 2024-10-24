import { Component } from '@angular/core';
import { TokenService } from './seguridad/service/token.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'plantilla1';
  constructor(public tokenService: TokenService) {}

  marcaSeleccionada: string ='Volvo';
  marcas: string[] = ['volvo', 'toyota', 'mercedes', 'hyundai'];
}

