package Plantilla.apirest.models.dao;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import Plantilla.apirest.models.entity.Curso;

import org.springframework.data.repository.query.Param;

@Repository
public interface ICursoRepository extends JpaRepository<Curso, Long> {

    // Verifica si existe un curso con un ID específico.
    boolean existsById(Long id);

    // Obtiene una lista de cursos filtrados por la ID de una categoría.
    List<Curso> findByCategoriaId(Long categoriaId);

    // 1. Busca contenidos por categoría ID y nombre que contengan un texto específico (ignora mayúsculas/minúsculas).
    @Query("SELECT c FROM Curso c WHERE c.categoria.id = :categoriaId AND LOWER(c.nombre) LIKE %:nombre%")
    Page<Curso> findByCategoriaIdAndNombreCursoContainingIgnoreCase(@Param("categoriaId") Long categoriaId,
            @Param("nombre") String titulo, Pageable pageable);

    // Busca cursos por el nombre de la categoría y un texto parcial en el nombre.
    Page<Curso> findByCategoriaNombreAndNombreContainingIgnoreCase(String nombreCategoria, String nombre,
            Pageable pageable);

    // Similar al anterior, pero también filtra cursos que estén activados.
    Page<Curso> findByCategoriaNombreAndNombreContainingIgnoreCaseAndActivado(String nombreCategoria,
            String nombre, Boolean activado, Pageable pageable);

    // 2. Consulta personalizada que filtra por nombre de la categoría y texto en el nombre (ignora mayúsculas/minúsculas).
    @Query("SELECT c FROM Curso c JOIN c.categoria ca WHERE LOWER(ca.nombre) = LOWER(:nombreCategoria) AND LOWER(c.nombre) LIKE %:nombre%")
    Page<Curso> findByCategoriaNombreAndNombreCursoContainingIgnoreCase1(@Param("nombreCategoria") String nombreCategoria,
            @Param("nombre") String nombre, Pageable pageable);

    // 3. Consulta personalizada que filtra por categoría, texto en el nombre y estado de activación.
    @Query("SELECT c FROM Curso c JOIN c.categoria ca WHERE LOWER(ca.nombre) = LOWER(:nombreCategoria) AND LOWER(c.nombre) LIKE %:nombre% AND c.activado = :activado")
    Page<Curso> obtenerContenidoPorNombreCategoriaYNombreCursoPaginadoYActivado(@Param("nombreCategoria") String nombreCategoria,
            @Param("nombre") String nombre, @Param("activado") boolean activado, Pageable pageable);

    // Obtiene cursos por el nombre exacto de una categoría.
    Page<Curso> findByCategoriaNombre(String nombreCategoria, Pageable pageable);

    // Verifica si existe un curso con un título específico.
    boolean existsByNombre(String nombre);

    // Filtra cursos activados por el nombre de la categoría.
    Page<Curso> findByCategoriaNombreAndActivadoTrue(String nombreCategoria, Pageable pageable);

    // Filtra cursos activados con un título que contenga un texto parcial, por categoría.
    Page<Curso> findByCategoriaNombreAndNombreContainingIgnoreCaseAndActivadoTrue(String nombreCategoria,
            String nombre, Pageable pageable);

    // Filtra cursos activados que contienen un texto parcial en el título.
    Page<Curso> findBynombreContainingIgnoreCaseAndActivadoTrue(String nombre, Pageable pageable);

    // Obtiene todos los cursos activados.
    Page<Curso> findAllByActivadoTrue(Pageable pageable);

    // Obtiene todos los cursos desactivados.
    Page<Curso> findAllByActivadoFalse(Pageable pageable);

    // Lista cursos activados por categoría ID.
    List<Curso> findByCategoriaIdAndActivadoTrue(Long categoriaId);

    // Lista cursos desactivados por categoría ID.
    List<Curso> findByCategoriaIdAndActivadoFalse(Long categoriaId);

    // Encuentra cursos activados asociados a un usuario específico (por ejemplo, un docente).
    @Query("SELECT DISTINCT c FROM Curso c JOIN FETCH c.categoria WHERE c.activado = true AND c.id IN (SELECT cu.curso.id FROM CursoUsuario cu WHERE cu.usuario.id = :userId)")
    List<Curso> encontrarCursosActivadosPorDocente(@Param("userId") Long userId);

    // Encuentra curso desactivados asociados a un usuario específico.
    @Query("SELECT DISTINCT c FROM Curso c JOIN FETCH c.categoria WHERE c.activado = false AND c.id IN (SELECT cu.curso.id FROM CursoUsuario cu WHERE cu.usuario.id = :userId)")
    List<Curso> encontrarCursosDesactivadosPorDocente(@Param("userId") Long userId);

