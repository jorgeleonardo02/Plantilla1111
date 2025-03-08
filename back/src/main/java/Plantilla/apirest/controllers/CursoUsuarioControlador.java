package Plantilla.apirest.controllers;

import java.util.HashMap;
import java.util.List;
//import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import Plantilla.apirest.common.CommonRestController;
import Plantilla.apirest.models.dao.ICursoUsuarioDao;
import Plantilla.apirest.models.dto.CategoriaDto;
import Plantilla.apirest.models.dto.CursoDto;
import Plantilla.apirest.models.dto.CursoUsuarioDto3;
import Plantilla.apirest.models.entity.Curso;
import Plantilla.apirest.models.entity.CursoUsuario;
import Plantilla.apirest.seguridad.entidad.Usuario;
import Plantilla.apirest.service.ICursoService;
import Plantilla.apirest.service.ICursoUsuarioServicio;
import Plantilla.apirest.service.IUsuarioService;

//@CrossOrigin(origins = { "http://localhost:4200", "*" })
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/cursoUsuario")
@RestController
public class CursoUsuarioControlador extends CommonRestController<CursoUsuario, ICursoUsuarioServicio> {

    private final Logger log = LoggerFactory.getLogger(getClass());
    boolean tieneRolDocente;
    Usuario usuario;

    @Autowired
    ICursoService iCursoServicio;

    @Autowired
    IUsuarioService iUsuarioService;

    @Autowired
    private ICursoUsuarioDao iCursoUsuarioDao;

