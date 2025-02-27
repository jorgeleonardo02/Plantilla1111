import { url } from "./url"

export const environment = {
    production: true,
    endPointCategoria: url + 'api/categorias',
    endPointContenido: url + 'api/cursos',
    endPointAuth: url + 'auth/',
    endPointFoto: url + 'api/cursos/cursoFoto/',
    endPointUsuario: url + 'api/usuario',
    endPointContenidoUsuario: url + 'api/cursoUsuario'
}
