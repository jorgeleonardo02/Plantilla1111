/* import { Curso } from "../curso/curso";
import { SubSeccion } from "../subseccion/sub-seccion";

export interface Seccion {
  id: number;
  numeroSeccion: number;
  nombreSeccion: string;
  curso: Curso;
  listaSubSeccion: SubSeccion[];
} */
 /*  export interface Seccion {
    id: number;
    numeroSeccion: number;
    nombreSeccion: string;
    contenido: string;
    curso?: Curso; // Opcional si puede no tener curso
    padre?: Seccion | null; // Para representar la relación jerárquica
    hijo: Seccion[]; // Lista de subsecciones (hijos)
  } */

import { SubSeccion } from "../subseccion/sub-seccion";

export interface Seccion {
  id: number;
  index: number;
  nombreSeccion: string;
  numeroSeccion: number;
  children?: SubSeccion[];
}