import { Seccion } from "../seccion/seccion";

export interface SubSeccion {
  id: number;
  numeroSubSeccion: number;
  nombreSubseccion: string;
  /* tipoContenido: string;
  contenidoUrl: string;
  contenidoTexto: string; */
  contenidoSubSeccion: string;
  seccion: Seccion;
}