    // Encuentra todos los curso (activados y desactivados) asociados a un usuario.
    @Query("SELECT DISTINCT c FROM Curso c JOIN FETCH c.categoria WHERE c.id IN (SELECT cu.curso.id FROM CursoUsuario cu WHERE cu.usuario.id = :userId)")
    List<Curso> encontrarCursosPorDocente(@Param("userId") Long userId);

    // Filtra contenidos por categoría y usuario.
    @Query("SELECT cu.curso FROM CursoUsuario cu " + 
           "INNER JOIN cu.curso c " + 
           "INNER JOIN cu.usuario u " + 
           "WHERE c.categoria.nombre = :nombreCategoria AND u.id = :usuarioId")
    Page<Curso> findByCategoriaNombreAndUsuarioId(@Param("nombreCategoria") String nombreCategoria,
            @Param("usuarioId") Long usuarioId, Pageable pageable);

    // Encuentra cursos desactivados asociados a un usuario específico.
    @Query("SELECT c FROM Curso c JOIN CursoUsuario cu ON c.id = cu.curso.id WHERE cu.usuario.id = :usuarioId AND c.activado = false")
    Page<Curso> findCursoByUsuarioIdAndActivadoFalse(@Param("usuarioId") Long usuarioId, Pageable pageable);

    // Encuentra cursos activados asociados a un usuario.
    @Query("SELECT cu.curso FROM CursoUsuario cu WHERE cu.usuario.id = :usuarioId AND cu.curso.activado = true")
    Page<Curso> findCursoByUsuarioIdAndActivadoTrue(@Param("usuarioId") Long usuarioId, Pageable pageable);

    // Filtra cursos por nombre de categoría y estado de activación.
    @Query("SELECT c FROM Curso c WHERE c.categoria.nombre = :nombreCategoria " +
           "AND (:activado IS NULL OR c.activado = :activado)")
    Page<Curso> findByCategoriaNombreAndActivado(@Param("nombreCategoria") String nombreCategoria,
            @Param("activado") Boolean activado, Pageable pageable);

    // Encuentra cursos activados de una categoría que no están asociados con un usuario.
    @Query("SELECT c " +
           "FROM Curso c " +
           "JOIN c.categoria cat " +
           "WHERE cat.nombre = :nombreCategoria " +
           "AND c.activado = true " +
           "AND c.id NOT IN (SELECT cu.curso.id FROM CursoUsuario cu WHERE cu.usuario.id = :usuarioId)")
    Page<Curso> findByCategoriaNombreAndActivadoAndUsuarioIdIsNull(
            @Param("nombreCategoria") String nombreCategoria,
            @Param("usuarioId") Long usuarioId,
            Pageable pageable);

    // Verifica si existe un curso activado, por categoría y usuario.
    @Query("SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END " +
           "FROM Curso c " +
           "JOIN c.categoria cat " +
           "LEFT JOIN CursoUsuario cu ON c.id = cu.curso.id AND cu.usuario.id = :usuarioId " +
           "WHERE cat.nombre = :nombreCategoria " +
           "AND c.activado = true " +
           "AND cu.id IS NULL " +
           "AND c.id = :cursoId")
    boolean existsByCategoriaNombreAndActivadoAndUsuarioIdIsNullAndCursoId(
            @Param("nombreCategoria") String nombreCategoria,
            @Param("usuarioId") Long usuarioId,
            @Param("cursoId") Long cursoId);

     // Filtra cursos por nombre de categoría y estado de activación.
    @Query("SELECT c FROM Curso c WHERE c.categoria.nombre = :nombreCategoria")
    Page<Curso> findByCategoriaNombre1(@Param("nombreCategoria") String nombreCategoria, Pageable pageable);

    // Muestra todos los contenidos que tiene un usuario por id
    /* @Query(value = "SELECT c.* " +
    "FROM contenidos c " +
    "JOIN contenido_usuario cu ON cu.contenido_id = c.id " +
    "JOIN usuarios u ON cu.usuario_id = u.id " +
    "JOIN usuario_rol ur ON ur.usuario_id = u.id " +
    "JOIN roles r ON ur.rol_id = r.id " +
    "WHERE r.rol_nombre = 'ROLE_DOCENTE' " +
    "AND u.id = :usuarioId", nativeQuery = true) */
    @Query("SELECT c FROM Curso c " +
       "JOIN CursoUsuario cu ON cu.curso.id = c.id " +
       "JOIN Usuario u ON cu.usuario.id = u.id " +
       "WHERE u.id = :usuarioId")
    List<Curso> findCursosByUsuarioId(@Param("usuarioId") Long usuarioId);
}
