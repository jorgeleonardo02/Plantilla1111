import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { CategoriaService } from 'src/app/categoria/categoria.service';
import { TokenService } from 'src/app/seguridad/service/token.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Categoria } from 'src/app/categoria/categoria';
import { FormCursoComponent } from 'src/app/curso/form-curso/form-curso.component';
import { MatDialog } from '@angular/material/dialog';
import { Curso } from 'src/app/curso/curso';
import { CursoService } from 'src/app/curso/curso.service';
import alertasSweet from 'sweetalert2';
import { CursoUsuario } from '../curso-usuario/curso-usuario';
import { switchMap, take, map } from 'rxjs/operators';
import { CursoUsuarioService } from '../curso-usuario/curso-usuario.service';
import { UsuarioDto2 } from '../usuario/usuario-dto2';
import { CarritoService } from '../carrito/carrito.service';
import { environment } from 'environments/environment';
import { Observable, Subscription } from 'rxjs';
import { UsuarioService } from '../usuario/usuario.service';

@Component({
  selector: 'app-encabezado',
  templateUrl: './encabezado.component.html',
  styleUrls: ['./encabezado.component.css'],
})
export class EncabezadoComponent {
  public finSesion: boolean;
  public pagina: string = 'login';
  public camposFormulario: FormGroup;
  public curso: Curso;
  public listaCategorias: Categoria[];
  public foto: File;
  public idCategoriaSeleccionada: number;
  public mensaje: string;
  public cursoEnCarrito: Curso[] = [];
  public urlFoto: string = environment.endPointFoto;
  public cursoUsuario: CursoUsuario;
  public nombreUsuario: string;
  public nombreRol: string;
  public usuario: UsuarioDto2;
  private rolSubscription: Subscription;
  sumaTotal: number = 0;
  usuarioDto: UsuarioDto2;
  nombreRolObservable$: Observable<string>;
  rolNombre: any = '';

  constructor(
    public tokenService: TokenService,
    public ventanaModal: MatDialog,
    public categoriaService: CategoriaService,
    public cursoService: CursoService,
    public router: Router,
    private cursoUsuarioService: CursoUsuarioService,
    private carritoService: CarritoService,
    private usuarioService: UsuarioService
  ) {
    this.carritoService.carrito$.subscribe(nuevoCarrito => {
      this.cursoEnCarrito = nuevoCarrito;
      console.log("cursooEnCarrito");
      console.log(this.cursoEnCarrito);
      this.calcularSumaTotal();
    });
    this.tokenService.usuarioActual().subscribe((usuario: UsuarioDto2) => {
      if(usuario!=null){
        this.usuario1 = usuario;
      //this.rolNombre = this.usuario1.roles[0].rolNombre;
      //console.log(this.usuario1.roles[0].rolNombre);
      console.log(this.usuario1);
      }
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
  usuario1: UsuarioDto2;
  ngOnInit() {
    this.obtenerListaCategoria();
  }

  calcularSumaTotal(): void {
    this.sumaTotal = 0;
      this.cursoEnCarrito.forEach(curso => {
        this.sumaTotal = this.sumaTotal+(curso.precio * (1 + curso.porcentajeAdmin));
        console.log(this.sumaTotal);
      });
  }
  
  usuarioActual: UsuarioDto2 | any = new UsuarioDto2();
  obtenerUsuarioActual(){
    this.tokenService.usuarioActual2().subscribe(usuario => {
      this.usuarioActual = usuario;
      console.log("encabezadoUsuarioActual: ");
      console.log(this.usuarioActual);
    });
  }
  
  public seleccionarCategoria(categoria: any): void {
    console.log("nombreCategoria en encabezado");
    console.log(categoria.nombre);
    //this.contenidoService.setIdCategoria(categoria.id);
    //this.router.navigate(['/cuerpo/' + categoria.id]);
    this.cursoService.setNombreCategoria(categoria.nombre.replace(/ /g, "-"));
    this.router.navigate(['/curso/'+categoria.nombre.replace(/ /g, "-")]);
  }

  public cerrarSesion(): void {
    this.tokenService.logOut();
    this.finSesion = true; // cuando se da cerrar sesion finSesion es verdadero
    this.router.navigate(['/inicio']);
  }
  
  public obtenerListaCategoria() {
    this.categoriaService.listarElementos().subscribe((categorias) => {
      this.listaCategorias = categorias;
      //console.log("listaCategoria");
      //console.log(this.listaCategorias);
    });
  }

  // Ventana modal de formulario para llenar la tabla contenido
  public abrirVentanaModalForm(): void {
    // Desactivar la detección de cambios
    //this.changeDetectorRef.detach();
    const referenciaVentanaModal = this.ventanaModal.open(
      FormCursoComponent,
      {
        width: '60%',
        height: 'auto',
        position: { left: '20%', top: '60px' },
      }
    );
    referenciaVentanaModal.afterClosed().subscribe((resultado) => {
      // Reactivar la detección de cambios después de cerrar la ventana modal
      //this.changeDetectorRef.reattach();

      // no hay resultados cuando se cancela la operación (se cierra la ventana modal)
      if (resultado != null) {
        // el resultado es el cliente que se ha llenado en el formulario
        this.curso = resultado;
        console.log("Form curso");
        console.log(this.curso);
        this.usuarioDto = resultado.usuarioDocentes;

        this.agregarCurso();
      }
    });
  }

  agregarCurso(): void {
    this.FormatoFecha();
  
    const cursoUsuario: CursoUsuario = new CursoUsuario();
    cursoUsuario.usuario = this.usuarioDto;

    if (this.cursoService.obtenerFoto == null) {
      this.cursoService.agregarElemento(this.curso)
        .pipe(
          switchMap((resultado) => {
            this.mensaje = resultado.mensaje;
            cursoUsuario.curso = resultado.elemento;
            console.log("cursoUsuario-encabezado");
            console.log(cursoUsuario);
            return this.cursoUsuarioService.agregarElemento(cursoUsuario);
          })
        )
        .subscribe(() => {
          this.setCategoriaEvento();
          //this.router.navigate(['/curso/' + this.contenido.categoria.nombre.replace(/ /g, "-")]);
        }, (error) => {
          console.error('Error al agregar curso:', error);
        });
    } else {
      this.foto = this.cursoService.obtenerFoto;
      console.log("curso antes de agregar");
      console.log(this.curso);
      this.cursoService.agregarCursoConfoto(this.curso, this.foto)
        .subscribe((curso) => {
          this.mensaje = curso.mensaje;
          cursoUsuario.curso = curso.elemento;
          console.log("cursoUsuario-encabezado");
          console.log(cursoUsuario);
          this.cursoUsuarioService.agregarElemento(cursoUsuario)
            .subscribe(() => {
              this.setCategoriaEvento();
              //this.router.navigate(['/curso/' + this.contenido.categoria.nombre.replace(/ /g, "-")]);
            }, (error) => {
              console.error('Error al agregar curso con foto:', error);
            });
        }, (error) => {
          console.error('Error al agregar curso con foto:', error);
        });
    }
  }
    

  setCategoriaEvento(): void {
    this.cursoService.setNombreCategoria(this.curso.categoria.nombre.replace(/ /g, "-"));
    this.router.navigate(['/curso/' + this.curso.categoria.nombre.replace(/ /g, "-")]);
  }

  FormatoFecha() {
    let fechaI = this.curso;
    console.log('Fecha: ' + fechaI);
  }
}
