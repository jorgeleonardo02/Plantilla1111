import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import { Curso } from '../curso';
import { CursoService } from '../curso.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { url } from 'environments/url';
import { environment } from 'environments/environment';
import { TokenService } from '../../seguridad/service/token.service';
//import Swiper from 'swiper';
//import 'swiper/swiper-bundle.css';
/* import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]); */
//import { SwiperComponent, SwiperDirective } from 'ngx-swiper-wrapper';
import SwiperCore, { Navigation, Pagination } from 'swiper';
import { CarritoService } from '../../carrito/carrito.service';
import { CursoUsuarioService } from '../../curso-usuario/curso-usuario.service';
import { MatDialog } from '@angular/material/dialog';
import { ContenidoComponent } from '../contenido/contenido.component';
import { Contenido2Component } from '../contenido2/contenido2.component';

// Instala los módulos necesarios
SwiperCore.use([Navigation, Pagination]);
@Component({
  selector: 'app-cuerpo',
  templateUrl: './cuerpo.component.html',
  styleUrls: ['./cuerpo.component.css'],
})
export class CuerpoComponent implements OnInit {

  public listaCursos: Curso[];
  public listaCursos1: Curso[];
  public cursoEnCarrito: Curso[] = [];
  public urlFoto: string = environment.endPointFoto;
  public nombreCategoria: string;
  public nombreUsuario: string;
  public filtro: string = 'todos'; // Valor inicial

  // Variables con valores iniciales para el paginador
  totalRegistros = 0;
  paginaActual = 0;
  totalPorPaginas = 25;
  pageSizeOptions: number[] = [3, 5, 10, 25, 100, 200, 300];
  
  // ...

// En tu componente
swiperConfig = {
   slidesPerView: 5,
   spaceBetween: 10,
   navigation: true, // Agrega navegación (botones previo/siguiente)
   //pagination: { clickable: true } // Agrega paginación (puntos indicadores)
};

@ViewChild(MatPaginator, {static: true}) paginador: MatPaginator;

  // pasarela
  scrollbar: any = false;
  
  breakpoints = {
    /* 565.2: { spaceBetween: 10 },
    700.2: { spaceBetween: 10 },
    900.2: { spaceBetween: 10 } ,  // Ajusta el espacio entre elementos */
    1200.2: { spaceBetween: 10 }   // Ajusta slidesPerView para que quepan 5 elementos
  };
  calculateSpaceBetween(): number | any {
    if(this.listaCursos != null){
      const totalElements = this.listaCursos.length;
   
    console.log("totalElements", totalElements);
    const totalSpace = 10; // Puedes ajustar esto según sea necesario
    const defaultSpaceBetween = 10; // Puedes ajustar esto según sea necesario
    const maxElements = 5;
  
    if (totalElements >= maxElements) {
      return defaultSpaceBetween;
    }
  
    const calculatedSpace = totalSpace / maxElements;
    return calculatedSpace;
  }
  }
  //slides = Array.from({ length: 5 }).map((el, index) => `Slide ${index + 1}`);
  
  //@ViewChild(SwiperComponent, { static: false }) swiper: SwiperComponent | undefined;
  //@ViewChild(SwiperDirective, { static: false }) swiperDirective: SwiperDirective | undefined;


  //*************************************************************************************
 
  constructor(private cursoService: CursoService,
              public tokenService: TokenService,
              private router: Router,
              private dialog: MatDialog,
              private cursoUsuarioService: CursoUsuarioService,
              private carritoService: CarritoService,
              private route: ActivatedRoute) {
              
  }

  
  ngOnInit(): void {
    console.log("urlFoto", this.urlFoto);
    this.obtenerListaCursos();
    this.usuario();
    this.calculateSpaceBetween();
    //this.contenidoPorUsuario(1);
    this.cursoService.getNombreCategoria().subscribe( nombreCategoria => {
      console.log("nombreCategoria en cuerpo");
      console.log(nombreCategoria);
      this.filtro = 'todos';
      if(nombreCategoria) {
        this.listarPaginado(nombreCategoria);// .replace("-"," "));
      } else {
        //console.log("leo");
        const nombreCateg = this.route.snapshot.paramMap.get('nombreCategoria');//obtener el valor del parámetro 'nombreCategoria' de la URL actual
        if(nombreCateg !== null){
          //console.log("1: "+nombreCateg);
          this.listarPaginado(nombreCateg);// .replace("-"," "));
        }
      }
    });
    
  }
  
  // Realiza el control de la paginacion, y las pagina.
  // Cada vez que se seleccione un boton del paginador se actualizan los valores
  // PageEvent--> El evento de tipo PageEvent
  paginar(evento: PageEvent): void {
    this.paginaActual = evento.pageIndex;
    this.totalPorPaginas = evento.pageSize; // Lo que enviamos al backend
    this.totalRegistros = evento.length;
    const nombreCategoria = this.route.snapshot.paramMap.get('nombreCategoria');
    if( nombreCategoria !== null ){
      this.listarPaginado(nombreCategoria);// .replace("-"," "));
    }
  }

