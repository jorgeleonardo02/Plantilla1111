package Plantilla.apirest.service;

import java.util.List;
import java.util.Optional;
import Plantilla.apirest.common.ICommonService;
import Plantilla.apirest.seguridad.entidad.Usuario;

public interface IUsuarioService extends ICommonService<Usuario> {
    // List<Long> listaUsuariosDocentes(String nombreRol);
    List<Long> listaIdsUsuariosDocentes();

    List<Usuario> listaUsuariosDocentes();

    Optional<Usuario> buscarPorUsuarioNombre(String nombreUsuario);
}
