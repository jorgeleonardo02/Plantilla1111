import { Categoria } from "../categoria/categoria";
import { CursoUsuario } from "../curso-usuario/curso-usuario";

export class Curso {
    id: number;
    nombreFoto: string;
    nombre: string;
    descripcion: string;
    etiquetas: string;
    fechaLimite: string;
    matriculados: number;
    categoria: Categoria;
    activado: boolean;
    precio: number;
	porcentajeAdmin: number;
	calificacion: number;
    listaCursoUsuario: CursoUsuario[];
    listaHabilidades: string[];
}