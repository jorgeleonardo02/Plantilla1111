package Plantilla.apirest.service;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import Plantilla.apirest.common.ICommonService;
import Plantilla.apirest.models.entity.Curso;

public interface ICursoService extends ICommonService<Curso> {

        boolean cursoExiste(Long id);

        List<Curso> findByCategoriaId(Long categoriaId);

        Page<Curso> buscarPorCategoriaYPorNombreCurso(Long categoriaId, String nombreCurso, Pageable pageable);

        Page<Curso> buscarPorNombreCategoriaYPorNombreCurso(String nombreCategoria, String nombreCurso, Pageable pageable);

        Page<Curso> obtenerCursosPaginados2(
                        String nombreCategoria,
                        String nombreCurso,
                        Boolean activado,
                        int page,
                        int size);

        Page<Curso> obtenerCursosPorCategoria(String nombreCategoria, boolean activado, int page, int size);

        Page<Curso> obtenerCursosPorCategoria(String nombreCategoria, int page, int size);

        List<Curso> findAllCursos();

        // ********************************************************

        // 11.

        // Page<Contenido> buscarContenidosPorCategoriaUsuarioYActivado(String
        // nombreCategoria, Long usuarioId,
        // Boolean activado, Pageable pageable);

        // 22.
        Page<Curso> buscarPorCategoriaUsuario(String nombreCategoria, Long usuarioId, Pageable pageable);

        // 33.
        public Page<Curso> obtenerCursoDesactivadoPorUsuario(Long usuarioId, Pageable pageable);

        // 44.
        public Page<Curso> obtenerCursoActivadoPorUsuario(Long usuarioId, Pageable pageable);

        // 66.
        public Page<Curso> findByCategoriaNombre(String nombreCategoria, Pageable pageable);

        // 77.
        public Page<Curso> findByCategoriaNombreAndActivado(String nombreCategoria, Boolean activado,
                        Pageable pageable);

        public Page<Curso> findByCategoriaNombreAndActivadoAndUsuarioIdIsNull(String nombreCategoria,
                        Long usuarioId, Pageable pageable);

        public boolean existsCurso(String nombreCategoria, Long usuarioId, Long contenidoId);

        public List<Curso> findCursoByUsuarioId(Long usuarioId);
}