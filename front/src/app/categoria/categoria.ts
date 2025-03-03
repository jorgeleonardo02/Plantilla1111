import { Curso } from "../curso/curso";

export class Categoria {
    id: number;
    nombre: string;
    listaCurso: Curso[]; 
}