  public listarPaginado(nombreCategoria: any): void {
    const mostrarTodos = this.filtro === 'todos';
    const activado = this.filtro === 'activados';
    console.log("nombreUsuario", this.nombreUsuario);
    
    if(!this.tokenService.logueado()){
      this.cursoService.cursoCompleto(nombreCategoria, this.nombreUsuario, mostrarTodos, activado,
        this.paginaActual, this.totalPorPaginas).subscribe((paginacion) => {
          this.listaCursos = paginacion.content as Curso[];
          //console.log("this.listaContenidos_leo");
          //console.log(this.listaCursos);
          this.totalRegistros = paginacion.totalElements as number;
          this.paginador._intl.itemsPerPageLabel = 'Registros por página:';
        });
    }else{
      if (this.nombreUsuario !== undefined) {
        //console.log("El usuario logueado es: " + this.nombreUsuario);
        //console.log("logeado:"+this.tokenService.logueado());
        this.cursoService.cursoCompleto(nombreCategoria, this.nombreUsuario, mostrarTodos, activado,
          this.paginaActual, this.totalPorPaginas).subscribe((paginacion) => {
            console.log("paginacion");
            console.log(paginacion);
            this.listaCursos = paginacion.content as Curso[];
            console.log("this.listaCursos_leo");
            console.log(this.listaCursos);
            this.totalRegistros = paginacion.totalElements as number;
            this.paginador._intl.itemsPerPageLabel = 'Registros por página:';
          });
      } 
    }    
  }
  
  obtenerListaCursos() {
    this.cursoService.listarElementos().subscribe((cursos) => {
      this.listaCursos1 = cursos;
      console.log("Lista de cursos")
      console.log(this.listaCursos1);
    });
  }
  
  
  usuario() {
    this.tokenService.usuarioActual2().subscribe((rta) => {
      if (rta) {
        console.log('Leo2222-UsuarioActual');
        console.log(rta);
        this.nombreUsuario = rta.nombreUsuario;
        // Luego de obtener el nombre del usuario, puedes llamar a otras funciones que dependen de él
        const nombreCategoria = this.route.snapshot.paramMap.get('nombreCategoria');
      //console.log("cuerpo1");
      //console.log(this.route.snapshot.paramMap);
      if( nombreCategoria !== null ){
        this.listarPaginado(nombreCategoria);// .replace("-"," "));
      }
       
      }
    });
  }
  
  public filtrarCursos() {
    const nombreCategoria = this.route.snapshot.paramMap.get('nombreCategoria');
      //console.log("cuerpo1");
      //console.log(this.route.snapshot.paramMap);
      if( nombreCategoria !== null ){
        this.listarPaginado(nombreCategoria);// .replace("-"," "));
      }
  }

  agregarAlCarrito(curso: Curso): void {
    console.log("AgregarCarrito contenido");
    console.log(curso);
    this.carritoService.agregarAlCarrito(curso);
    console.log('CuerpoComponent inicializado');
  }

  abrirModalCrearSeccion2(curso: any): void {
    const dialogRef = this.dialog.open(Contenido2Component, {
      width: '900px',
      height: '600px',
      data: { curso },
      autoFocus: false, // ⬅️ previene problemas de foco en campos ocultos
      restoreFocus: false, // ⬅️ previene problemas al cerrar el diálogo
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Contenido guardado:', result);
      }
    });
  }
  abrirModalCrearSeccion(curso: any): void {
    const dialogRef = this.dialog.open(ContenidoComponent, {
      width: '1200px',
      height: '600px',
      data: { curso }
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Contenido guardado:', result);
      }
    });
  }
}






