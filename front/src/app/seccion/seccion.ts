import { Contenido } from "../contenido/contenido";
import { SubSeccion } from "../subseccion/sub-seccion";

export interface Seccion {
  id: number;
  numeroSeccion: number;
  nombreSeccion: string;
  contenido: Contenido;
  listaSubSeccion: SubSeccion[];
}
