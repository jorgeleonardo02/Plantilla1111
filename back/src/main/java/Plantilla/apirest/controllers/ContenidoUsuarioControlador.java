package Plantilla.apirest.controllers;

import java.util.HashMap;
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
import Plantilla.apirest.models.dao.IContenidoUsuarioDao;
import Plantilla.apirest.models.dto.CategoriaDto;
import Plantilla.apirest.models.dto.ContenidoDto;
import Plantilla.apirest.models.dto.ContenidoUsuarioDto3;
import Plantilla.apirest.models.entity.Contenido;
import Plantilla.apirest.models.entity.ContenidoUsuario;
import Plantilla.apirest.seguridad.entidad.Usuario;
import Plantilla.apirest.service.IContenidoService;
import Plantilla.apirest.service.IContenidoUsuarioServicio;
import Plantilla.apirest.service.IUsuarioService;

//@CrossOrigin(origins = { "http://localhost:4200", "*" })
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/contenidoUsuario")
@RestController
public class ContenidoUsuarioControlador extends CommonRestController<ContenidoUsuario, IContenidoUsuarioServicio> {

    private final Logger log = LoggerFactory.getLogger(getClass());
    boolean tieneRolDocente;
    Usuario usuario;

    @Autowired
    IContenidoService iContenidoServicio;

    @Autowired
    IUsuarioService iUsuarioService;

    @Autowired
    private IContenidoUsuarioDao iContenidoUsuarioDao;

    @Autowired
    private IContenidoUsuarioServicio iContenidoUsuarioServicio;

    @GetMapping("/rolDocente/{contenidoId}")
    public ResponseEntity<ContenidoUsuario> getContenidoUsuarioByRolDocente(@PathVariable Long contenidoId) {
        Optional<ContenidoUsuario> contenidoUsuario = iContenidoUsuarioDao.ContenidoUsuarioPorRolDocente(contenidoId);
        if (contenidoUsuario.isPresent()) {
            return ResponseEntity.ok(contenidoUsuario.get());
        } else {
            // Manejar el caso en el que no se encuentre un resultado
            return ResponseEntity.notFound().build();
        }
    }