/* 
//1****************************
//import SwiperCore, {Navigation, Pagination, Scrollbar, A11y, SwiperOptions, Swiper} from 'swiper';
//SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

//2****************************************************
//import { SwiperComponent } from "swiper/angular";
//import SwiperCore, { Swiper, Virtual } from 'swiper';
//SwiperCore.use([Virtual]);

//3
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);
@Component({
  selector: 'app-cuerpo',
  templateUrl: './cuerpo.component.html',
  styleUrls: ['./cuerpo.component.css'],
})
export class CuerpoComponent implements OnInit {
  public listaContenidos: Contenido[];
  public listaContenidos1: Contenido[];
  public urlFoto: string = environment.endPointFoto;
  public nombreCategoria: string;
  public nombreUsuario: string;
  public filtro: string = 'todos'; // Valor inicial

  totalRegistros = 0;
  paginaActual = 0;
  totalPorPaginas = 25;
  pageSizeOptions: number[] = [3, 5, 10, 25, 100, 200, 300];
  @ViewChild(MatPaginator, { static: true }) paginador: MatPaginator;

  // 2 *******************************************
  //config: SwiperOptions = {
    
    //navigation: {
      //nextEl: '.swiper-button-next',
      //prevEl: '.swiper-button-prev',
    //}
    //};
    
  //3
   // @ViewChild('swiper', { static: false }) swiper?: SwiperComponent;
  //slideNext(){
   // this.swiper?.swiperRef.slideNext(100);
  //}
  //slidePrev(){
    //this.swiper?.swiperRef.slidePrev(100);
  //}
  
  //********************************************************************
  //scrollbar: any = false;
  //breakpoints = {
    //320: { slidesPerView: 1.6, spaceBetween: 20 },
    //640: { slidesPerView: 2.6, spaceBetween: 20 },
    //768: { slidesPerView: 3.6, spaceBetween: 40 },
    //1024: { slidesPerView: 6.6, spaceBetween: 40 }
  //};
  //slides = Array.from({ length: 5 }).map((el, index) => `Slide ${index + 1}`);
  //virtualSlides = Array.from({ length: 600 }).map((el, index) => `Slide ${index + 1}`);
  //indexNumber = 1;
  //slidesPerView: number = 4;
  //pagination: any = false;
  //slides2 = ['slide1', 'slide2', 'slide3'];

  //replaceSlides() {
    //this.slides2 = ['foo', 'bar'];
  //}

  //breakPointsToggleValue: boolean;
  //breakPointsToggle() {
    //this.breakPointsToggleValue = !this.breakPointsToggleValue;
    //this.breakpoints = {
      //320: { slidesPerView: 1.6, spaceBetween: 20 },
      //640: { slidesPerView: 2.6, spaceBetween: 20 },
      //768: { slidesPerView: 3.6, spaceBetween: 40 },
      //1024: { slidesPerView: 6.6, spaceBetween: 40 }
    //};
  //}

  scrollbar: any = false;
  breakpoints = {
    320: { slidesPerView: 1.6, spaceBetween: 20 },
    640: { slidesPerView: 2.6, spaceBetween: 20 },
    768: { slidesPerView: 3.6, spaceBetween: 40 },
    1024: { slidesPerView: 6.6, spaceBetween: 40 }
  };
  slides = Array.from({ length: 1 }).map((el, index) => `Slide ${index + 1}`);
  virtualSlides = Array.from({ length: 200 }).map((el, index) => `Slide ${index + 1}`);
  indexNumber = 1;
  slidesPerView: number = 4;
  pagination: any = false;
  slides2 = ['slide1', 'slide2', 'slide3'];

  replaceSlides() {
    this.slides2 = ['foo', 'bar'];
  }

  breakPointsToggleValue: boolean;
  breakPointsToggle() {
    this.breakPointsToggleValue = !this.breakPointsToggleValue;
    this.breakpoints = {
      320: { slidesPerView: 1.6, spaceBetween: 20 },
      640: { slidesPerView: 2.6, spaceBetween: 20 },
      768: { slidesPerView: 3.6, spaceBetween: 40 },
      1024: { slidesPerView: 6.6, spaceBetween: 40 }
    };
  }

  constructor(
    private contenidoService: ContenidoService,
    public tokenService: TokenService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('urlFoto', this.urlFoto);
    this.obtenerListaContenidos();
    this.usuario();

    this.contenidoService.getNombreCategoria().subscribe((nombreCategoria) => {
      if (nombreCategoria) {
        this.nombreCategoria = nombreCategoria;
        this.filtro = 'todos';
        this.listarPaginado();
      } else {
        const nombreCateg = this.route.snapshot.paramMap.get('nombreCategoria');
        if (nombreCateg) {
          this.filtro = 'todos';
          this.nombreCategoria = nombreCateg;
          this.listarPaginado();
        }
      }
    });
  }

  paginar(evento: PageEvent): void {
    this.paginaActual = evento.pageIndex;
    this.totalPorPaginas = evento.pageSize;
    this.totalRegistros = evento.length;
    this.listarPaginado();
  }

  filtrarContenidos() {
    this.listarPaginado();
  }
  
  listarPaginado() {
    const mostrarTodos = this.filtro === 'todos';
    const activado = this.filtro === 'activados';
    console.log("nombreUsuario", this.nombreUsuario);
    const nombreUsuario = this.nombreUsuario;
    const nombreCategoria = this.nombreCategoria;
    this.contenidoService.contenidosCompleto(nombreCategoria, nombreUsuario, mostrarTodos, activado, 
      this.paginaActual, this.totalPorPaginas).subscribe((paginacion) => {
        this.listaContenidos = paginacion.content as Contenido[];
        this.totalRegistros = paginacion.totalElements as number;
        this.paginador._intl.itemsPerPageLabel = 'Registros por página:';
      });
  }
  obtenerListaContenidos() {
    this.contenidoService.listarElementos().subscribe((contenidos) => {
      this.listaContenidos1 = contenidos;
      console.log(this.listaContenidos1);
    });
  }

  usuario() {
    this.tokenService.usuarioActual2().subscribe((rta) => {
      if (rta) {
        console.log('Leo2222');
        console.log(rta);
        this.nombreUsuario = rta.nombreUsuario;
        // Luego de obtener el nombre del usuario, puedes llamar a otras funciones que dependen de él
        this.listarPaginado();
      }
    });
  }
  agregarACarrito() {
    // Agrega aquí la lógica para añadir el curso a la cesta
    // Esto podría ser una llamada a un servicio o función que gestione la cesta de compras.
  }
} */