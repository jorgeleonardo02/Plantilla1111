package Plantilla.apirest.models.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

import Plantilla.apirest.seguridad.entidad.Usuario;

//SELECT usuario_id FROM usuario_rol ur WHERE rol_id IN (SELECT id FROM  rol WHERE rol_nombre = 'ROLE_DOCENTE');
public interface IUsuarioDao extends PagingAndSortingRepository<Usuario, Long> {

    @Query("SELECT DISTINCT u.id FROM Usuario u JOIN u.roles r WHERE r.rolNombre = 'ROLE_DOCENTE'")
    List<Long> listaIdUsuariosDocentes();

    @Query("SELECT DISTINCT u FROM Usuario u JOIN u.roles r WHERE r.rolNombre = 'ROLE_DOCENTE'")
    List<Usuario> listaUsuariosDocentes();

    // SELECT * FROM usuario WHERE nombre_usuario = 'leonardob';
    @Query("SELECT u FROM Usuario u WHERE u.nombreUsuario = :nombreUsuario")
    // optional si no encuentra usuario arroja vacio
    Optional<Usuario> findByUsuario(@Param("nombreUsuario") String nombreUsuario);
}
