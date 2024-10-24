/* import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-subseccion',
  standalone: true,
  imports: [],
  templateUrl: './subseccion.component.html',
  styleUrl: './subseccion.component.css'
})
export class SubseccionComponent {
    @Input() formGroup: FormGroup;
    //@Output() eliminar = new EventEmitter<void>();
} */
/* import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-subseccion',
  templateUrl: './subseccion.component.html',
})
export class SubseccionComponent {
  @Input() formGroup!: FormGroup; // Recibe el FormGroup desde el componente padre
}
 */
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
      contenidoTexto: ['']
    });
  }

  // Método para emitir el evento de eliminación
  onEliminar(): void {
    this.eliminar.emit();
  }
}
