package Plantilla.apirest.models.dao;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import Plantilla.apirest.models.entity.Curso;
import Plantilla.apirest.models.entity.CursoUsuario;

@Repository
public interface ICursoUsuarioDao extends PagingAndSortingRepository<CursoUsuario, Long> {

        // Agrega el método para obtener los cursos asociados a un usuario
        List<Curso> findByUsuarioId(Long usuarioId);

        @Query("SELECT DISTINCT cu FROM CursoUsuario cu " +
                        "WHERE cu.curso.id = :cursoId AND cu.usuario.id IN " +
                        "(SELECT u.id FROM Usuario u JOIN u.roles r WHERE r.rolNombre = 'ROLE_DOCENTE')")
        Optional<CursoUsuario> CursoUsuarioPorRolDocente(@Param("cursoId") Long cursoId);

        // SELECT COUNT(*) FROM contenido_usuario cu WHERE cu.usuario_id = 5;
        @Query("SELECT COUNT(cu) FROM CursoUsuario cu WHERE cu.usuario.id = :usuarioId")
        Long cantidadCursosDeDocente(@Param("usuarioId") Long usuarioId);

        // De CursoUsuario busca todos los realcionados de id usuario con el curso
        Page<CursoUsuario> findCursosByUsuarioId(Long usuarioId, Pageable pageable);

        // Doy usuario id y busca todos los cursos de este usuario en cursoUsuario
        @Query(value = "SELECT c.* FROM curso_usuario cu " +
                        "JOIN cursos c ON cu.curso_id = c.id " +
                        "WHERE cu.usuario_id = :usuarioId", nativeQuery = true)
        Page<Curso> encontrarCursosByUsuarioId(@Param("usuarioId") Long usuarioId, Pageable pageable);

        @Query("SELECT COUNT(cu) > 0 FROM CursoUsuario cu " +
                        "JOIN cu.usuario u " +
                        "JOIN u.roles r " +
                        "WHERE cu.curso.id = :cursoId " +
                        "AND r.rolNombre = 'ROLE_DOCENTE'")
        boolean existeCursoConDocente(@Param("cursoId") Long cursoId);

        @Query("SELECT COUNT(cu) > 0 FROM CursoUsuario cu " +
                        "WHERE cu.curso.id = :cursoId " +
                        "AND cu.usuario.id = :usuarioId")
        boolean existeRelacionUsuarioCurso(@Param("cursoId") Long cursoId,
                        @Param("usuarioId") Long usuarioId);

}
