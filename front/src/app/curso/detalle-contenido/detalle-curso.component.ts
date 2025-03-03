import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
@Component({
  selector: 'app-detalle-curso',
  templateUrl: './detalle-curso.component.html',
  styleUrls: ['./detalle-curso.component.css']
})
export class DetalleCursoComponent implements OnInit {
  
  form: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      secciones: this.fb.array([]) // Definir 'secciones' como FormArray
    });
  }

  get secciones(): FormArray {
    return this.form.get('secciones') as FormArray; // Conversión explícita a FormArray
  }

  // Método para obtener una sección específica como FormGroup
  getSeccionFormGroup(index: number): FormGroup {
    return this.secciones.at(index) as FormGroup;
  }

  agregarSeccion(): void {
    const nuevaSeccion: FormGroup = this.fb.group({
      nombreSeccion: '',
      listaSubSeccion: this.fb.array([]) // Definir 'listaSubSeccion' como FormArray
    });
    this.secciones.push(nuevaSeccion);
  }

  eliminarSeccion(i: number): void {
    this.secciones.removeAt(i);
  }

  guardar(): void {
    // Lógica para guardar o generar PDF
  }
}

