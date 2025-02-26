import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Categoria } from 'src/app/categoria/categoria';
import { CategoriaService } from 'src/app/categoria/categoria.service';
import { Contenido } from '../contenido';
import { ContenidoService } from '../contenido.service';
import { Route, Router } from '@angular/router';
//import { MediaService } from '../../Archivo/media.service';
import { UsuarioService } from '../../usuario/usuario.service';
import { UsuarioDto } from 'src/app/usuario/usuario-dto';
import { TokenService } from '../../seguridad/service/token.service';
import { UsuarioDto2 } from 'src/app/usuario/usuario-dto2';
import { ContenidoUsuarioService } from '../../contenido-usuario/contenido-usuario.service';
import { ElementRef, ViewChild } from '@angular/core';


@Component({
  selector: 'app-form-contenido',
  templateUrl: './form-contenido.component.html',
  styleUrls: ['./form-contenido.component.css'],
  //changeDetection: ChangeDetectionStrategy.OnPush  // Añadido para desactivar la detección de cambios automática
})
export class FormContenidoComponent implements OnInit {

  @ViewChild('archivoFotoInput') archivoFotoInput: ElementRef<HTMLInputElement>;

  camposFormulario: FormGroup;
  listaCategoria: Categoria[];
  listaContenidos: Contenido[];
  fotoSeleccionada: File;

  constructor(private referenciaVentanaModal: MatDialogRef<FormContenidoComponent>,
              private categoriaSevice: CategoriaService,
              private contenidoService: ContenidoService,
              private usuarioService: UsuarioService,
              private router: Router,
              public tokenService: TokenService,
              private contenidoUsuarioService: ContenidoUsuarioService,
              private constructorFormulario: FormBuilder) { }

  ngOnInit(): void {
    this.contenidoService.setFoto(null);
    this.crearFormulario();
    this.listarCategorias();
    this.listarUsuarioDocentes();
    this.usuarioActual();
  }

  crearFormulario(): void {
    this.camposFormulario = this.constructorFormulario.group(
      {
        nombre: ['', Validators.required],
        descripcion: ['', Validators.required],
        etiquetas: ['', Validators.required],
        fechaLimite:[''],
        programa: [''],
        categoria: ['', Validators.required],
        precio: ['', Validators.required],
        usuarioDocentes: [/* this.usuarioDocenteActual */, Validators.required],
        activado: [false] // Establecer el valor por defecto en false
     });
  }

  listarCategorias():any{
    this.categoriaSevice.listarElementos().subscribe(categorias => {
      this.listaCategoria = categorias;
    });
  }

  usuarioDocenteActual: UsuarioDto2;
  usuarioActual(){
    this.tokenService.usuarioActual().subscribe((usuario: UsuarioDto2) =>{
      console.log("usuarioActual");
      console.log(usuario);
      this.usuarioDocenteActual = usuario;
    });
  }

  public listaUsuarioDocentes: UsuarioDto[];
  listarUsuarioDocentes(){
    this.usuarioService.listarUsuariosDocentes().subscribe(docentes => {
      this.listaUsuarioDocentes = docentes;
      console.log("docentes: ");
      console.log(docentes);
    });
  }
  /* ObtenerListaContenidos(){
    this.contenidoService.listarElementos().subscribe(contenidos =>{
      this.listaContenidos = contenidos;
    });
  } */

  /* seleccionarFoto(evento: any): void {
    this.fotoSeleccionada = evento.target.files[0];
    console.log("fotoSeleccionada");
    console.log(evento);
    this.contenidoService.setFoto(this.fotoSeleccionada);// asigno la foto en el service para compartirla entre componentes
  } */
  /* abrirSelectorDeArchivo(): void {
  // Simula el clic en el input de tipo "file"
  const inputArchivo = document.getElementById('archivoFoto') as HTMLInputElement;
  inputArchivo.click();
} */
abrirSelectorDeArchivo(): void {
  // Obtiene el elemento por su ID
  const inputArchivo = document.getElementById('archivoFoto');
  
  // Verifica si el elemento existe antes de intentar hacer clic en él
  if (inputArchivo instanceof HTMLInputElement) {
    inputArchivo.click();
  } else {
    console.error('Elemento "archivoFoto" no encontrado o no es un input de tipo file.');
  }
}


seleccionarFoto(evento: any): void {
  this.fotoSeleccionada = evento.target.files[0];
  console.log("fotoSeleccionada");
  console.log(evento);
  this.contenidoService.setFoto(this.fotoSeleccionada);
}
  
  cancelarOperacion(): void {
    this.referenciaVentanaModal.close();
  }

  cantidad: number;

async enviarFormulario() { //contendrá operaciones asincrónicas
  if (this.camposFormulario.invalid) {
    return this.camposFormulario.markAllAsTouched();
  }

  try {
    // await: esperará a que esta función asíncrona se complete 
    // antes de continuar con el siguiente paso.
    console.log("this.camposFormulario.value.usuarioDocentes.limiteContenidos: "/* +this.camposFormulario.value */);
    console.log(this.camposFormulario.value);
    console.log("this.camposFormulario.value.usuarioDocentes.id: "+this.camposFormulario.value.usuarioDocentes.id);
    await this.limiteContenidosPorDocente(this.camposFormulario.value.usuarioDocentes.id);
    console.log("this.cantidad");
    console.log(this.cantidad);
    //console.log("cantidad De Contenidos ya creados: " + this.cantidad);
    console.log("Formularioleo: ");
    console.log(this.camposFormulario.value);
    //console.log("usuarioSeleccionado.limite: ");
    //console.log(this.camposFormulario.value.usuarioDocentes.limiteContenidos);
    if (this.cantidad < this.camposFormulario.value.usuarioDocentes.limiteContenidos) {
      this.referenciaVentanaModal.close(this.camposFormulario.value);
      this.router.navigateByUrl('/curso/'+this.camposFormulario.value.categoria.nombre);
    } else {
      console.log("ya llego al límite de contenidos por docentes");
      this.referenciaVentanaModal.close();
    }
  } catch (error) {// Si ocurre algún error durante la ejecución  
    console.error("Error al obtener la cantidad:", error); // muestra el error
    this.referenciaVentanaModal.close();
  }
}

async limiteContenidosPorDocente(idUsuarioSeleccionado: number) {//funcion asincrona
  this.cantidad = await this.contenidoUsuarioService.cantidadContenidosDeDocente(idUsuarioSeleccionado).toPromise();
}
  
}
