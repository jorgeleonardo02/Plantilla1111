import { Categoria } from "../categoria/categoria";
import { ContenidoUsuario } from "../contenido-usuario/contenido-usuario";

export class Contenido {
    id: number;
    nombreFoto: string;
    nombre: string;
    descripcion: string;
    etiquetas: string;
    fechaLimite: string;
    programa: string;
    matriculados: number;
    categoria: Categoria;
    activado: boolean;
    precio: number;
	porcentajeAdmin: number;
	calificacion: number;
    listaContenidoUsuario: ContenidoUsuario[];
}