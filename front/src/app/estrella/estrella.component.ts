import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-estrella',
  templateUrl: './estrella.component.html',
  styleUrls: ['./estrella.component.css']
})
export class EstrellaComponent {

  @Input() calificacion: number; // Entrada para la calificación
  @Input() colorEstrella: string; // Entrada para el color de las estrellas
  @Input() claseCSS: string; // Entrada para la clase CSS

  // Función para generar un array de números para el número de estrellas
  obtenerArrayEstrellas(): number[] {
    const totalEstrellas = 5;
    const estrellasRedondeadas = Math.round(this.calificacion * 2) / 2; // Redondear a la mitad más cercana
    const estrellasEnteras = Math.floor(estrellasRedondeadas);
    const estrellaMitad = estrellasRedondeadas - estrellasEnteras;
    const arrayEstrellas: number[] = [];

    for (let i = 0; i < estrellasEnteras; i++) {
      arrayEstrellas.push(1); // Estrella completa
    }

    if (estrellaMitad > 0) {
      arrayEstrellas.push(0.5); // Estrella mitad
    }

    const estrellasRestantes = totalEstrellas - arrayEstrellas.length;
    for (let i = 0; i < estrellasRestantes; i++) {
      arrayEstrellas.push(0); // Estrella vacía
    }

    return arrayEstrellas;
  }

}
