import { Component, OnInit } from '@angular/core';
import { Curso } from '../curso/curso';
import { CarritoService } from './carrito.service';
import { environment } from 'environments/environment';
import { TokenService } from 'src/app/seguridad/service/token.service';
import { CursoUsuarioService } from '../curso-usuario/curso-usuario.service';
import { UsuarioService } from '../usuario/usuario.service';
import { AuthService } from '../seguridad/service/auth.service';
import { switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { CursoUsuario } from '../curso-usuario/curso-usuario';
import { UsuarioDto2 } from '../usuario/usuario-dto2';
import { CursoService } from '../curso/curso.service';
import { HttpClient } from '@angular/common/http';

declare var MercadoPago: any;

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
  cursoEnCarrito: Curso[] = [];
  public urlFoto: string = environment.endPointFoto;
  rating: number = 4.5; // Puedes asignar el número de calificación aquí
  sumaTotal: number = 0;
  usuario: UsuarioDto2 = new UsuarioDto2();
  listaCursos: Curso[] = []; // Lista de curso suscritos por categoría
  // MercadoPago: any;
  constructor(
    public carritoService: CarritoService,
    private cursoUsuarioService: CursoUsuarioService,
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private router: Router,
    public tokenService: TokenService,
    private cursoService: CursoService,
    private http: HttpClient
  ) {
    
  }
  cursoPorCategoria(nombreCategoria: string, nombreUsuario: string, mostrarTodos:boolean, activado:boolean){
    this.cursoService.cursoCompleto(nombreCategoria, nombreUsuario, mostrarTodos, activado).subscribe((paginacion) => {
       
      this.listaCursos = paginacion.content as Curso[];
      console.log("Cursos por categoria");
      console.log(this.listaCursos);
      });
  }

  onPagarClick() {
  if (!this.tokenService.logueado()) {
    this.router.navigate(['/registro']);
    return;
  }

  // Construir la lista que espera tu backend
  const cursos = this.cursoEnCarrito.map(curso => ({
    id: curso.id,
    nombre: curso.nombre,
    precio: curso.precio,
    porcentajeAdmin: curso.porcentajeAdmin
  }));

  // Llamar a tu backend
  this.http.post('http://localhost:8888/api/pagos/crear-preferencia', cursos)
    .subscribe((preferenceId: any) => {

      // Inicializar Mercado Pago
      /* const mp = new MercadoPago('TU_PUBLIC_KEY_AQUI', {
        locale: 'es-CO'
      }); */
      const mp = new MercadoPago('TEST-12345678-abcd1234efgh5678ijkl', {
        locale: 'es-CO'
      });

      // Abrir checkout
      mp.checkout({
        preference: { id: preferenceId.id },
        autoOpen: true
      });
    });
}
  ngOnInit(): void {

    // Cargar MercadoPago global
    MercadoPago = (window as any).MercadoPago;

    this.carritoService.carrito$.subscribe(nuevoCarrito => {
      this.cursoEnCarrito = nuevoCarrito;
      this.calcularSumaTotal();
      this.crearCursoUsuario();
    });
  }
  pagar() {
    // Primero convertir el usuario a estudiante si es necesario
    this.cursoUsuario();

    // Luego abrir MercadoPago
    this.onPagarClick();
  }
  calcularSumaTotal(): void {
    this.sumaTotal = this.cursoEnCarrito.reduce((total, curso) => 
      total + curso.precio * (1 + curso.porcentajeAdmin), 0);
      console.log(this.sumaTotal);
  }
  crearCursoUsuario(): void {
    this.usuarioService.buscarUsuarioPorNombre(this.tokenService.getUserName()).subscribe(usuario => {
      //console.log(usuario);
    });
  }
  cursoUsuario() {
    this.usuarioService.buscarUsuarioPorNombre(this.tokenService.getUserName()).subscribe(
      usuario => {
        console.log(usuario);
        if (usuario && usuario.roles.some((rol: any) => rol.rolNombre === 'ROLE_ESTUDIANTE')) {
          console.log("El usuario ya es ESTUDIANTE. Agregando cursos...");
          this.agregarCursosAlUsuario(usuario);
          //this.listarContenidosPorCategoria(usuario); // Obtener contenidos suscritos por categoría
        } else {
          this.authService.cambiarRolUsuario(this.tokenService.getUserName(), "ESTUDIANTE").pipe(
            switchMap(() => this.usuarioService.buscarUsuarioPorNombre(this.tokenService.getUserName()))
          ).subscribe(
            usuario => {
              console.log("Usuario actualizado con el rol de ESTUDIANTE:", usuario);
              this.agregarCursosAlUsuario(usuario);
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

  private agregarCursosAlUsuario(usuario: any) {
    this.cursoEnCarrito.forEach(curso => {
      let cursoUsuario: CursoUsuario = new CursoUsuario();
      cursoUsuario.usuario = usuario;
      cursoUsuario.curso = curso;
      this.cursoUsuarioService.agregarElemento(cursoUsuario).subscribe(
        cursoUsuario => {
          console.log("Contenido agregado al usuario:", cursoUsuario);
        },
        error => {
          console.error('Error al agregar curso al usuario:', error);
        }
      );
    });
    this.limpiarCarrito();
    this.router.navigate(['/']);
  }
  limpiarCarrito(): void {
    this.carritoService.limpiarCarrito();
    this.cursoEnCarrito = [];
  }
  eliminarDelCarrito(curso: Curso): void {
    this.carritoService.eliminarElementoDelCarrito(curso.id);
  }
}