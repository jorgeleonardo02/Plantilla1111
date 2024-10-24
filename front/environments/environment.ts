import { url } from "./url"

export const environment = {
    production: true,
    endPointCategoria: url + 'api/categorias',
    endPointContenido: url + 'api/contenidos',
    endPointAuth: url + 'auth/',
    endPointFoto: url + 'api/contenidos/contenidoFoto/',
    endPointUsuario: url + 'api/usuario',
    endPointContenidoUsuario: url + 'api/contenidoUsuario'
}
