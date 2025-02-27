
package Plantilla.apirest.models.dao;

/* import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query; */
import org.springframework.data.repository.PagingAndSortingRepository;
//import org.springframework.data.repository.query.Param;

/* import Plantilla.apirest.models.entity.Contenido;

public interface IContenidoDao extends PagingAndSortingRepository<Contenido, Long> { */

        /*
         * @Query("SELECT c FROM Contenido c WHERE c.categoria.id = :categoriaId")
         * List<Contenido> findByCategoriaId(@Param("categoriaId") Long categoriaId);
         * 
         * @Query("SELECT c FROM Contenido c WHERE c.categoria.id = :categoriaId AND LOWER(c.titulo) LIKE %:titulo%"
         * )
         * Page<Contenido>
         * findByCategoriaIdAndTituloContainingIgnoreCase(@Param("categoriaId") Long
         * categoriaId,
         * 
         * @Param("titulo") String titulo, Pageable pageable);
         * 
         * @Query("SELECT c FROM Contenido c JOIN c.categoria ca WHERE LOWER(ca.nombre) = LOWER(:nombreCategoria) AND LOWER(c.titulo) LIKE %:titulo%"
         * )
         * Page<Contenido> findByCategoriaNombreAndTituloContainingIgnoreCase(
         * 
         * @Param("nombreCategoria") String nombreCategoria,
         * 
         * @Param("titulo") String titulo, Pageable pageable);
         * 
         * @Query("SELECT c FROM Contenido c JOIN c.categoria ca WHERE LOWER(ca.nombre) = LOWER(:nombreCategoria) AND LOWER(c.titulo) LIKE %:titulo%"
         * )
         * Page<Contenido> findByCategoriaNombreAndTituloContainingIgnoreCase1(
         * 
         * @Param("nombreCategoria") String nombreCategoria,
         * 
         * @Param("titulo") String titulo,
         * Pageable pageable);
         */

        /*
         * @Query("SELECT c FROM Contenido c JOIN c.categoria ca WHERE LOWER(ca.nombre) = LOWER(:nombreCategoria) AND LOWER(c.titulo) LIKE %:titulo% AND c.activado = :activado"
         * )
         * Page<Contenido> obtenerContenidoPorNombreCategoriaYTituloPaginadoYActivado(
         *
         * @Param("nombreCategoria") String nombreCategoria,
         *
         * @Param("titulo") String titulo,
         *
         * @Param("activado") boolean activado,
         * Pageable pageable);
         */

        /*
         * @Query("SELECT c FROM Contenido c JOIN c.categoria ca " +
         * "WHERE LOWER(ca.nombre) = LOWER(:nombreCategoria) " +
         * "AND LOWER(c.titulo) LIKE %:titulo% " +
         * "AND c.activado = :activado")
         * Page<Contenido> obtenerContenidoPorNombreCategoriaYTituloPaginadoYActivado(
         * 
         * @Param("nombreCategoria") String nombreCategoria,
         * 
         * @Param("titulo") String titulo,
         * 
         * @Param("activado") boolean activado,
         * Pageable pageable);
         * 
         * @Query("SELECT c FROM Contenido c JOIN c.categoria ca " +
         * "WHERE LOWER(ca.nombre) = LOWER(:nombreCategoria) " +
         * "AND LOWER(c.titulo) LIKE %:titulo% " +
         * "AND (:activado IS NULL OR c.activado = :activado)")
         * Page<Contenido> obtenerContenidoPorNombreCategoriaYTituloPaginadoYActivado(
         * 
         * @Param("nombreCategoria") String nombreCategoria,
         * 
         * @Param("titulo") String titulo,
         * 
         * @Param("activado") Boolean activado,
         * Pageable pageable);
         * 
         * boolean existsByTitulo(String titulo);
         */

        // Page<Contenido> findAll(Pageable pageable);

        /*
         * Page<Contenido>
         * findByCategoriaNombreAndTituloContainingIgnoreCaseAndActivado(
         * String nombreCategoria, String titulo, Boolean activado, Pageable pageable);
         */
        /*
         * Page<Contenido> findByCategoriaNombreAndTituloContainingIgnoreCase2(
         * String nombreCategoria, String titulo, Pageable pageable);
         */

        /*
         * Page<Contenido> findAllByActivadoTrue(Pageable pageable);
         * 
         * Page<Contenido> findAllByActivadoFalse(Pageable pageable);
         * 
         * @Query("SELECT c FROM Contenido c WHERE c.categoria.id = :categoriaId AND c.activado = true"
         * )
         * List<Contenido> findByCategoriaIdAndActivadoTrue(@Param("categoriaId") Long
         * categoriaId);
         * 
         * @Query("SELECT c FROM Contenido c WHERE c.categoria.id = :categoriaId AND c.activado = false"
         * )
         * List<Contenido> findByCategoriaIdAndActivadoFalse(@Param("categoriaId") Long
         * categoriaId);
         * 
         * Page<Contenido> findByCategoriaNombre(String nombreCategoria, Pageable
         * pageable);
         * 
         * Page<Contenido>
         * findByCategoriaNombreAndTituloContainingIgnoreCaseAndActivadoTrue(
         * String categoria, String titulo, Pageable pageable);
         * 
         * Page<Contenido> findByCategoriaNombreAndActivadoTrue(String categoria,
         * Pageable pageable);
         * 
         * Page<Contenido> findByTituloContainingIgnoreCaseAndActivadoTrue(String
         * titulo, Pageable pageable);
         * 
         * @Query("SELECT c FROM Contenido c WHERE c.activado = false AND c.rol = 'DOCENTE'"
         * )
         * List<Contenido> findContenidosDesactivadosDocente();
         * 
         * @Query("SELECT c FROM Contenido c WHERE c.activado = true AND c.rol = 'DOCENTE'"
         * )
         * List<Contenido> findContenidosActivadosDocente();
         * 
         * @Query("SELECT c FROM Contenido c WHERE c.activado = false")
         * List<Contenido> findContenidosDesactivados();
         */
/* } */
