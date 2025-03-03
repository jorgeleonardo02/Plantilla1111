import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-subseccion',
  templateUrl: './subseccion.component.html',
  styleUrls: ['./subseccion.component.css']
})
export class SubseccionComponent {
  @Output() eliminar = new EventEmitter<void>();

  // Define la propiedad formGroup
  formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    // Inicializa formGroup utilizando FormBuilder
    this.formGroup = this.formBuilder.group({
      nombreSubseccion: [''],
      cursoTexto: ['']
    });
  }

  // Método para emitir el evento de eliminación
  onEliminar(): void {
    this.eliminar.emit();
  }
}
