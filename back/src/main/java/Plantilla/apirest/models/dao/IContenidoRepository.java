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

        // boolean existsByTitulo(String nombre);

        boolean existsById(Long id);

        List<Contenido> findByCategoriaId(Long categoriaId);

        // 1.
        @Query("SELECT c FROM Contenido c WHERE c.categoria.id = :categoriaId AND LOWER(c.titulo) LIKE %:titulo%")
        Page<Contenido> findByCategoriaIdAndTituloContainingIgnoreCase(@Param("categoriaId") Long categoriaId,
                        @Param("titulo") String titulo, Pageable pageable);

        Page<Contenido> findByCategoriaNombreAndTituloContainingIgnoreCase(String nombreCategoria, String titulo,
                        Pageable pageable);

        Page<Contenido> findByCategoriaNombreAndTituloContainingIgnoreCaseAndActivado(String nombreCategoria,
                        String titulo,
                        Boolean activado, Pageable pageable);

        @Query("SELECT c FROM Contenido c JOIN c.categoria ca WHERE LOWER(ca.nombre) = LOWER(:nombreCategoria) AND LOWER(c.titulo) LIKE %:titulo%")
        Page<Contenido> findByCategoriaNombreAndTituloContainingIgnoreCase1(
                        @Param("nombreCategoria") String nombreCategoria, @Param("titulo") String titulo,
                        Pageable pageable);

        @Query("SELECT c FROM Contenido c JOIN c.categoria ca WHERE LOWER(ca.nombre) = LOWER(:nombreCategoria) AND LOWER(c.titulo) LIKE %:titulo% AND c.activado = :activado")
        Page<Contenido> obtenerContenidoPorNombreCategoriaYTituloPaginadoYActivado(
                        @Param("nombreCategoria") String nombreCategoria, @Param("titulo") String titulo,
                        @Param("activado") boolean activado,
                        Pageable pageable);

        Page<Contenido> findByCategoriaNombre(String nombreCategoria, Pageable pageable);

        boolean existsByTitulo(String titulo);

        Page<Contenido> findByCategoriaNombreAndActivadoTrue(String nombreCategoria, Pageable pageable);

        Page<Contenido> findByCategoriaNombreAndTituloContainingIgnoreCaseAndActivadoTrue(String nombreCategoria,
                        String titulo, Pageable pageable);

        Page<Contenido> findByTituloContainingIgnoreCaseAndActivadoTrue(String titulo, Pageable pageable);

        Page<Contenido> findAllByActivadoTrue(Pageable pageable);

        Page<Contenido> findAllByActivadoFalse(Pageable pageable);

        List<Contenido> findByCategoriaIdAndActivadoTrue(Long categoriaId);

        List<Contenido> findByCategoriaIdAndActivadoFalse(Long categoriaId);

        @Query("SELECT DISTINCT c FROM Contenido c JOIN FETCH c.categoria WHERE c.activado = true AND c.id IN (SELECT cu.contenido.id FROM ContenidoUsuario cu WHERE cu.usuario.id = :userId)")
        List<Contenido> encontrarContenidosActivadosPorDocente(@Param("userId") Long userId);

        @Query("SELECT DISTINCT c FROM Contenido c JOIN FETCH c.categoria WHERE c.activado = false AND c.id IN (SELECT cu.contenido.id FROM ContenidoUsuario cu WHERE cu.usuario.id = :userId)")
        List<Contenido> encontrarContenidosDesactivadosPorDocente(@Param("userId") Long userId);

        @Query("SELECT DISTINCT c FROM Contenido c JOIN FETCH c.categoria WHERE c.id IN (SELECT cu.contenido.id FROM ContenidoUsuario cu WHERE cu.usuario.id = :userId)")
        List<Contenido> encontrarContenidosPorDocente(@Param("userId") Long userId);

        // ***************************************************************************************************/

        // 11.
        // Page<Contenido>
        // findByCategoriaNombreAndListaContenidoUsuarioUsuarioIdAndActivado(String
        // nombreCategoria,
        // Long usuarioId, Boolean activado, Pageable pageable);

        // 22.
        @Query("SELECT cu.contenido FROM ContenidoUsuario cu " + "INNER JOIN cu.contenido c "
                        + "INNER JOIN cu.usuario u " +
                        "WHERE c.categoria.nombre = :nombreCategoria " + "AND u.id = :usuarioId")
        Page<Contenido> findByCategoriaNombreAndUsuarioId(@Param("nombreCategoria") String nombreCategoria,
                        @Param("usuarioId") Long usuarioId, Pageable pageable);

        // 33.
        @Query("SELECT c FROM Contenido c JOIN ContenidoUsuario cu ON c.id = cu.contenido.id WHERE cu.usuario.id = :usuarioId AND c.activado = false")
        Page<Contenido> findContenidoByUsuarioIdAndActivadoFalse(@Param("usuarioId") Long usuarioId, Pageable pageable);

        // 44.
        @Query("SELECT cu.contenido FROM ContenidoUsuario cu WHERE cu.usuario.id = :usuarioId AND cu.contenido.activado = true")
        Page<Contenido> findContenidoByUsuarioIdAndActivadoTrue(@Param("usuarioId") Long usuarioId, Pageable pageable);

        // 55.
        // @Query("SELECT c FROM Contenido c INNER JOIN c.listaContenidoUsuario cu WHERE
        // cu.usuario.id = :usuarioId")
        // Page<Contenido> findByUsuarioId(Long usuarioId, Pageable pageable);

        // 66.
        @Query("SELECT c FROM Contenido c WHERE c.categoria.nombre = :nombreCategoria")
        Page<Contenido> findByCategoriaNombre1(@Param("nombreCategoria") String nombreCategoria, Pageable pageable);

        // 77.
        @Query("SELECT c FROM Contenido c WHERE c.categoria.nombre = :nombreCategoria " +
                        "AND (:activado IS NULL OR c.activado = :activado)")
        Page<Contenido> findByCategoriaNombreAndActivado(@Param("nombreCategoria") String nombreCategoria,
                        @Param("activado") Boolean activado, Pageable pageable);

        // Contenidos activados de la categoría 'Desarrollo web' que no están asociados
        // con el is_usuario 4 en la tabla Contenido_Usuario
        /*
         * @Query("SELECT c " +
         * "FROM Contenido c " +
         * "JOIN c.categoria cat " +
         * "LEFT JOIN c.listaContenidoUsuario cu " +
         * "WHERE cat.nombre = :nombreCategoria " +
         * "AND c.activado = true " +
         * "AND (cu IS NULL OR cu.usuario.id = :usuarioId)")
         */
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

        // 777
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

}