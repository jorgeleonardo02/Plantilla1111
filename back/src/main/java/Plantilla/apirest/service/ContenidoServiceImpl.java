package Plantilla.apirest.service;
import java.util.List;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import Plantilla.apirest.common.CommonServiceImpl;
import Plantilla.apirest.models.dao.IContenidoDao;
import Plantilla.apirest.models.dao.IContenidoRepository;
import Plantilla.apirest.models.entity.Contenido;

@Service
@Transactional
public class ContenidoServiceImpl extends CommonServiceImpl<Contenido, IContenidoDao> implements IContenidoService {

    
    private final IContenidoRepository contenidoRepository;

    public ContenidoServiceImpl(IContenidoDao iContenidoDao, IContenidoRepository contenidoRepository,
            ModelMapper modelMapper) {
        super(iContenidoDao); // Pasa iContenidoDao al constructor de la superclase
        this.contenidoRepository = contenidoRepository;
    }

    public boolean contenidoExiste(Long id) {
        return contenidoRepository.existsById(id);
    }

    public boolean existsContenido(String nombreCategoria, Long usuarioId, Long contenidoId) {
        return contenidoRepository.existsByCategoriaNombreAndActivadoAndUsuarioIdIsNullAndContenidoId(nombreCategoria,
                usuarioId, contenidoId);
    }

    public List<Contenido> obtenerContenidosActivadosPorDocente(Long userId) {
        return contenidoRepository.encontrarContenidosActivadosPorDocente(userId);
    }

    public List<Contenido> obtenerContenidosDesactivadosPorDocente(Long userId) {
        return contenidoRepository.encontrarContenidosDesactivadosPorDocente(userId);
    }

    public List<Contenido> obtenerContenidosPorDocente(Long userId) {
        return contenidoRepository.encontrarContenidosPorDocente(userId);
    }

    @Override
    public List<Contenido> findAllContenidos() {
        return contenidoRepository.findAll();
    }

    @Override
    public List<Contenido> findByCategoriaId(Long categoriaId) {
        return contenidoRepository.findByCategoriaId(categoriaId);
    }

    @Override
    public Page<Contenido> buscarPorCategoriaYPorTitulo(Long categoriaId, String nombreCurso, Pageable pageable) {
        return contenidoRepository.findByCategoriaIdAndNombreCursoContainingIgnoreCase(categoriaId, nombreCurso, pageable);
    }

    @Override
    public Page<Contenido> buscarPorNombreCategoriaYPorTitulo(String nombreCategoria, String nombreCurso,
            Pageable pageable) {
        return contenidoRepository.findByCategoriaNombreAndNombreContainingIgnoreCase(nombreCategoria, nombreCurso,
                pageable);
    }

    public Page<Contenido> obtenerContenidosPaginados(String nombreCategoria, String nombreCurso, Boolean activado, int page,
            int size) {
        Pageable pageable = PageRequest.of(page, size);

        if (nombreCategoria != null && nombreCurso != null && activado != null) {
            return contenidoRepository.findByCategoriaNombreAndNombreContainingIgnoreCaseAndActivado(nombreCategoria,
                    nombreCurso,
                    activado, pageable);
        }

        return contenidoRepository.findAll(pageable);
    }

    @Override
    public Page<Contenido> obtenerContenidosPaginados2(String nombreCategoria, String titulo, Boolean activado,
            int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        if (nombreCategoria != null && titulo != null && activado != null) {
            return contenidoRepository.findByCategoriaNombreAndNombreContainingIgnoreCaseAndActivado(
                    nombreCategoria, titulo, activado, pageable);
        } else if (nombreCategoria != null && titulo != null) {
            return contenidoRepository.findByCategoriaNombreAndNombreCursoContainingIgnoreCase1(
                    nombreCategoria, titulo, pageable);
        } else if (activado != null) {
            if (activado) {
                return contenidoRepository.findAllByActivadoTrue(pageable);
            } else {
                return contenidoRepository.findAllByActivadoFalse(pageable);
            }
        } else {
            return contenidoRepository.findAll(pageable);
        }
    }

    @Override
    public Page<Contenido> obtenerContenidosPorCategoria(String nombreCategoria, boolean activado, int page, int size) {
        return contenidoRepository.obtenerContenidoPorNombreCategoriaYNombreCursoPaginadoYActivado(
                nombreCategoria, "", activado, PageRequest.of(page, size));
    }

    @Override
    public Page<Contenido> obtenerContenidosPorCategoria(String nombreCategoria, int page, int size) {
        return contenidoRepository.findByCategoriaNombre(nombreCategoria, PageRequest.of(page, size));
    }

    // ********************************************************************************
    // 11.
   

    // 22.
    public Page<Contenido> buscarPorCategoriaUsuario(String nombreCategoria, Long usuarioId, Pageable pageable) {
        return contenidoRepository.findByCategoriaNombreAndUsuarioId(nombreCategoria,
                usuarioId, pageable);
    }

    // 33.
    public Page<Contenido> obtenerContenidoDesactivadoPorUsuario(Long usuarioId, Pageable pageable) {
        return contenidoRepository.findContenidoByUsuarioIdAndActivadoFalse(usuarioId,
                pageable);
    }

    // 44.
    public Page<Contenido> obtenerContenidoActivadoPorUsuario(Long usuarioId, Pageable pageable) {
        return contenidoRepository.findContenidoByUsuarioIdAndActivadoTrue(usuarioId, pageable);
    }

    // 55.
    
    // 66.
    @Override
    public Page<Contenido> findByCategoriaNombre(String nombreCategoria, Pageable pageable) {
        return contenidoRepository.findByCategoriaNombre1(nombreCategoria, pageable);
    }

    // 77.
    @Override
    public Page<Contenido> findByCategoriaNombreAndActivado(String nombreCategoria, Boolean activado,
            Pageable pageable) {
        return contenidoRepository.findByCategoriaNombreAndActivado(nombreCategoria, activado, pageable);
    }

    @Override
    public Page<Contenido> findByCategoriaNombreAndActivadoAndUsuarioIdIsNull(String nombreCategoria, Long usuarioId,
            Pageable pageable) {
        return contenidoRepository.findByCategoriaNombreAndActivadoAndUsuarioIdIsNull(
                nombreCategoria, usuarioId, pageable);
    }

    public List<Contenido> findContenidosByUsuarioId(Long usuarioId) {
        // Llama al repositorio para obtener los contenidos
        return contenidoRepository.findContenidosByUsuarioId(usuarioId);
    }

}