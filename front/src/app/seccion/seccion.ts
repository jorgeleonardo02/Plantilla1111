import { Subseccion } from "../subseccion/subseccion";

export interface Seccion {
  id: number;
  numeroSeccion: number;
  nombreSeccion: string;
  listaSubSeccion: Subseccion[];
}
