import { Component, OnInit } from '@angular/core';
import { LoginUsuario } from '../modeloAcceso/login-usuario';
import { TokenService } from '../service/token.service';
import { AuthService } from '../service/auth.service';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../usuario/usuario.service';
import { CarritoService } from 'src/app/carrito/carrito.service';
import { CursoService } from 'src/app/curso/curso.service';
import { Curso } from 'src/app/curso/curso';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  nombreUsuario: string; 
  password: string;
  errMsj: string;
  rol: string;
  isLogged: boolean;
  esAdmin: boolean;
  esOperador: boolean;
  esUsuario: boolean;
  esPropietario: boolean;
  camposFormulario: FormGroup;
  iniciaSesion:boolean;
  public loginUsuario: LoginUsuario = new LoginUsuario();
  public eventoCheckbox: boolean = false;
  token: string;

  constructor( private tokenService: TokenService,
               private authService: AuthService,
               private router: Router,
               private constructorFormulario: FormBuilder,
               private usuarioService: UsuarioService,
               private carritoService: CarritoService,
               private cursoService: CursoService,
               private toastr: ToastrService) { }
               
  ngOnInit(): void {
    //this.esAdmin = this.tokenService.isAdmin();
    this.CrearFormulario();
  }

  usuarioActual(){
    this.usuarioService.buscarUsuarioPorNombre(this.tokenService.getNombreUsuario()).subscribe(usuario =>{
      //console.log("Usuario LEOO");
      //console.log(usuario);
    });
  }
  
  // Al darle en checked puede ver la contraseña
  EventoCheckboxPassword(evento:any){
    this.eventoCheckbox = evento;
  }

  // Se crea el formulario
  CrearFormulario(): void {
    this.camposFormulario = this.constructorFormulario.group({
        nombreUsuario: ['', Validators.required],
        password: ['', Validators.required]
    });
  }

    Login(): void {
      this.loginUsuario.nombreUsuario = this.camposFormulario.get('nombreUsuario')?.value;
      this.loginUsuario.password = this.camposFormulario.get('password')?.value;
    
      this.authService.login(this.loginUsuario).subscribe(data => {
        this.usuarioActual();
        this.tokenService.setNombreUsuario(data.nombre); 
        this.tokenService.setCorreoUsuario(data.correo); 
        this.tokenService.setToken(data.token);
    
        this.tokenService.usuarioActual2().subscribe(
          usuario => {
            if (usuario?.roles[0].rolNombre === "ROLE_ESTUDIANTE") {
              let carrito = this.carritoService.obtenerCarritoActual();
              let observables = carrito.map(elemento => {
                console.log(elemento);
                 let nombreCategoria = elemento?.listaCursoUsuario?.[0]?.curso?.categoria?.nombre;
                return this.cursoService.existsCurso(nombreCategoria, usuario.id, elemento.id).pipe(
                  map(existe => ({ existe, elemento }))
                );
              });
    
              forkJoin(observables).subscribe(results => {
                results.forEach(result => {
                  if (!result.existe) {
                    this.eliminarDelCarrito(result.elemento);
                  }
                });
              });
            }
            console.log("Usuario actual:", usuario);
          },
          error => {
            console.error("Error obteniendo el usuario actual:", error);
          }
        );
    
        this.router.navigate(['/inicio']);
      },
      err => {
        this.errMsj = err.error.message;
        this.toastr.error(this.errMsj, 'Fail', {
          timeOut: 10000,
          positionClass: 'toast-top-center',
        });
        this.router.navigate(['/login']);
      });
    }

  listaCursos: Curso[];
  cursoPorCategoria(nombreCategoria: string, nombreUsuario: string, mostrarTodos:boolean, activado:boolean){
    this.cursoService.cursoCompleto(nombreCategoria, nombreUsuario, mostrarTodos, activado).subscribe((paginacion) => {
      this.listaCursos = paginacion.content as Curso[];
      });
  }
  eliminarDelCarrito(curso: Curso): void {
    this.carritoService.eliminarElementoDelCarrito(curso.id);
  }
}
