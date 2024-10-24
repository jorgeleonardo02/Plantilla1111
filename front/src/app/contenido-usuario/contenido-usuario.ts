import { Contenido } from "../contenido/contenido";
import { UsuarioDto2 } from "../usuario/usuario-dto2";

export class ContenidoUsuario {
    id: number;
    usuario: UsuarioDto2;
    contenido: Contenido;
}
