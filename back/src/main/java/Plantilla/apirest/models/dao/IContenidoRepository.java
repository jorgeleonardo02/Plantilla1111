package Plantilla.apirest.models.dao;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import Plantilla.apirest.models.entity.Contenido;
import org.springframework.data.repository.query.Param;

@Repository
public interface IContenidoRepository extends JpaRepository<Contenido, Long> {

    // Verifica si existe un contenido con un ID específico.
    boolean existsById(Long id);

    // Obtiene una lista de contenidos filtrados por la ID de una categoría.
    List<Contenido> findByCategoriaId(Long categoriaId);

    // 1. Busca contenidos por categoría ID y nombre que contengan un texto específico (ignora mayúsculas/minúsculas).
    @Query("SELECT c FROM Contenido c WHERE c.categoria.id = :categoriaId AND LOWER(c.nombre) LIKE %:nombre%")
    Page<Contenido> findByCategoriaIdAndNombreCursoContainingIgnoreCase(@Param("categoriaId") Long categoriaId,
            @Param("nombre") String titulo, Pageable pageable);

    // Busca contenidos por el nombre de la categoría y un texto parcial en el nombre.
    Page<Contenido> findByCategoriaNombreAndNombreContainingIgnoreCase(String nombreCategoria, String nombre,
            Pageable pageable);

    // Similar al anterior, pero también filtra contenidos que estén activados.
    Page<Contenido> findByCategoriaNombreAndNombreContainingIgnoreCaseAndActivado(String nombreCategoria,
            String nombre, Boolean activado, Pageable pageable);

    // 2. Consulta personalizada que filtra por nombre de la categoría y texto en el nombre (ignora mayúsculas/minúsculas).
    @Query("SELECT c FROM Contenido c JOIN c.categoria ca WHERE LOWER(ca.nombre) = LOWER(:nombreCategoria) AND LOWER(c.nombre) LIKE %:titulo%")
    Page<Contenido> findByCategoriaNombreAndNombreCursoContainingIgnoreCase1(@Param("nombreCategoria") String nombreCategoria,
            @Param("nombre") String nombre, Pageable pageable);

    // 3. Consulta personalizada que filtra por categoría, texto en el nombre y estado de activación.
    @Query("SELECT c FROM Contenido c JOIN c.categoria ca WHERE LOWER(ca.nombre) = LOWER(:nombreCategoria) AND LOWER(c.nombre) LIKE %:titulo% AND c.activado = :activado")
    Page<Contenido> obtenerContenidoPorNombreCategoriaYNombreCursoPaginadoYActivado(@Param("nombreCategoria") String nombreCategoria,
            @Param("nombre") String nombre, @Param("activado") boolean activado, Pageable pageable);

    // Obtiene contenidos por el nombre exacto de una categoría.
    Page<Contenido> findByCategoriaNombre(String nombreCategoria, Pageable pageable);

    // Verifica si existe un contenido con un título específico.
    boolean existsByNombre(String nombre);

    // Filtra contenidos activados por el nombre de la categoría.
    Page<Contenido> findByCategoriaNombreAndActivadoTrue(String nombreCategoria, Pageable pageable);

    // Filtra contenidos activados con un título que contenga un texto parcial, por categoría.
    Page<Contenido> findByCategoriaNombreAndNombreContainingIgnoreCaseAndActivadoTrue(String nombreCategoria,
            String nombre, Pageable pageable);

    // Filtra contenidos activados que contienen un texto parcial en el título.
    Page<Contenido> findBynombreContainingIgnoreCaseAndActivadoTrue(String nombre, Pageable pageable);

    // Obtiene todos los contenidos activados.
    Page<Contenido> findAllByActivadoTrue(Pageable pageable);

    // Obtiene todos los contenidos desactivados.
    Page<Contenido> findAllByActivadoFalse(Pageable pageable);

    // Lista contenidos activados por categoría ID.
    List<Contenido> findByCategoriaIdAndActivadoTrue(Long categoriaId);

    // Lista contenidos desactivados por categoría ID.
    List<Contenido> findByCategoriaIdAndActivadoFalse(Long categoriaId);

    // Encuentra contenidos activados asociados a un usuario específico (por ejemplo, un docente).
    @Query("SELECT DISTINCT c FROM Contenido c JOIN FETCH c.categoria WHERE c.activado = true AND c.id IN (SELECT cu.contenido.id FROM ContenidoUsuario cu WHERE cu.usuario.id = :userId)")
    List<Contenido> encontrarContenidosActivadosPorDocente(@Param("userId") Long userId);

    // Encuentra contenidos desactivados asociados a un usuario específico.
    @Query("SELECT DISTINCT c FROM Contenido c JOIN FETCH c.categoria WHERE c.activado = false AND c.id IN (SELECT cu.contenido.id FROM ContenidoUsuario cu WHERE cu.usuario.id = :userId)")
    List<Contenido> encontrarContenidosDesactivadosPorDocente(@Param("userId") Long userId);

