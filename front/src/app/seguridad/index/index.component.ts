import { Component, HostListener, OnInit } from "@angular/core";
import { TokenService } from "../service/token.service";
/* import swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { EncabezadoService } from '../../encabezado/encabezado.service'; */
@Component({
  selector: "app-index",
  templateUrl: "./index.component.html",
  styleUrls: ["./index.component.css"],
})
export class IndexComponent implements OnInit {

  constructor(public tokenService: TokenService) {}   
  ngOnInit(): void {
    this.tokenService.getToken();
  }
  ngOnDestroy() {}
   
}