    /*
     * @Override
     * 
     * @PostMapping
     * 
     * @PreAuthorize("hasRole('ADMIN') or hasRole('DOCENTE') or hasRole('ESTUDIANTE')"
     * )
     * public ResponseEntity<?> guardarElemento(@RequestBody ContenidoUsuario
     * contenidoUsuario) {
     * // Obtener el usuario de alguna manera, por ejemplo, a través de un
     * repositorio
     * Usuario usuario =
     * iUsuarioService.buscarPorUsuarioNombre(contenidoUsuario.getUsuario().
     * getNombreUsuario())
     * .orElse(null);
     * if (usuario == null) {
     * return ResponseEntity.badRequest().body("El usuario no fue encontrado");
     * }
     * 
     * // Obtener el contenido por su ID si está presente
     * Contenido contenido = null;
     * if (contenidoUsuario.getContenido() != null &&
     * contenidoUsuario.getContenido().getId() != null) {
     * Long contenidoId = contenidoUsuario.getContenido().getId();
     * contenido = iContenidoServicio.obtenerElementoPorID(contenidoId);
     * if (contenido == null) {
     * return ResponseEntity.badRequest().body("El contenido no fue encontrado");
     * }
     * }
     * 
     * // Verificar si el contenido existe y tiene una lista de contenido-usuario
     * if (contenido != null && contenido.getListaContenidoUsuario() != null) {
     * // Verificar si ya existe un usuario con rol Docente asociado al contenido
     * boolean existeDocente = contenido.getListaContenidoUsuario().stream()
     * .anyMatch(cu -> cu.getUsuario() != null &&
     * cu.getUsuario().tieneRolDocente());
     * 
     * // Consulta si existe ya la relacion de este contenido con usuario rol
     * Docente
     * boolean existeDocente1 = iContenidoUsuarioDao
     * .existeContenidoConDocente(contenido.getId());
     * 
     * if (existeDocente1 && usuario.tieneRolDocente()) {
     * // Si ya existe un usuario con rol docente y el usuario actual también tiene
     * ese
     * // rol, retornar un error
     * return ResponseEntity.badRequest().
     * body("Ya existe un usuario con rol Docente asociado al contenido");
     * } else if (usuario.tieneRolEstudiante()) {
     * // Si el usuario es estudiante, permitir guardar la relación
     * // Aquí puedes agregar la lógica para guardar la relación en la base de datos
     * return super.guardarElemento(contenidoUsuario);
     * } else {
     * // Verificar otros casos
     * if (usuario.tieneRolVisitante()) {
     * return ResponseEntity.badRequest().
     * body("No puede asociar un usuario con rol vitrina al contenido");
     * } else if (usuario.tieneRolGerencia()) {
     * return ResponseEntity.badRequest()
     * .body("No puede relacionar un usuario de rol Gerencia al contenido");
     * } else {
     * boolean usuarioYaExisteEnContenido =
     * contenido.getListaContenidoUsuario().stream()
     * .anyMatch(cu -> cu.getUsuario() != null && cu.getUsuario().equals(usuario));
     * 
     * boolean usuarioYaExisteEnContenido1 = iContenidoUsuarioDao
     * .existeRelacionUsuarioContenido(contenido.getId(), usuario.getId());
     * 
     * if (usuarioYaExisteEnContenido1) {
     * return ResponseEntity.badRequest()
     * .body("Ya existe una relación entre el usuario y el contenido");
     * }
     * }
     * }
     * }
     * 
     * // Verificar si el usuario existe y tiene el rol Docente
     * if (usuario != null) {
     * boolean tieneRolDocente = usuario.tieneRolDocente();
     * 
     * if (tieneRolDocente) {
     * // El usuario tiene el rol "ROLE_DOCENTE"
     * log.info("------El usuario tiene el rol de Docente-------");
     * } else {
     * // El usuario no tiene el rol "ROLE_DOCENTE"
     * log.info("------El usuario no tiene el rol de Docente-------");
     * }
     * } else {
     * // El usuario no se encontró en la base de datos
     * log.info("------El usuario no existe-------");
     * }
     * 
     * // Llamar al método guardarElemento con el objeto ContenidoUsuarioDto
     * return super.guardarElemento(contenidoUsuario);
     * }
     */

