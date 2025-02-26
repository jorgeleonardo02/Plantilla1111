import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { CategoriaService } from 'src/app/categoria/categoria.service';
import { TokenService } from 'src/app/seguridad/service/token.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Categoria } from 'src/app/categoria/categoria';
import { FormContenidoComponent } from 'src/app/contenido/form-contenido/form-contenido.component';
import { MatDialog } from '@angular/material/dialog';
import { Contenido } from 'src/app/contenido/contenido';
import { ContenidoService } from 'src/app/contenido/contenido.service';
import alertasSweet from 'sweetalert2';
import { ContenidoUsuario } from '../contenido-usuario/contenido-usuario';
import { switchMap, take, map } from 'rxjs/operators';
import { ContenidoUsuarioService } from '../contenido-usuario/contenido-usuario.service';
import { UsuarioDto } from '../usuario/usuario-dto';
import { UsuarioDto2 } from '../usuario/usuario-dto2';
import { CarritoService } from '../carrito/carrito.service';
import { environment } from 'environments/environment';
import { Observable, Subscription } from 'rxjs';
//import { CarritoCompartidoService } from '../carrito/carritocompartido.service';
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
  public contenido: Contenido;
  public listaCategorias: Categoria[];
  public foto: File;
  public idCategoriaSeleccionada: number;
  public mensaje: string;
  contenidoEnCarrito: Contenido[] = [];
  public urlFoto: string = environment.endPointFoto;
  public contenidoUsuario: ContenidoUsuario;
  nombreUsuario: string;
  nombreRol: string;
  usuario: UsuarioDto2;
  private rolSubscription: Subscription;
  sumaTotal: number = 0;
  usuarioDto: UsuarioDto2;
  nombreRolObservable$: Observable<string>;
  rolNombre: any = '';

  constructor(
    public tokenService: TokenService,
    public ventanaModal: MatDialog,
    public categoriaService: CategoriaService,
    public contenidoService: ContenidoService,
    public router: Router,
    private contenidoUsuarioService: ContenidoUsuarioService,
    private carritoService: CarritoService,
    private usuarioService: UsuarioService
  ) {
    this.carritoService.carrito$.subscribe(nuevoCarrito => {
      this.contenidoEnCarrito = nuevoCarrito;
      console.log("contenidoEnCarrito");
      console.log(this.contenidoEnCarrito);
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
    //------------------------------------------------------
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
          carrito.forEach((elemento, i) =>{this.contenidoService.existsContenido(nombreCategoria, usuario.id ,elemento.id).subscribe(existe=>{
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
    //------------------------------------------------------
  } 
  listaContenidos: Contenido[];
  contenidoPorCategoria(nombreCategoria: string, nombreUsuario: string, mostrarTodos:boolean, activado:boolean){
    this.contenidoService.contenidosCompleto(nombreCategoria, nombreUsuario, mostrarTodos, activado).subscribe((paginacion) => {
      this.listaContenidos = paginacion.content as Contenido[];
      });
  }
  eliminarDelCarrito(contenido: Contenido): void {
    this.carritoService.eliminarElementoDelCarrito(contenido.id);
  }
  usuario1: UsuarioDto2;
  ngOnInit() {
    this.obtenerListaCategoria();
  }

  calcularSumaTotal(): void {
    this.sumaTotal = 0;
      this.contenidoEnCarrito.forEach(contenido => {
        this.sumaTotal = this.sumaTotal+(contenido.precio * (1 + contenido.porcentajeAdmin));
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
    this.contenidoService.setNombreCategoria(categoria.nombre.replace(/ /g, "-"));
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
      FormContenidoComponent,
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
        this.contenido = resultado;
        console.log("Form contenido");
        console.log(this.contenido);
        this.usuarioDto = resultado.usuarioDocentes;

        this.agregarContenido();
      }
    });
  }

  agregarContenido(): void {
    this.FormatoFecha();
  
    const contenidoUsuario: ContenidoUsuario = new ContenidoUsuario();
    contenidoUsuario.usuario = this.usuarioDto;
  
    if (this.contenidoService.obtenerFoto == null) {
      this.contenidoService.agregarElemento(this.contenido)
        .pipe(
          switchMap((resultado) => {
            this.mensaje = resultado.mensaje;
            contenidoUsuario.contenido = resultado.elemento;
            console.log("contenidoUsuario-encabezado");
            console.log(contenidoUsuario);
            return this.contenidoUsuarioService.agregarElemento(contenidoUsuario);
          })
        )
        .subscribe(() => {
          this.setCategoriaEvento();
          //this.router.navigate(['/curso/' + this.contenido.categoria.nombre.replace(/ /g, "-")]);
        }, (error) => {
          console.error('Error al agregar contenido:', error);
        });
    } else {
      this.foto = this.contenidoService.obtenerFoto;
      console.log("contenido antes de agregar");
      console.log(this.contenido);
      this.contenidoService.agregarContenidoConfoto(this.contenido, this.foto)
        .subscribe((contenido) => {
          this.mensaje = contenido.mensaje;
          contenidoUsuario.contenido = contenido.elemento;
          console.log("contenidoUsuario-encabezado");
            console.log(contenidoUsuario);
          this.contenidoUsuarioService.agregarElemento(contenidoUsuario)
            .subscribe(() => {
              this.setCategoriaEvento();
              //this.router.navigate(['/curso/' + this.contenido.categoria.nombre.replace(/ /g, "-")]);
            }, (error) => {
              console.error('Error al agregar contenido con foto:', error);
            });
        }, (error) => {
          console.error('Error al agregar contenido con foto:', error);
        });
    }
  }
  
  // agregarContenido(): void {
  //  this.FormatoFecha();
    
    //const contenidoUsuario: ContenidoUsuario = new ContenidoUsuario();
    //contenidoUsuario.usuario = this.usuarioDto;
  
    //if (this.contenidoService.obtenerFoto == null) {
      //this.contenidoService.agregarElemento(this.contenido)
        //.pipe(
          //switchMap((resultado) => {
            //this.mensaje = resultado.mensaje;
            //contenidoUsuario.contenido = resultado.elemento;
            //console.log("contenidoUsuario-encabezado");
            //console.log(contenidoUsuario);
            //return this.contenidoUsuarioService.agregarElemento(contenidoUsuario);
          //})
        //)
        //.subscribe(() => {
          //this.setCategoriaEvento();
          //this.router.navigate(['/curso/' + this.contenido.categoria.nombre.replace(/ /g, "-")]);
        //}, (error) => {
          //console.error('Error al agregar contenido:', error);
        //});
    //} else {
      //this.foto = this.contenidoService.obtenerFoto;
      //console.log("contenido antes de agregar");
      //console.log(this.contenido);
      //this.contenidoService.agregarContenidoConfoto(this.contenido, this.foto)
        //.subscribe((contenido) => {
          //this.mensaje = contenido.mensaje;
          //contenidoUsuario.contenido = contenido.elemento;
          //console.log("contenidoUsuario-encabezado");
          //console.log(contenidoUsuario);
          //this.contenidoUsuarioService.agregarElemento(contenidoUsuario)
            //.subscribe(() => {
              //this.setCategoriaEvento();
              //this.router.navigate(['/curso/' + this.contenido.categoria.nombre.replace(/ /g, "-")]);
            //}, (error) => {
              //console.error('Error al agregar contenido con foto:', error);
            //});
        //}, (error) => {
          //console.error('Error al agregar contenido con foto:', error);
        //});
    //}
  
    // Antes de agregar el contenido al carrito, eliminar los elementos del carrito que ya no están en los nuevos contenidos
    //this.carritoService.carrito$.pipe(
      //take(1) // Tomar solo el primer valor del observable
    //).subscribe(carrito => {
      //const nuevosContenidos: Contenido[] = []; // Array para almacenar los nuevos contenidos
      //const contenidoEnCarritoActualizado: Contenido[] = []; // Array para almacenar el carrito actualizado
  
      // Obtener los nuevos contenidos del servidor (por ejemplo, desde una variable en tu componente)
      // Si los nuevos contenidos no están disponibles directamente en el componente, necesitarás algún mecanismo para obtenerlos aquí.
  
      // Recorrer los nuevos contenidos para obtener sus IDs
      //nuevosContenidos.forEach(contenido => {
        // Agregar el ID del contenido al array de nuevos IDs
        // Supongamos que el ID del contenido se encuentra en una propiedad llamada 'id'
        // Reemplaza 'id' por la propiedad real que contiene el ID del contenido
        // Si es necesario, puedes ajustar esta lógica según la estructura real de tus objetos de contenido
        //const idContenido = contenido.id;
        //if (!carrito.some(item => item.id === idContenido)) {
          // Si el contenido no está presente en el carrito actual, agregarlo al array de contenidos a mantener
          //contenidoEnCarritoActualizado.push(contenido);
        //}
      //});
  
      // Actualizar el carrito con los nuevos contenidos (sin los elementos que no están en los nuevos contenidos)
      //this.carritoService.actualizarCarrito(contenidoEnCarritoActualizado);
  
      // Continuar con la lógica de agregar el contenido al carrito
      // ...
    //});
  //}
 //
  setCategoriaEvento(): void {
    this.contenidoService.setNombreCategoria(this.contenido.categoria.nombre.replace(/ /g, "-"));
    this.router.navigate(['/curso/' + this.contenido.categoria.nombre.replace(/ /g, "-")]);
  }

  FormatoFecha() {
    let fechaI = this.contenido;
    console.log('Fecha: ' + fechaI);
  }
}
