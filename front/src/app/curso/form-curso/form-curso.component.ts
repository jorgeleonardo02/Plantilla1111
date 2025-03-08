import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Categoria } from 'src/app/categoria/categoria';
import { CategoriaService } from 'src/app/categoria/categoria.service';
import { Curso} from '../curso';
import { CursoService } from '../curso.service';
import { Route, Router } from '@angular/router';
import { UsuarioService } from '../../usuario/usuario.service';
import { UsuarioDto } from 'src/app/usuario/usuario-dto';
import { TokenService } from '../../seguridad/service/token.service';
import { UsuarioDto2 } from 'src/app/usuario/usuario-dto2';
import { CursoUsuarioService } from '../../curso-usuario/curso-usuario.service';
import { ElementRef, ViewChild } from '@angular/core';


@Component({
  selector: 'app-form-curso',
  templateUrl: './form-curso.component.html',
  styleUrls: ['./form-curso.component.css'],
  //changeDetection: ChangeDetectionStrategy.OnPush  // Añadido para desactivar la detección de cambios automática
})
export class FormCursoComponent implements OnInit {

  @ViewChild('archivoFotoInput') archivoFotoInput: ElementRef<HTMLInputElement>;

  camposFormulario: FormGroup;
  listaCategoria: Categoria[];
  listaCursos: Curso[];
  fotoSeleccionada: File;

  constructor(private referenciaVentanaModal: MatDialogRef<FormCursoComponent>,
              private categoriaSevice: CategoriaService,
              private cursoService: CursoService,
              private usuarioService: UsuarioService,
              private router: Router,
              public tokenService: TokenService,
              private cursoUsuarioService: CursoUsuarioService,
              private constructorFormulario: FormBuilder) { }

  ngOnInit(): void {
    this.cursoService.setFoto(null);
    this.crearFormulario();
    this.listarCategorias();
    this.listarUsuarioDocentes();
    this.usuarioActual();
    this.textoSlideToggle = this.camposFormulario.get('activado')?.value ? "Ocultar" : "Mostrar";
  }

  textoSlideToggle: string = "Mostrar";
  cambiarTextoSlideToggle() {
    const activado = this.camposFormulario.get('activado')?.value;
    this.textoSlideToggle = activado ? "Ocultar" : "Mostrar";
  }

  crearFormulario(): void {
    this.camposFormulario = this.constructorFormulario.group({
        nombre: ['', Validators.required],
        descripcion: ['', Validators.required],
        etiquetas: ['', Validators.required],
        fechaLimite: [''],
        listaHabilidades: this.constructorFormulario.array([]), // Ahora será una lista de objetos con nombre
        categoria: ['', Validators.required],
        precio: ['', Validators.required],
        usuarioDocentes: [/* this.usuarioDocenteActual */, Validators.required],
        activado: [false] // Establecer el valor por defecto en false
    });

    this.agregarHabilidad(); // Agrega una habilidad por defecto
}

// Método para obtener el FormArray de habilidades
get listaHabilidades(): FormArray {
    return this.camposFormulario.get('listaHabilidades') as FormArray;
}

// Método para crear una nueva habilidad con estructura de objeto
crearHabilidad(): FormGroup {
    return this.constructorFormulario.group({
        nombre: ['', Validators.required]  // En lugar de un string, ahora tiene un objeto con 'nombre'
    });
}

// Método para agregar una nueva habilidad
agregarHabilidad() {
    this.listaHabilidades.push(this.crearHabilidad());
}

// Método para eliminar una habilidad por índice
eliminarHabilidad(index: number) {
    this.listaHabilidades.removeAt(index);
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
  this.cursoService.setFoto(this.fotoSeleccionada);
}
  
  cancelarOperacion(): void {
    this.referenciaVentanaModal.close();
  }

  cantidad: number;

  async enviarFormulario() {  
    if (this.camposFormulario.invalid) {
      this.camposFormulario.markAllAsTouched();
      return;
    }
  
    try {
      const usuario = this.camposFormulario.value.usuarioDocentes;
  
      if (!usuario || !usuario.id || !usuario.limiteCursos) {
        console.error("Error: Datos del usuarioDocente no válidos");
        return this.referenciaVentanaModal.close();
      }
  
      console.log("Usuario ID:", usuario.id);
      console.log("Límite de Cursos:", usuario.limiteCursos);
  
      await this.limiteCursosPorDocente(usuario.id); // Espera la cantidad de cursos existentes
  
      console.log("Cantidad de cursos creados:", this.cantidad);

      console.log("Antes de transformar listaHabilidades:", this.camposFormulario.value.listaHabilidades[0]);
      
      const listaHabilidades = Array.isArray(this.camposFormulario.value.listaHabilidades)
        ? this.camposFormulario.value.listaHabilidades
            .filter((h: any) => h && h.nombre) // Filtra objetos sin `nombre`
            .map((h: any) => h.nombre.trim())  // Extrae nombres sin agregar comillas extra
        : [];
  
      console.log("Lista de habilidades:");
      console.log(JSON.stringify(listaHabilidades));
  
   // Crear objeto con los datos del curso
   const datosCurso = {
    ...this.camposFormulario.value,
    listaHabilidades
  };
  console.log("datosCurso");
  console.log(JSON.stringify(datosCurso));
      if (this.cantidad < usuario.limiteCursos) {
        this.referenciaVentanaModal.close(datosCurso); // Se envía el objeto transformado
  
        if (this.camposFormulario.value.categoria?.nombre) {
          this.router.navigateByUrl(`/curso/${this.camposFormulario.value.categoria.nombre}`);
        } else {
          console.warn("Advertencia: No se pudo redirigir porque 'categoria.nombre' no está definido.");
        }
      } else {
        console.warn("El docente ha alcanzado el límite de cursos permitidos.");
        this.referenciaVentanaModal.close();
      }
    } catch (error) {
      console.error("Error al obtener la cantidad:", error);
      this.referenciaVentanaModal.close();
    }
  }
  

async limiteCursosPorDocente(idUsuarioSeleccionado: number) {//funcion asincrona
  this.cantidad = await this.cursoUsuarioService.cantidadCursosDeDocente(idUsuarioSeleccionado).toPromise();
}
  
}