    @Override
    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCENTE') or hasRole('ESTUDIANTE')")
    public ResponseEntity<?> guardarElemento(@RequestBody ContenidoUsuario contenidoUsuario) {
        // Obtener el usuario de alguna manera, por ejemplo, a través de un repositorio
        Usuario usuario = iUsuarioService.buscarPorUsuarioNombre(contenidoUsuario.getUsuario().getNombreUsuario())
                .orElse(null);
        if (usuario == null) {
            return ResponseEntity.badRequest().body("El usuario no fue encontrado");
        }

        // Obtener el contenido por su ID si está presente
        Contenido contenido = null;
        if (contenidoUsuario.getContenido() != null && contenidoUsuario.getContenido().getId() != null) {
            Long contenidoId = contenidoUsuario.getContenido().getId();
            contenido = iContenidoServicio.obtenerElementoPorID(contenidoId);
            if (contenido == null) {
                return ResponseEntity.badRequest().body("El contenido no fue encontrado");
            }
        }

        // Verificar si el usuario ya está suscrito como ESTUDIANTE al contenido
        boolean usuarioYaEsEstudiante = iContenidoUsuarioDao.existeRelacionUsuarioContenido(contenido.getId(),
                usuario.getId());
        if (usuarioYaEsEstudiante) {
            return ResponseEntity.badRequest().body("El usuario ya está suscrito a este contenido como ESTUDIANTE");
        }

        // Verificar si el contenido existe y tiene una lista de contenido-usuario
        if (contenido != null && contenido.getListaContenidoUsuario() != null) {
            // Verificar si ya existe un usuario con rol Docente asociado al contenido
            /*
             * boolean existeDocente = contenido.getListaContenidoUsuario().stream()
             * .anyMatch(cu -> cu.getUsuario() != null &&
             * cu.getUsuario().tieneRolDocente());
             */

            // Consulta si existe ya la relacion de este contenido con usuario rol Docente
            boolean existeDocente1 = iContenidoUsuarioDao
                    .existeContenidoConDocente(contenido.getId());

            if (existeDocente1 && usuario.tieneRolDocente()) {
                // Si ya existe un usuario con rol docente y el usuario actual también tiene ese
                // rol, retornar un error
                return ResponseEntity.badRequest().body("Ya existe un usuario con rol Docente asociado al contenido");
            } else if (usuario.tieneRolEstudiante()) {
                // Si el usuario es estudiante, permitir guardar la relación
                // Aquí puedes agregar la lógica para guardar la relación en la base de datos
                return super.guardarElemento(contenidoUsuario);
            } else {
                // Verificar otros casos
                if (usuario.tieneRolVisitante()) {
                    return ResponseEntity.badRequest().body("No puede asociar un usuario con rol vitrina al contenido");
                } else if (usuario.tieneRolGerencia()) {
                    return ResponseEntity.badRequest()
                            .body("No puede relacionar un usuario de rol Gerencia al contenido");
                } else {
                    /*
                     * boolean usuarioYaExisteEnContenido =
                     * contenido.getListaContenidoUsuario().stream()
                     * .anyMatch(cu -> cu.getUsuario() != null && cu.getUsuario().equals(usuario));
                     */

                    boolean usuarioYaExisteEnContenido1 = iContenidoUsuarioDao
                            .existeRelacionUsuarioContenido(contenido.getId(), usuario.getId());

                    if (usuarioYaExisteEnContenido1) {
                        return ResponseEntity.badRequest()
                                .body("Ya existe una relación entre el usuario y el contenido");
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
        return super.guardarElemento(contenidoUsuario);
    }

    @GetMapping("/cantidadContenidos/{usuarioId}")
    public ResponseEntity<?> cantidadContenidosDeDocente(@PathVariable Long usuarioId) {
        Map<String, Object> mapa = new HashMap<>();
        Long cantidad = iContenidoUsuarioDao.cantidadContenidosDeDocente(usuarioId);
        Long limiteContenidos = iUsuarioService.obtenerElementoPorID(usuarioId).getLimiteContenidos();
        log.info("idUsuario: " + usuarioId + ", limiteContenidos:" + limiteContenidos);
        if (cantidad != null && cantidad < limiteContenidos) {
            return ResponseEntity.ok(cantidad);
        } else {
            // armo el mapa para agregarlo al ResponseEntity
            mapa.put("error", "Ha ocurrido un error, ya llego al límite de contenidos por docentes");
            return new ResponseEntity<>(mapa, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/usuarios1/{usuarioId}/contenidos")
    public ResponseEntity<Page<ContenidoUsuarioDto3>> obtenerContenidosPorUsuarioId1(
            @PathVariable Long usuarioId,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ContenidoUsuario> pageContenidos = iContenidoUsuarioServicio.obtenerContenidosPorUsuarioId(usuarioId,
                pageable);

        Page<ContenidoUsuarioDto3> pageContenidosDTO = pageContenidos.map(contenidoUsuario -> {
            Contenido contenido = contenidoUsuario.getContenido();
            ContenidoDto contenidoDTO = new ContenidoDto(
                    contenido.getId(),
                    contenido.getNombreFoto(),
                    contenido.getTitulo(),
                    contenido.getDescripcion(),
                    contenido.getEtiquetas(),
                    contenido.getFechaLimite(),
                    contenido.getPrograma(),
                    contenido.getMatriculados(),
                    contenido.getActivado(),
                    contenido.getPrecio(),
                    contenido.getPorcentajeAdmin(),
                    contenido.getCalificacion(),
                    new CategoriaDto(contenido.getCategoria().getId(), contenido.getCategoria().getNombre()));
            return new ContenidoUsuarioDto3(contenidoUsuario.getId(), contenidoDTO);
        });

        return new ResponseEntity<>(pageContenidosDTO, HttpStatus.OK);
    }

    @GetMapping("/usuarios/contenidos/{usuarioId}")
    public ResponseEntity<Page<Contenido>> obtenerContenidosPorUsuarioIdPaginado(
            @PathVariable Long usuarioId,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Contenido> pageContenidos = iContenidoUsuarioServicio.obtenerContenidosPorUsuarioIdPaginado(usuarioId,
                pageable);
        return new ResponseEntity<>(pageContenidos, HttpStatus.OK);
    }

}
