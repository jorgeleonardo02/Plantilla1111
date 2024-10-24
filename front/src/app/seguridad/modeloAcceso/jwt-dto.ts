import { NuevoUsuario } from "./nuevo-usuario";

export class JwtDto {
    token: string;
    nombre: string;
    correo: string;
    /* usuario: NuevoUsuario; */
    constructor(token: string/* , nombre: string, correo: string *//* , nuevoUsuario: NuevoUsuario */){
        this.token = token;
        /* this.nombre = nombre;
        this.correo = correo; */
       /*  this.nuevoUsuario = nuevoUsuario; */
    }
}
