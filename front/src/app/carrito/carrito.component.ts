import { Component, OnInit } from '@angular/core';
import { Contenido } from '../contenido/contenido';
import { CarritoService } from './carrito.service';
import { environment } from 'environments/environment';
import { TokenService } from 'src/app/seguridad/service/token.service';
import { ContenidoUsuarioService } from '../contenido-usuario/contenido-usuario.service';
import { UsuarioService } from '../usuario/usuario.service';
import { AuthService } from '../seguridad/service/auth.service';
import { switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ContenidoUsuario } from '../contenido-usuario/contenido-usuario';
import { UsuarioDto2 } from '../usuario/usuario-dto2';
import { ContenidoService } from '../contenido/contenido.service';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
  contenidoEnCarrito: Contenido[] = [];
  public urlFoto: string = environment.endPointFoto;
  rating: number = 4.5; // Puedes asignar el número de calificación aquí
  sumaTotal: number = 0;
  usuario: UsuarioDto2 = new UsuarioDto2();
  listaContenidos: Contenido[] = []; // Lista de contenidos suscritos por categoría
  constructor(
    public carritoService: CarritoService,
    private contenidoUsuarioService: ContenidoUsuarioService,
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private router: Router,
    public tokenService: TokenService,
    private contenidoService: ContenidoService
  ) {
    
    

    // Suscribirse al observable usuarioActual2 y loguear el resultado
    /* this.tokenService.usuarioActual2().subscribe(
      usuario => {
        if(usuario?.roles[0].rolNombre === "ROLE_ESTUDIANTE"){
          let nombreCategoria = this.carritoService.obtenerCarritoActual()?.[0]?.listaContenidoUsuario?.[0]?.contenido?.categoria?.nombre;
          console.log("Nombre categoria: ", nombreCategoria);
          let nombreUsuario = usuario.nombreUsuario;
          console.log("Nombre usuario: ", nombreUsuario);
          if(nombreCategoria){
            this.contenidoPorCategoria(nombreCategoria, nombreUsuario, true, true);
          }

          let carrito = this.carritoService.obtenerCarritoActual();
          carrito.forEach((elemento, i) =>{
            this.contenidoService.existsContenido(nombreCategoria, usuario.id ,elemento.id).subscribe(existe=>{
              console.log("existe contenido1111?: ", existe);
              if(!existe){
                this.eliminarDelCarrito(elemento);
              }
            });
          });
          
        }
        console.log("Usuario actual:", usuario);
      },
      error => {
        console.error("Error obteniendo el usuario actual:", error);
      }
    ); */
  }
  contenidoPorCategoria(nombreCategoria: string, nombreUsuario: string, mostrarTodos:boolean, activado:boolean){
    this.contenidoService.contenidosCompleto(nombreCategoria, nombreUsuario, mostrarTodos, activado).subscribe((paginacion) => {
       
      this.listaContenidos = paginacion.content as Contenido[];
      console.log("contenidos por categoria");
      console.log(this.listaContenidos);
      });
  }

  ngOnInit(): void {
    this.carritoService.carrito$.subscribe(nuevoCarrito => {
      this.contenidoEnCarrito = nuevoCarrito;
      this.calcularSumaTotal();
      this.crearContenidoUsuario();
    });
  }
  calcularSumaTotal(): void {
    this.sumaTotal = this.contenidoEnCarrito.reduce((total, contenido) => 
      total + contenido.precio * (1 + contenido.porcentajeAdmin), 0);
    console.log(this.sumaTotal);
  }
  crearContenidoUsuario(): void {
    this.usuarioService.buscarUsuarioPorNombre(this.tokenService.getUserName()).subscribe(usuario => {
      //console.log(usuario);
    });
  }
  contenidoUsuario() {
    this.usuarioService.buscarUsuarioPorNombre(this.tokenService.getUserName()).subscribe(
      usuario => {
        console.log(usuario);
        if (usuario && usuario.roles.some((rol: any) => rol.rolNombre === 'ROLE_ESTUDIANTE')) {
          console.log("El usuario ya es ESTUDIANTE. Agregando contenidos...");
          this.agregarContenidosAlUsuario(usuario);
          //this.listarContenidosPorCategoria(usuario); // Obtener contenidos suscritos por categoría
        } else {
          this.authService.cambiarRolUsuario(this.tokenService.getUserName(), "ESTUDIANTE").pipe(
            switchMap(() => this.usuarioService.buscarUsuarioPorNombre(this.tokenService.getUserName()))
          ).subscribe(
            usuario => {
              console.log("Usuario actualizado con el rol de ESTUDIANTE:", usuario);
              this.agregarContenidosAlUsuario(usuario);
              //this.listarContenidosPorCategoria(usuario); // Obtener contenidos suscritos por categoría
           
            },
            error => {
              console.error('Error cambiando el rol del usuario:', error);
            }
          );
        }
      },
      error => {
        console.error('Error obteniendo información del usuario:', error);
      }
    );
  }

  private agregarContenidosAlUsuario(usuario: any) {
    this.contenidoEnCarrito.forEach(contenido => {
      let contenidoUsuario: ContenidoUsuario = new ContenidoUsuario();
      contenidoUsuario.usuario = usuario;
      contenidoUsuario.contenido = contenido;
      this.contenidoUsuarioService.agregarElemento(contenidoUsuario).subscribe(
        contenidoUsuario => {
          console.log("Contenido agregado al usuario:", contenidoUsuario);
        },
        error => {
          console.error('Error al agregar contenido al usuario:', error);
        }
      );
    });
    this.limpiarCarrito();
    this.router.navigate(['/']);
  }
  limpiarCarrito(): void {
    this.carritoService.limpiarCarrito();
    this.contenidoEnCarrito = [];
  }
  eliminarDelCarrito(contenido: Contenido): void {
    this.carritoService.eliminarElementoDelCarrito(contenido.id);
  }
}