    // Encuentra todos los contenidos (activados y desactivados) asociados a un usuario.
    @Query("SELECT DISTINCT c FROM Contenido c JOIN FETCH c.categoria WHERE c.id IN (SELECT cu.contenido.id FROM ContenidoUsuario cu WHERE cu.usuario.id = :userId)")
    List<Contenido> encontrarContenidosPorDocente(@Param("userId") Long userId);

    // Filtra contenidos por categoría y usuario.
    @Query("SELECT cu.contenido FROM ContenidoUsuario cu " + 
           "INNER JOIN cu.contenido c " + 
           "INNER JOIN cu.usuario u " + 
           "WHERE c.categoria.nombre = :nombreCategoria AND u.id = :usuarioId")
    Page<Contenido> findByCategoriaNombreAndUsuarioId(@Param("nombreCategoria") String nombreCategoria,
            @Param("usuarioId") Long usuarioId, Pageable pageable);

    // Encuentra contenidos desactivados asociados a un usuario específico.
    @Query("SELECT c FROM Contenido c JOIN ContenidoUsuario cu ON c.id = cu.contenido.id WHERE cu.usuario.id = :usuarioId AND c.activado = false")
    Page<Contenido> findContenidoByUsuarioIdAndActivadoFalse(@Param("usuarioId") Long usuarioId, Pageable pageable);

    // Encuentra contenidos activados asociados a un usuario.
    @Query("SELECT cu.contenido FROM ContenidoUsuario cu WHERE cu.usuario.id = :usuarioId AND cu.contenido.activado = true")
    Page<Contenido> findContenidoByUsuarioIdAndActivadoTrue(@Param("usuarioId") Long usuarioId, Pageable pageable);

    // Filtra contenidos por nombre de categoría y estado de activación.
    @Query("SELECT c FROM Contenido c WHERE c.categoria.nombre = :nombreCategoria " +
           "AND (:activado IS NULL OR c.activado = :activado)")
    Page<Contenido> findByCategoriaNombreAndActivado(@Param("nombreCategoria") String nombreCategoria,
            @Param("activado") Boolean activado, Pageable pageable);

    // Encuentra contenidos activados de una categoría que no están asociados con un usuario.
    @Query("SELECT c " +
           "FROM Contenido c " +
           "JOIN c.categoria cat " +
           "WHERE cat.nombre = :nombreCategoria " +
           "AND c.activado = true " +
           "AND c.id NOT IN (SELECT cu.contenido.id FROM ContenidoUsuario cu WHERE cu.usuario.id = :usuarioId)")
    Page<Contenido> findByCategoriaNombreAndActivadoAndUsuarioIdIsNull(
            @Param("nombreCategoria") String nombreCategoria,
            @Param("usuarioId") Long usuarioId,
            Pageable pageable);

    // Verifica si existe un contenido activado, por categoría y usuario.
    @Query("SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END " +
           "FROM Contenido c " +
           "JOIN c.categoria cat " +
           "LEFT JOIN ContenidoUsuario cu ON c.id = cu.contenido.id AND cu.usuario.id = :usuarioId " +
           "WHERE cat.nombre = :nombreCategoria " +
           "AND c.activado = true " +
           "AND cu.id IS NULL " +
           "AND c.id = :contenidoId")
    boolean existsByCategoriaNombreAndActivadoAndUsuarioIdIsNullAndContenidoId(
            @Param("nombreCategoria") String nombreCategoria,
            @Param("usuarioId") Long usuarioId,
            @Param("contenidoId") Long contenidoId);

     // Filtra contenidos por nombre de categoría y estado de activación.
    @Query("SELECT c FROM Contenido c WHERE c.categoria.nombre = :nombreCategoria")
    Page<Contenido> findByCategoriaNombre1(@Param("nombreCategoria") String nombreCategoria, Pageable pageable);

    // Muestra todos los contenidos que tiene un usuario por id
    /* @Query(value = "SELECT c.* " +
    "FROM contenidos c " +
    "JOIN contenido_usuario cu ON cu.contenido_id = c.id " +
    "JOIN usuarios u ON cu.usuario_id = u.id " +
    "JOIN usuario_rol ur ON ur.usuario_id = u.id " +
    "JOIN roles r ON ur.rol_id = r.id " +
    "WHERE r.rol_nombre = 'ROLE_DOCENTE' " +
    "AND u.id = :usuarioId", nativeQuery = true) */
    @Query("SELECT c FROM Contenido c " +
       "JOIN ContenidoUsuario cu ON cu.contenido.id = c.id " +
       "JOIN Usuario u ON cu.usuario.id = u.id " +
       "WHERE u.id = :usuarioId")
    List<Contenido> findContenidosByUsuarioId(@Param("usuarioId") Long usuarioId);
}
