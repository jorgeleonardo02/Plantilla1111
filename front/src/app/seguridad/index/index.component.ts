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

  /* nombreUsuario: string;
  esAdmin: boolean;
  rol: string;
  pathActual: any; */

  constructor(public tokenService: TokenService,
              /* private router:Router, */
              /* private encabezadoService: EncabezadoService, */
              /* private route: ActivatedRoute */) {}   
  ngOnInit(): void {
    /* this.encabezadoService.path$.subscribe(path => {
      this.pathActual = path;
      console.log("pactActual: "+this.pathActual);
    }); */
    this.tokenService.getToken();
    /* this.route.url.subscribe(url => {
      //console.log(url); // muestra la URL actual
    }); */
    //this.nombreUsuario = this.tokenService.getUserName();
    //this.esAdmin = this.tokenService.isAdmin();
    //this.rol = this.tokenService.NombreRol();
  }
  ngOnDestroy() {
    /* alert(`¡Estoy saliendo de la aplicación!!`); */
    /* 
      swal.fire({
        title: '¡Salir!',
        text: "¿Seguro que quieres salir unload?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#ad3333',
        cancelButtonText: 'No, cancelar!',
        confirmButtonText: 'Si, Salir!'
      }).then((result) => {
          if (result.value) {
            console.log("Evento unload");
          }
      }); */
  }
   /*  @HostListener("window:beforeunload", [ "$event" ])
    beforeUnloadHander(event) {
      console.log("Evento beforeunload");
      console.log(event)
    } */
}
