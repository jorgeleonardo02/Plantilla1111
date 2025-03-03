import { Curso } from "../curso/curso";
import { SubSeccion } from "../subseccion/sub-seccion";

export interface Seccion {
  id: number;
  numeroSeccion: number;
  nombreSeccion: string;
  curso: Curso;
  listaSubSeccion: SubSeccion[];
}