    @Autowired
    private ICursoUsuarioServicio iCursoUsuarioServicio;


    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Curso>> getCursosByUsuarioId(@PathVariable Long usuarioId) {
        List<Curso> cursos = iCursoUsuarioDao.findByUsuarioId(usuarioId);

        // Valida si hay resultados
        if (cursos.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(cursos);
    }

    @GetMapping("/rolDocente/{contenidoId}")
    public ResponseEntity<CursoUsuario> getCursoUsuarioByRolDocente(@PathVariable Long contenidoId) {
        Optional<CursoUsuario> cursoUsuario = iCursoUsuarioDao.CursoUsuarioPorRolDocente(contenidoId);
        if (cursoUsuario.isPresent()) {
            return ResponseEntity.ok(cursoUsuario.get());
        } else {
            // Manejar el caso en el que no se encuentre un resultado
            return ResponseEntity.notFound().build();
        }
    }

    @Override
    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCENTE') or hasRole('ESTUDIANTE')")
    public ResponseEntity<?> guardarElemento(@RequestBody CursoUsuario cursoUsuario) {
        // Obtener el usuario de alguna manera, por ejemplo, a través de un repositorio
        Usuario usuario = iUsuarioService.buscarPorUsuarioNombre(cursoUsuario.getUsuario().getNombreUsuario())
                .orElse(null);
        if (usuario == null) {
            return ResponseEntity.badRequest().body("El usuario no fue encontrado");
        }

        // Obtener el contenido por su ID si está presente
        Curso curso = null;
        if (cursoUsuario.getCurso() != null && cursoUsuario.getCurso().getId() != null) {
            Long cursoId = cursoUsuario.getCurso().getId();
            curso = iCursoServicio.obtenerElementoPorID(cursoId);
            if (curso == null) {
                return ResponseEntity.badRequest().body("El curso no fue encontrado");
            }
        }

        // Verificar si el usuario ya está suscrito como ESTUDIANTE al contenido
        boolean usuarioYaEsEstudiante = iCursoUsuarioDao.existeRelacionUsuarioCurso(curso.getId(),
                usuario.getId());
        if (usuarioYaEsEstudiante) {
            return ResponseEntity.badRequest().body("El usuario ya está suscrito a este curso como ESTUDIANTE");
        }

        // Verificar si el contenido existe y tiene una lista de contenido-usuario
        if (curso != null && curso.getListaCursoUsuario() != null) {
            // Verificar si ya existe un usuario con rol Docente asociado al contenido
            /*
             * boolean existeDocente = contenido.getListaContenidoUsuario().stream()
             * .anyMatch(cu -> cu.getUsuario() != null &&
             * cu.getUsuario().tieneRolDocente());
             */

            // Consulta si existe ya la relacion de este contenido con usuario rol Docente
            boolean existeDocente1 = iCursoUsuarioDao
                    .existeCursoConDocente(curso.getId());

            if (existeDocente1 && usuario.tieneRolDocente()) {
                // Si ya existe un usuario con rol docente y el usuario actual también tiene ese
                // rol, retornar un error
                return ResponseEntity.badRequest().body("Ya existe un usuario con rol Docente asociado al curso");
            } else if (usuario.tieneRolEstudiante()) {
                // Si el usuario es estudiante, permitir guardar la relación
                // Aquí puedes agregar la lógica para guardar la relación en la base de datos
                return super.guardarElemento(cursoUsuario);
            } else {
                // Verificar otros casos
                if (usuario.tieneRolVisitante()) {
                    return ResponseEntity.badRequest().body("No puede asociar un usuario con rol vitrina al curso");
                } else if (usuario.tieneRolGerencia()) {
                    return ResponseEntity.badRequest()
                            .body("No puede relacionar un usuario de rol Gerencia al curso");
                } else {
                    /*
                     * boolean usuarioYaExisteEnContenido =
                     * contenido.getListaContenidoUsuario().stream()
                     * .anyMatch(cu -> cu.getUsuario() != null && cu.getUsuario().equals(usuario));
                     */

                    boolean usuarioYaExisteEnContenido1 = iCursoUsuarioDao
                            .existeRelacionUsuarioCurso(curso.getId(), usuario.getId());

                    if (usuarioYaExisteEnContenido1) {
                        return ResponseEntity.badRequest()
                                .body("Ya existe una relación entre el usuario y el curso");
                    }
                }
            }
        }

        // Verificar si el usuario existe y tiene el rol Docente
        if (usuario != null) {
            boolean tieneRolDocente = usuario.tieneRolDocente();

            if (tieneRolDocente) {
                // El usuario tiene el rol "ROLE_DOCENTE"
                log.info("------El usuario tiene el rol de Docente-------");
            } else {
                // El usuario no tiene el rol "ROLE_DOCENTE"
                log.info("------El usuario no tiene el rol de Docente-------");
            }
        } else {
            // El usuario no se encontró en la base de datos
            log.info("------El usuario no existe-------");
        }

        // Llamar al método guardarElemento con el objeto ContenidoUsuarioDto
        return super.guardarElemento(cursoUsuario);
    }

    @GetMapping("/cantidadCursos/{usuarioId}")
    public ResponseEntity<?> cantidadCursosDeDocente(@PathVariable Long usuarioId) {
        Map<String, Object> mapa = new HashMap<>();
        Long cantidad = iCursoUsuarioDao.cantidadCursosDeDocente(usuarioId);
        Long limiteCursos = iUsuarioService.obtenerElementoPorID(usuarioId).getLimiteCursos();
        log.info("idUsuario: " + usuarioId + ", limiteCursos:" + limiteCursos);
        if (cantidad != null && cantidad < limiteCursos) {
            return ResponseEntity.ok(cantidad);
        } else {
            // armo el mapa para agregarlo al ResponseEntity
            mapa.put("error", "Ha ocurrido un error, ya llego al límite de contenidos por docentes");
            return new ResponseEntity<>(mapa, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/usuarios1/{usuarioId}/contenidos")
    public ResponseEntity<Page<CursoUsuarioDto3>> obtenerContenidosPorUsuarioId1(
            @PathVariable Long usuarioId,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<CursoUsuario> pageCursos = iCursoUsuarioServicio.obtenerCursosPorUsuarioId(usuarioId,
                pageable);

        Page<CursoUsuarioDto3> pageCursosDTO = pageCursos.map(cursoUsuario -> {
            Curso curso = cursoUsuario.getCurso();
            CursoDto cursoDTO = new CursoDto(
                curso.getId(),
                curso.getNombreFoto(),
                curso.getNombre(),
                curso.getDescripcion(),
                curso.getEtiquetas(),
                curso.getFechaLimite(),
                curso.getListaHabilidades(),
                curso.getMatriculados(),
                curso.getActivado(),
                curso.getPrecio(),
                curso.getPorcentajeAdmin(),
                curso.getCalificacion(),
                    new CategoriaDto(curso.getCategoria().getId(), curso.getCategoria().getNombre()));
            return new CursoUsuarioDto3(cursoUsuario.getId(), cursoDTO);
        });

        return new ResponseEntity<>(pageCursosDTO, HttpStatus.OK);
    }

    @GetMapping("/usuarios/cursos/{usuarioId}")
    public ResponseEntity<Page<Curso>> obtenerCursosPorUsuarioIdPaginado(
            @PathVariable Long usuarioId,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Curso> pageCursos = iCursoUsuarioServicio.obtenerCursosPorUsuarioIdPaginado(usuarioId,
                pageable);
        return new ResponseEntity<>(pageCursos, HttpStatus.OK);
    }

}
