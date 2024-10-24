import { Contenido } from "../contenido/contenido";

export class Categoria {
    id: number;
    nombre: string;
    listaContenidos: Contenido[]; 
}
