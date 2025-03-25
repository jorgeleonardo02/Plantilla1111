import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon'; // 👈 Agregamos esto
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { QuillModule } from 'ngx-quill';


@Component({
  selector: 'app-contenido',
  templateUrl: './contenido.component.html',
  styleUrls: ['./contenido.component.css'],
  standalone: true,
  imports: [
    CommonModule,  
    MatDialogModule,
    ReactiveFormsModule,
    MatIconModule,
    QuillModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule, 
    MatPaginatorModule
  ]
})
export class ContenidoComponent implements OnInit {
  formSeccion!: FormGroup;
  modulesQuill = { toolbar: [['bold', 'italic', 'underline'], ['link', 'image']] };

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ContenidoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.formSeccion = this.fb.group({
      nombreCurso: [this.data.curso.nombre, Validators.required],
      secciones: this.fb.array([])
    });
    this.agregarSeccion(); // Agregamos la primera sección por defecto
  }

  onSubmit(): void {
    if (this.formSeccion.valid) {
      console.log('Formulario enviado:', this.formSeccion.value);
      this.dialogRef.close(this.formSeccion.value);
    } else {
      console.log('Formulario inválido. Revisa los campos.');
    }
  }

  get secciones(): FormArray {
    return this.formSeccion.get('secciones') as FormArray;
  }

  agregarSeccion(): void {
    const form = this.fb.group({
      numeroSeccion: ['', Validators.required],
      nombreSeccion: ['', Validators.required],
      subSecciones: this.fb.array([])
    });
    this.secciones.push(form);
    this.agregarSubSeccion(this.secciones.length - 1); // Agregamos una subsección in
  }

  // Acceder al array de subsecciones dentro de una sección específica
  getSubSecciones(index: number): FormArray {
    return this.secciones.at(index).get('subSecciones') as FormArray;
  }


  agregarSubSeccion(seccionIndex: number): void {
    const subForm = this.fb.group({
      numeroSubSeccion: ['', Validators.required],
      nombreSubSeccion: ['', Validators.required],
      contenidoTexto: ['', Validators.required]
    });
    this.getSubSecciones(seccionIndex).push(subForm);
  }

  

  // Eliminar una sección
  eliminarSeccion(index: number): void {
    this.secciones.removeAt(index);
  }

  // Eliminar una subsección de una sección específica
  eliminarSubSeccion(seccionIndex: number, subIndex: number): void {
    this.getSubSecciones(seccionIndex).removeAt(subIndex);
  }

  onGuardar(): void {
    if (this.formSeccion.valid) {
      this.dialogRef.close(this.formSeccion.value);
    } else {
      console.log('Formulario incompleto');
    }
  }

  onCancelar(): void {
    this.dialogRef.close();
  }

  Eventos(event: any) {
    console.log('Contenido del editor actualizado', event);
  }

  onEditorCreated(event: any) {
    console.log('Editor Quill creado:', event);
  }

  /* *********** paginador secciones *********** */

  paginaActual = 0;
  tamanioPagina = 1;

  get totalPaginas() {
    return Math.ceil(this.secciones.controls.length / this.tamanioPagina);
  }

  paginaAnterior() {
    if (this.paginaActual > 0) this.paginaActual--;
  }

  paginaSiguiente() {
    if (this.paginaActual < this.totalPaginas - 1) this.paginaActual++;
  }

  seccionesPaginadas() {
    const inicio = this.paginaActual * this.tamanioPagina;
    return this.secciones.controls.slice(inicio, inicio + this.tamanioPagina);
  }

  /* ****** Subseccion ******* */

  paginaActualSubSeccion = 0;
  tamanioPaginaSubSeccion = 1;

  get totalPaginasSubSeccion() {
    return Math.ceil(this.getSubSecciones(this.paginaActual).controls.length / this.tamanioPaginaSubSeccion);
  }

  paginaAnteriorSubSeccion() {
    if (this.paginaActualSubSeccion > 0) this.paginaActualSubSeccion--;
  }

  paginaSiguienteSubSeccion() {
    if (this.paginaActualSubSeccion < this.totalPaginasSubSeccion - 1) this.paginaActualSubSeccion++;
  }
 
  seccionesPaginadasSubSeccion() {
    const inicioSubSeccion = this.paginaActualSubSeccion * this.tamanioPaginaSubSeccion;
    return this.getSubSecciones(this.paginaActual).controls.slice(inicioSubSeccion, inicioSubSeccion + this.tamanioPagina);
  }

 
}