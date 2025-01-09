package Plantilla.apirest.service;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import Plantilla.apirest.common.ICommonService;
import Plantilla.apirest.models.entity.Contenido;

public interface IContenidoService extends ICommonService<Contenido> {

        boolean contenidoExiste(Long id);

        List<Contenido> findByCategoriaId(Long categoriaId);

        Page<Contenido> buscarPorCategoriaYPorTitulo(Long categoriaId, String titulo, Pageable pageable);

        Page<Contenido> buscarPorNombreCategoriaYPorTitulo(String nombreCategoria, String titulo, Pageable pageable);

        Page<Contenido> obtenerContenidosPaginados2(
                        String nombreCategoria,
                        String titulo,
                        Boolean activado,
                        int page,
                        int size);

        Page<Contenido> obtenerContenidosPorCategoria(String nombreCategoria, boolean activado, int page, int size);

        Page<Contenido> obtenerContenidosPorCategoria(String nombreCategoria, int page, int size);

        List<Contenido> findAllContenidos();

        // ********************************************************

        // 11.

        // Page<Contenido> buscarContenidosPorCategoriaUsuarioYActivado(String
        // nombreCategoria, Long usuarioId,
        // Boolean activado, Pageable pageable);

        // 22.
        Page<Contenido> buscarPorCategoriaUsuario(String nombreCategoria, Long usuarioId, Pageable pageable);

        // 33.
        public Page<Contenido> obtenerContenidoDesactivadoPorUsuario(Long usuarioId, Pageable pageable);

        // 44.
        public Page<Contenido> obtenerContenidoActivadoPorUsuario(Long usuarioId, Pageable pageable);

        // 55.
        // public Page<Contenido> findContenidosByUsuarioId(Long usuarioId, Pageable
        // pageable);

        // 66.
        public Page<Contenido> findByCategoriaNombre(String nombreCategoria, Pageable pageable);

        // 77.
        public Page<Contenido> findByCategoriaNombreAndActivado(String nombreCategoria, Boolean activado,
                        Pageable pageable);

        public Page<Contenido> findByCategoriaNombreAndActivadoAndUsuarioIdIsNull(String nombreCategoria,
                        Long usuarioId, Pageable pageable);

        public boolean existsContenido(String nombreCategoria, Long usuarioId, Long contenidoId);

        public List<Contenido> findContenidosByUsuarioId(Long usuarioId);
}