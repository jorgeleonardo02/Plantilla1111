import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { Seccion } from '../seccion';
import { SeccionService } from '../seccion.service';

@Component({
  selector: 'app-seccion',
  standalone: true,
  imports: [],
  templateUrl: './seccion.component.html',
  styleUrl: './seccion.component.css'
})
export class SeccionComponent {
  formularioSeccion: FormGroup;
  secciones: Seccion[] = [];

  constructor(private fb: FormBuilder, private seccionService: SeccionService) {
    this.formularioSeccion = this.fb.group({
      nombreSeccion: ['', Validators.required],
      subsecciones: this.fb.array([]) // Array para gestionar subsecciones
    });
  }

  ngOnInit(): void {
    this.listarSecciones();
  }

  get subsecciones(): FormArray {
    return this.formularioSeccion.get('subsecciones') as FormArray;
  }

  nuevaSubseccion(): FormGroup {
    return this.fb.group({
      nombreSubseccion: ['', Validators.required],
      contenidoTipo: ['texto', Validators.required],
      contenidoTexto: ['']
    });
  }

  agregarSubseccion(): void {
    this.subsecciones.push(this.nuevaSubseccion());
  }

  eliminarSubseccion(index: number): void {
    this.subsecciones.removeAt(index);
  }

  listarSecciones(): void {
    this.seccionService.listarElementos().subscribe(secciones => this.secciones = secciones);
  }

  guardarSeccion(): void {
    const nuevaSeccion: Seccion = this.formularioSeccion.value;
    this.seccionService.agregarElemento(nuevaSeccion).subscribe(() => {
      this.formularioSeccion.reset();
      this.listarSecciones();
    });
  }

  eliminarSeccion(id: number): void {
    this.seccionService.eliminaElemento(id).subscribe(() => this.listarSecciones());
  }
}
