package Plantilla.apirest.service;
import java.util.List;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import Plantilla.apirest.common.CommonServiceImpl;
import Plantilla.apirest.models.dao.ICursoRepository;
import Plantilla.apirest.models.entity.Curso;

@Service
@Transactional
public class CursoServiceImpl extends CommonServiceImpl<Curso, ICursoRepository> implements ICursoService {

    
    private final ICursoRepository cursoRepository;

    public CursoServiceImpl(ICursoRepository cursoRepository,
            ModelMapper modelMapper) {
        super(cursoRepository); // Pasa iContenidoDao al constructor de la superclase
        this.cursoRepository = cursoRepository;
    }

    public boolean cursoExiste(Long id) {
        return cursoRepository.existsById(id);
    }

    public boolean existsCurso(String nombreCategoria, Long usuarioId, Long contenidoId) {
        return cursoRepository.existsByCategoriaNombreAndActivadoAndUsuarioIdIsNullAndCursoId(nombreCategoria,
                usuarioId, contenidoId);
    }

    public List<Curso> obtenerCursosActivadosPorDocente(Long userId) {
        return cursoRepository.encontrarCursosActivadosPorDocente(userId);
    }

    public List<Curso> obtenerCursosDesactivadosPorDocente(Long userId) {
        return cursoRepository.encontrarCursosDesactivadosPorDocente(userId);
    }

    public List<Curso> obtenerCursosPorDocente(Long userId) {
        return cursoRepository.encontrarCursosPorDocente(userId);
    }

    @Override
    public List<Curso> findAllCursos() {
        return cursoRepository.findAll();
    }

    @Override
    public List<Curso> findByCategoriaId(Long categoriaId) {
        return cursoRepository.findByCategoriaId(categoriaId);
    }

    @Override
    public Page<Curso> buscarPorCategoriaYPorNombreCurso(Long categoriaId, String nombreCurso, Pageable pageable) {
        return cursoRepository.findByCategoriaIdAndNombreCursoContainingIgnoreCase(categoriaId, nombreCurso, pageable);
    }

    @Override
    public Page<Curso> buscarPorNombreCategoriaYPorNombreCurso(String nombreCategoria, String nombreCurso,
            Pageable pageable) {
        return cursoRepository.findByCategoriaNombreAndNombreContainingIgnoreCase(nombreCategoria, nombreCurso,
                pageable);
    }

    public Page<Curso> obtenerCursosPaginados(String nombreCategoria, String nombreCurso, Boolean activado, int page,
            int size) {
        Pageable pageable = PageRequest.of(page, size);

        if (nombreCategoria != null && nombreCurso != null && activado != null) {
            return cursoRepository.findByCategoriaNombreAndNombreContainingIgnoreCaseAndActivado(nombreCategoria,
                    nombreCurso,
                    activado, pageable);
        }

        return cursoRepository.findAll(pageable);
    }

    @Override
    public Page<Curso> obtenerCursosPaginados2(String nombreCategoria, String titulo, Boolean activado,
            int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        if (nombreCategoria != null && titulo != null && activado != null) {
            return cursoRepository.findByCategoriaNombreAndNombreContainingIgnoreCaseAndActivado(
                    nombreCategoria, titulo, activado, pageable);
        } else if (nombreCategoria != null && titulo != null) {
            return cursoRepository.findByCategoriaNombreAndNombreCursoContainingIgnoreCase1(
                    nombreCategoria, titulo, pageable);
        } else if (activado != null) {
            if (activado) {
                return cursoRepository.findAllByActivadoTrue(pageable);
            } else {
                return cursoRepository.findAllByActivadoFalse(pageable);
            }
        } else {
            return cursoRepository.findAll(pageable);
        }
    }

    @Override
    public Page<Curso> obtenerCursosPorCategoria(String nombreCategoria, boolean activado, int page, int size) {
        return cursoRepository.obtenerContenidoPorNombreCategoriaYNombreCursoPaginadoYActivado(
                nombreCategoria, "", activado, PageRequest.of(page, size));
    }

    @Override
    public Page<Curso> obtenerCursosPorCategoria(String nombreCategoria, int page, int size) {
        return cursoRepository.findByCategoriaNombre(nombreCategoria, PageRequest.of(page, size));
    }

    // ********************************************************************************
    // 11.
   

    // 22.
    public Page<Curso> buscarPorCategoriaUsuario(String nombreCategoria, Long usuarioId, Pageable pageable) {
        return cursoRepository.findByCategoriaNombreAndUsuarioId(nombreCategoria,
                usuarioId, pageable);
    }

    // 33.
    public Page<Curso> obtenerCursoDesactivadoPorUsuario(Long usuarioId, Pageable pageable) {
        return cursoRepository.findCursoByUsuarioIdAndActivadoFalse(usuarioId,
                pageable);
    }

    // 44.
    public Page<Curso> obtenerCursoActivadoPorUsuario(Long usuarioId, Pageable pageable) {
        return cursoRepository.findCursoByUsuarioIdAndActivadoTrue(usuarioId, pageable);
    }

    // 55.
    
    // 66.
    @Override
    public Page<Curso> findByCategoriaNombre(String nombreCategoria, Pageable pageable) {
        return cursoRepository.findByCategoriaNombre1(nombreCategoria, pageable);
    }

    // 77.
    @Override
    public Page<Curso> findByCategoriaNombreAndActivado(String nombreCategoria, Boolean activado,
            Pageable pageable) {
        return cursoRepository.findByCategoriaNombreAndActivado(nombreCategoria, activado, pageable);
    }

    @Override
    public Page<Curso> findByCategoriaNombreAndActivadoAndUsuarioIdIsNull(String nombreCategoria, Long usuarioId,
            Pageable pageable) {
        return cursoRepository.findByCategoriaNombreAndActivadoAndUsuarioIdIsNull(
                nombreCategoria, usuarioId, pageable);
    }

    public List<Curso> findCursoByUsuarioId(Long usuarioId) {
        // Llama al repositorio para obtener los cursos
        return cursoRepository.findCursosByUsuarioId(usuarioId);
    }

}