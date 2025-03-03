import { Curso } from "../curso/curso";
import { UsuarioDto2 } from "../usuario/usuario-dto2";

export class CursoUsuario {
    id: number;
    usuario: UsuarioDto2;
    curso: Curso;
}
