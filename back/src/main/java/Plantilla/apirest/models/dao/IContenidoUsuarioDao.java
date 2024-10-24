package Plantilla.apirest.models.dao;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

import Plantilla.apirest.models.entity.Contenido;
import Plantilla.apirest.models.entity.ContenidoUsuario;

@Repository
public interface IContenidoUsuarioDao extends PagingAndSortingRepository<ContenidoUsuario, Long> {

        // Agrega el método para obtener los contenidos asociados a un usuario
        List<Contenido> findByUsuarioId(Long usuarioId);

        @Query("SELECT DISTINCT cu FROM ContenidoUsuario cu " +
                        "WHERE cu.contenido.id = :contenidoId AND cu.usuario.id IN " +
                        "(SELECT u.id FROM Usuario u JOIN u.roles r WHERE r.rolNombre = 'ROLE_DOCENTE')")
        Optional<ContenidoUsuario> ContenidoUsuarioPorRolDocente(@Param("contenidoId") Long contenidoId);

        // SELECT COUNT(*) FROM contenido_usuario cu WHERE cu.usuario_id = 5;
        @Query("SELECT COUNT(cu) FROM ContenidoUsuario cu WHERE cu.usuario.id = :usuarioId")
        Long cantidadContenidosDeDocente(@Param("usuarioId") Long usuarioId);

        // De ContenidoUsuario busca todos los realcionados de id usuariio con el
        // contenido
        Page<ContenidoUsuario> findContenidosByUsuarioId(Long usuarioId, Pageable pageable);

        // Doy usuario id y busca todos los contenidos de este usuario en
        // contenidoUsuario
        @Query(value = "SELECT c.* FROM contenido_usuario cu " +
                        "JOIN contenidos c ON cu.contenido_id = c.id " +
                        "WHERE cu.usuario_id = :usuarioId", nativeQuery = true)
        Page<Contenido> encontrarContenidosByUsuarioId(@Param("usuarioId") Long usuarioId, Pageable pageable);

        // @Query("SELECT DISTINCT cu FROM ContenidoUsuario cu " +
        // "WHERE cu.contenido.id = :contenidoId AND cu.usuario.id IN " +
        // "(SELECT u.id FROM Usuario u JOIN u.roles r WHERE r.rolNombre =
        // 'ROLE_DOCENTE')")
        // SELECT COUNT(*) > 0

        /* Ya existe un contenido id = 2 relacionado al usuario con rol Docente */
        // FROM contenido_usuario cu
        // JOIN usuario u ON cu.usuario_id = u.id
        // JOIN usuario_rol ur ON u.id = ur.usuario_id
        // JOIN rol r ON ur.rol_id = r.id
        // WHERE cu.contenido_id = 5
        // AND r.rol_nombre = 'ROLE_DOCENTE';

        /*
         * @Query("SELECT COUNT(cu) > 0 FROM ContenidoUsuario cu " +
         * "JOIN cu.usuario u " +
         * "JOIN u.roles r " +
         * "WHERE cu.contenido.id = :contenidoId " +
         * "AND r.nombre = 'ROLE_DOCENTE'")
         * boolean existeContenidoConDocente(@Param("contenidoId") Long contenidoId);
         */
        /*
         * @Query("SELECT COUNT(cu) FROM ContenidoUsuario cu " +
         * "JOIN cu.usuario u " +
         * "JOIN u.roles r " +
         * "WHERE cu.contenido.id = :contenidoId " +
         * "AND r.nombre = 'ROLE_DOCENTE'")
         * boolean existeContenidoConDocente(@Param("contenidoId") Long contenidoId);
         */
        @Query("SELECT COUNT(cu) > 0 FROM ContenidoUsuario cu " +
                        "JOIN cu.usuario u " +
                        "JOIN u.roles r " +
                        "WHERE cu.contenido.id = :contenidoId " +
                        "AND r.rolNombre = 'ROLE_DOCENTE'")
        boolean existeContenidoConDocente(@Param("contenidoId") Long contenidoId);

        @Query("SELECT COUNT(cu) > 0 FROM ContenidoUsuario cu " +
                        "WHERE cu.contenido.id = :contenidoId " +
                        "AND cu.usuario.id = :usuarioId")
        boolean existeRelacionUsuarioContenido(@Param("contenidoId") Long contenidoId,
                        @Param("usuarioId") Long usuarioId);

}
