package Plantilla.apirest.controllers;

import java.io.IOException;
import java.net.MalformedURLException;
//import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
//import java.util.stream.Collectors;

import javax.validation.Valid;

import org.modelmapper.AbstractConverter;
import org.modelmapper.Converter;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
//import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
//import org.springframework.data.support.PageableExecutionUtils;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
//import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import Plantilla.apirest.common.CommonRestController;
import Plantilla.apirest.models.dao.IContenidoDao;
import Plantilla.apirest.models.dao.IContenidoRepository;
import Plantilla.apirest.models.dao.IContenidoUsuarioDao;
import Plantilla.apirest.models.dto.CategoriaDto;
import Plantilla.apirest.models.dto.ContenidoDto;
import Plantilla.apirest.models.dto.ContenidoDto2;
import Plantilla.apirest.models.dto.ContenidoUsuarioDto;
import Plantilla.apirest.models.dto.UsuarioDto2;
import Plantilla.apirest.models.entity.Categoria;
import Plantilla.apirest.models.entity.Contenido;
import Plantilla.apirest.models.entity.ContenidoUsuario;
import Plantilla.apirest.rta.RespuestaDatos;
import Plantilla.apirest.seguridad.entidad.Usuario;
import Plantilla.apirest.seguridad.servicio.UserDetailsServicioImpl;
import Plantilla.apirest.seguridad.servicio.UsuarioServicio;
import Plantilla.apirest.service.ContenidoServiceImpl;
import Plantilla.apirest.service.ICategoriaService;
import Plantilla.apirest.service.IContenidoService;
import Plantilla.apirest.service.IContenidoUsuarioServicio;
import Plantilla.apirest.service.IRepositorioService;
import Plantilla.apirest.service.IUsuarioService;

/* @CrossOrigin(origins = { "http://localhost:4200", "*" }, exposedHeaders = { "Access-Control-Expose-Headers",
		"Content-Disposition" }) */
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/contenidos")
@RestController
public class ContenidoRestControllers extends CommonRestController<Contenido, IContenidoService> {

	private final Logger log = LoggerFactory.getLogger(getClass());
	private final IContenidoService iService;
	private final ModelMapper modelMapper;

	@Autowired
	IContenidoRepository iContenidoRepository;

	@Autowired
	UserDetailsServicioImpl userDetailsServicioImpl;

	@Autowired
	IContenidoDao iContenidoDao;

	@Autowired
	ICategoriaService iCategoriaService;

	@Autowired
	IContenidoService iContenidoService;

	@Autowired
	ContenidoServiceImpl contenidoServiceImp;

	@Autowired
	IRepositorioService iRepositorioService;

	@Autowired
	UsuarioServicio usuarioServicio;

	@Autowired
	IUsuarioService iUsuarioService;

	@Autowired
	IContenidoUsuarioServicio iContenidoUsuarioServicio;

	@Autowired
	IContenidoUsuarioDao iContenidoUsuarioDao;

	@Autowired
	private SimpMessagingTemplate messagingTemplate;

	public ContenidoRestControllers(IContenidoUsuarioServicio iContenidoUsuarioServicio, IContenidoService iService,
			ModelMapper modelMapper) {
		this.iContenidoUsuarioServicio = iContenidoUsuarioServicio;
		this.iService = iService;
		this.modelMapper = modelMapper;
	}

	@Autowired
	public ContenidoRestControllers(IContenidoService iService, ModelMapper modelMapper) {
		this.iService = iService;
		this.modelMapper = modelMapper;
		configurarModelMapper();
	}

	@GetMapping("/contenido-existe")
	public boolean contenidoExiste(@RequestParam Long id) {
		return iContenidoService.contenidoExiste(id);
	}

	@GetMapping("/{contenidoId}/existe")
	public ResponseEntity<Boolean> existsContenido(
			@RequestParam String nombreCategoria,
			@RequestParam Long usuarioId,
			@PathVariable Long contenidoId) {
		boolean exists = iContenidoService.existsContenido(nombreCategoria, usuarioId, contenidoId);
		return ResponseEntity.ok(exists);
	}

	@GetMapping("/contenidoFoto/{idContenido}")
	/* @PreAuthorize("hasRole('ADMIN')") */
	public ResponseEntity<?> obtenerFotoContenidoPorID(@PathVariable Long idContenido) {
		Contenido contenido = null;
		Map<String, Object> mapa = new HashMap<>();
		try {
			contenido = this.iContenidoService.obtenerElementoPorID(idContenido);
		} catch (DataAccessException e) {
			// armo el mapa para agregarlo al ResponseEntity
			mapa.put("mensaje", "Ha ocurrido un error al obtener el contenido con ID " + idContenido);
			mapa.put("error", e.getMessage() + ": " + e.getMostSpecificCause());
			return new ResponseEntity<>(mapa, HttpStatus.INTERNAL_SERVER_ERROR);
		}
		if (contenido == null || contenido.getNombreFoto() == null) {
			mapa.put("mensaje",
					"El contenido con ID " + idContenido + " no se encuentra registrado o no tiene imagen registrada");
			return new ResponseEntity<>(mapa, HttpStatus.NOT_FOUND);
		}
		Resource imagen = null;
		try {
			imagen = iRepositorioService.obtenerFoto(contenido.getNombreFoto());
		} catch (MalformedURLException e) {
			e.printStackTrace();
		}
		return ResponseEntity.ok()
				.header("Content-Disposition", contenido.getNombreFoto()) // en el header envío el nombre del archivo
																			// para poderlo usar en el Front
				.contentType(MediaType.IMAGE_JPEG).body(imagen);
	}

	@PostMapping("/contenidoFoto")
	@PreAuthorize("hasRole('ADMIN') or hasRole('DOCENTE')")
	public ResponseEntity<?> guardarContenidoConFoto(@Valid Contenido contenido,

			@RequestParam MultipartFile archivo, @RequestParam Long idCategoria)
			throws IOException {

		Contenido contenidoNuevo = null;
		Map<String, Object> mapa = new HashMap<>();
		String nombreFotoUnico = null;
		try {

			if (idCategoria == null || idCategoria <= 0) {
				// La ID de la categoría es nula, indefinida o no válida
				mapa.put("mensaje", "La ID de la categoría es inválida");
				return new ResponseEntity<>(mapa, HttpStatus.BAD_REQUEST);
			}
			if (!archivo.isEmpty()) {
				nombreFotoUnico = iRepositorioService.copiarfotoEnCarpeta(archivo);
				System.out.println("nombre de la foto: " + nombreFotoUnico);
				contenido.setNombreFoto(nombreFotoUnico);
			}
			Categoria categoria = this.iCategoriaService.obtenerElementoPorID(idCategoria);
			if (categoria == null) {
				// No se encontró la categoría correspondiente a la ID proporcionada
				mapa.put("mensaje", "La categoría no existe");
				return new ResponseEntity<>(mapa, HttpStatus.NOT_FOUND);
			}
			contenido.setCategoria(categoria);
			// contenido.setPorcentajeAdmin(0.2);
			log.info(
					"************************************************************************************************************************************");
			log.info(
					"************************************************************************************************************************************");
			log.info("contenido: {}", contenido.toString());
			log.info("precio: {}", contenido.getPrecio());
			log.info("contenido porcentaje: {}", contenido.getPorcentajeAdmin());
			contenidoNuevo = super.iService.guardarElemento(contenido);
		} catch (DataAccessException e) {

			if (iContenidoRepository.existsByNombre(contenido.getNombre())) {
				mapa.put("mensaje", "Ocurrió un error al registrar el elemento");
				mapa.put("error", "El titulo de contenido ya existe");
				return new ResponseEntity<>(mapa,
						HttpStatus.INTERNAL_SERVER_ERROR);
			}

			mapa.put("mensaje", "Ocurrió un error al registrar el elemento");
			mapa.put("error", e.getMessage() + " : " + e.getMostSpecificCause());
			return new ResponseEntity<>(mapa,
					HttpStatus.INTERNAL_SERVER_ERROR);
		}
		mapa.put("mensaje", "Registro exitoso");
		mapa.put("elemento", contenidoNuevo);

		return new ResponseEntity<>(mapa, HttpStatus.OK);
	}

	@PutMapping("/contenidoFoto/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> modificarContenidoConFoto(@PathVariable Long id, @Valid Contenido contenidoFormulario,
			@RequestParam MultipartFile archivo) throws IOException {

		System.out.println("entró a modificar");

		Contenido contenidoExistente = null;
		Contenido contenidoNuevo = null;
		Map<String, Object> mapa = new HashMap<>();

		contenidoExistente = iContenidoService.obtenerElementoPorID(id);

		if (contenidoExistente == null) {
			mapa.put("mensaje", "El contenido con id " + id + " no está registrado");
			return new ResponseEntity<>(mapa, HttpStatus.NOT_FOUND);
		}

		try {
			contenidoExistente.setId(contenidoFormulario.getId());
			contenidoExistente.setNombreFoto(contenidoFormulario.getNombreFoto());
			contenidoExistente.setNombre(contenidoFormulario.getNombre());
			contenidoExistente.setDescripcion(contenidoFormulario.getDescripcion());
			contenidoExistente.setEtiquetas(contenidoFormulario.getEtiquetas());
			contenidoExistente.setFechaLimite(contenidoFormulario.getFechaLimite());
			contenidoExistente.setCategoria(contenidoFormulario.getCategoria());

			if (!archivo.isEmpty()) {

				if (contenidoExistente.getNombreFoto() != null) {
					iRepositorioService.borrarFoto(contenidoExistente.getNombreFoto()); // elimino la foto existente
				}

				String nombreFotoNueva = iRepositorioService.copiarfotoEnCarpeta(archivo);
				contenidoExistente.setNombreFoto(nombreFotoNueva);
			}

			contenidoNuevo = iContenidoService.guardarElemento(contenidoExistente);

		} catch (DataAccessException e) {
			mapa.put("mensaje", "Ocurrio un error al modificar el contenido " + contenidoExistente.getNombre());
		}

		mapa.put("mensaje", "El contenido " + contenidoExistente.getNombre() + " ha sido modificado exitosamente");
		mapa.put("contenido", contenidoNuevo);

		return new ResponseEntity<>(mapa, HttpStatus.OK);
	}

	@PutMapping("/{id}") // con la id obtenemos de la base de datos y actualizamos
	@PreAuthorize("hasRole('ADMIN')")
	@ResponseStatus(HttpStatus.CREATED)
	public ResponseEntity<?> update(@RequestBody Contenido contenido, @PathVariable Long id) {// modificado
		Contenido contenidoActual = null;
		Map<String, Object> mapa = new HashMap<>();
		contenidoActual = iService.obtenerElementoPorID(id);// Pedido por id
		if (contenidoActual == null) {
			mapa.put("mensaje", "Error: no se puede editar, el contenido iD:"
					.concat(id.toString().concat("no existe en la base de datos")));
			return new ResponseEntity<>(mapa, HttpStatus.NOT_FOUND);// Estatus 404
		}
		try {
			contenidoActual.setId(contenido.getId());
			contenidoActual.setNombreFoto(contenido.getNombreFoto());
			contenidoActual.setNombre(contenido.getNombre());
			contenidoActual.setDescripcion(contenido.getDescripcion());
			contenidoActual.setEtiquetas(contenido.getEtiquetas());
			contenidoActual.setFechaLimite(contenido.getFechaLimite());
			contenidoActual.setCategoria(contenido.getCategoria());
			contenidoActual.setFechaLimite(contenido.getFechaLimite());
			contenidoActual.setPrograma(contenido.getPrograma());
			contenidoActual.setMatriculados(contenido.getMatriculados());
			contenidoActual = iService.guardarElemento(contenidoActual);// persistir o guardar
		} catch (DataAccessException e) {
			mapa.put("mensaje", "Error al actualizar el contenido en la base de datos");
			mapa.put("error", e.getMessage().concat(e.getMostSpecificCause().getMessage()));// por que ocurrio el error
			return new ResponseEntity<>(mapa, HttpStatus.INTERNAL_SERVER_ERROR);// Staus
		}
		mapa.put("mensaje", "El contenido ha sido actualizado con éxitos!");
		mapa.put("contenido", contenidoActual);
		return new ResponseEntity<>(mapa, HttpStatus.CREATED);
	}

	@GetMapping("/categoria/{id}")
	public ResponseEntity<RespuestaDatos> listarContenidosPorCategoria(@PathVariable Long id) {
		try {
			if (id == null) {
				RespuestaDatos error = new RespuestaDatos(null, false,
						"El contenido con id " + id + " no está registrado");
				return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
			}

			List<Contenido> contenidos = iContenidoService.findByCategoriaId(id);
			if (contenidos.isEmpty()) {
				RespuestaDatos error = new RespuestaDatos(null, false,
						"No se encontraron contenidos para la categoría con id " + id);
				return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
			} else {
				RespuestaDatos success = new RespuestaDatos(contenidos, true, "");
				return ResponseEntity.ok(success);
			}
		} catch (Exception e) {
			RespuestaDatos error = new RespuestaDatos(null, false, "Error interno del servidor: " + e.getMessage());
			return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/categoria/nombre/{nombreCategoria}/nombre")
	public Page<ContenidoDto> buscarPorNombreCategoriaYPorNombreCurso(
			@PathVariable String nombreCategoria,
			@RequestParam(required = false, defaultValue = "") String nombreCurso,
			@PageableDefault(sort = "id", direction = Sort.Direction.ASC) Pageable pageable) {
		Page<Contenido> contenidos = iContenidoService.buscarPorNombreCategoriaYPorTitulo(nombreCategoria, nombreCurso,
				pageable);
		log.info("contenidos-contenidos-contenidos-contenidos-contenidos: " + contenidos);
		return contenidos.map(this::convertToDto);
	}

	private ContenidoDto convertToDto(Contenido contenido) {

		ModelMapper modelMapper = new ModelMapper();

		ContenidoDto contenidoDto = modelMapper.map(contenido, ContenidoDto.class);

		if (contenido.getCategoria() != null) {
			CategoriaDto categoriaDto = modelMapper.map(contenido.getCategoria(), CategoriaDto.class);
			contenidoDto.setCategoria(categoriaDto);
		}
		log.info("contenidoDto-contenidoDto-contenidoDto-contenidoDto-contenidoDto: " + contenidoDto);
		return contenidoDto;
	}

	@GetMapping("/categoria/nombre/activado/{nombreCategoria}/nombre")
	public Page<ContenidoDto> buscarPorNombreCategoriaYPorNombreCursoYActivado(
			@PathVariable String nombreCategoria,
			@RequestParam(required = false, defaultValue = "") String nombreCurso,
			/* @RequestParam(required = false) Boolean activado, */
			@PageableDefault(sort = "id", direction = Sort.Direction.ASC) Pageable pageable) {
		Page<Contenido> contenidos;

		// if (activado != null) {
		contenidos = iContenidoRepository
				.obtenerContenidoPorNombreCategoriaYNombreCursoPaginadoYActivado(nombreCategoria, nombreCurso, true, /*
																											 * activado,
																											 */
						pageable);
		// } else {
		// contenidos =
		// iContenidoService.buscarPorNombreCategoriaYPorTitulo(nombreCategoria, titulo,
		// pageable);
		// }

		log.info("contenidos-contenidos-contenidos-contenidos-contenidos: " + contenidos);
		return contenidos.map(this::convertToDto);
	}

	@GetMapping("/categoria/nombre/activado/{nombreCategoria}/mostrarTodos/nombre")
	public Page<ContenidoDto> buscarPorNombreCategoriaYPorNombreCursoYActivadoYTodos(
			@PathVariable String nombreCategoria,
			@RequestParam(required = false, defaultValue = "") String nombreCurso,
			@RequestParam(required = false) Boolean activado,
			@PageableDefault(sort = "id", direction = Sort.Direction.ASC) Pageable pageable) {
		Page<Contenido> contenidos;

		if (activado != null) {
			contenidos = iContenidoRepository
					.obtenerContenidoPorNombreCategoriaYNombreCursoPaginadoYActivado(nombreCategoria, nombreCurso, activado,
							pageable);
		} else {
			contenidos = iContenidoService.buscarPorNombreCategoriaYPorTitulo(nombreCategoria, nombreCurso,
					pageable);
		}

		log.info("contenidos-contenidos-contenidos-contenidos-contenidos: " + contenidos);
		return contenidos.map(this::convertToDto);
	}

	private void configurarModelMapper() {
		Converter<ContenidoUsuario, ContenidoUsuarioDto> contenidoUsuarioConverter = new AbstractConverter<>() {
			@Override
			protected ContenidoUsuarioDto convert(ContenidoUsuario source) {
				ContenidoUsuarioDto destino = new ContenidoUsuarioDto();
				destino.setId(source.getId());

				// Conversión explícita del id de int a Long
				Long usuarioId = Long.valueOf(source.getUsuario().getId());
				// destino.setUsuario(new UsuarioDto(usuarioId,
				// source.getUsuario().getNombreUsuario()));
				destino.setUsuario(new UsuarioDto2(usuarioId,
						source.getUsuario().getNombre(),
						source.getUsuario().getNombreUsuario(),
						source.getUsuario().getCorreo(),
						source.getUsuario().getLimiteContenidos()));
				return destino;
			}
		};

		TypeMap<ContenidoUsuario, ContenidoUsuarioDto> typeMap = modelMapper.createTypeMap(ContenidoUsuario.class,
				ContenidoUsuarioDto.class);
		typeMap.setConverter(contenidoUsuarioConverter);
	}

	@GetMapping("/categoria/nombre/{nombreCategoria}/activado/nombre")
	public Page<ContenidoDto> buscarPorNombreCategoriaYPorTituloActivado(
			@PathVariable String nombreCategoria,
			@RequestParam(required = false, defaultValue = "") String nombreCurso,
			@RequestParam(required = false) Boolean activado,
			@PageableDefault(sort = "id", direction = Sort.Direction.ASC) Pageable pageable) {

		Page<Contenido> contenidos = iContenidoRepository.obtenerContenidoPorNombreCategoriaYNombreCursoPaginadoYActivado(
				nombreCategoria, nombreCurso, activado, pageable);

		log.info("contenidos-contenidos-contenidos-contenidos-contenidos: " + contenidos);
		return contenidos.map(this::convertToDto);
	}

	@GetMapping("/categoria/nombre/{nombreCategoria}/activado/mostrarTodos/titulo")
	public Page<ContenidoDto> buscarPorNombreCategoriaYPorTituloYActivado(
			@PathVariable String nombreCategoria,
			@RequestParam(required = false, defaultValue = "") String titulo,
			@RequestParam(required = false) Boolean activado,
			@RequestParam(required = false) Boolean mostrarTodos,
			@PageableDefault(sort = "id", direction = Sort.Direction.ASC) Pageable pageable) {
		Page<Contenido> contenidos;

		if (mostrarTodos != null && mostrarTodos) {
			// Mostrar todos los contenidos, independientemente de su estado de activación
			contenidos = iContenidoService.buscarPorNombreCategoriaYPorTitulo(nombreCategoria, titulo,
					pageable);
		} else {
			// Filtrar por estado de activación proporcionado
			contenidos = iContenidoRepository.obtenerContenidoPorNombreCategoriaYNombreCursoPaginadoYActivado(
					nombreCategoria,
					titulo, activado, pageable);
		}
		// log.info("contenidos-contenidos-contenidos-contenidos-contenidos: " +
		// contenidos);
		return contenidos.map(this::convertToDto);
	}

	@GetMapping("elemento/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> obtenerContenidoPorId(@PathVariable Long id) {
		Contenido contenido = iService.obtenerElementoPorID(id);

		if (contenido == null) {
			return ResponseEntity.notFound().build();
		}

		ContenidoDto2 contenidoDto = convertirAContenidoDto(contenido);

		return ResponseEntity.ok(contenidoDto);
	}

	private ContenidoDto2 convertirAContenidoDto(Contenido contenido) {
		ContenidoDto2 contenidoDto = modelMapper.map(contenido, ContenidoDto2.class);
		return contenidoDto;
	}

	@GetMapping("/contenidos")
	public ResponseEntity<Page<Contenido>> obtenerContenidosPaginados(
			@RequestParam(required = false) String categoria,
			@RequestParam(required = false) String titulo,
			@RequestParam(required = false) Boolean activado,
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "10") int size) {
		Page<Contenido> contenidos = contenidoServiceImp.obtenerContenidosPaginados2(categoria, titulo, activado, page,
				size);
		return new ResponseEntity<>(contenidos, HttpStatus.OK);
	}

	private ContenidoDto convertToDto(Contenido contenido1, ContenidoDto contenidodto1) {
		return null;
	}

	// 11.
	

	// 22. Muestra todos los contenidos de categoria y de usuario sin activados
	// api/contenidos/buscar-por-categoria-usuario?categoria=Desarrollo%20web&usuarioId=4
	@GetMapping("/buscar-por-categoria-usuario")
	public ResponseEntity<Page<Contenido>> buscarPorCategoriaYUsuario(@RequestParam("categoria") String nombreCategoria,
			@RequestParam("usuarioId") Long usuarioId, @PageableDefault(size = 20, page = 0) Pageable pageable) {
		Page<Contenido> contenidos = iContenidoService.buscarPorCategoriaUsuario(nombreCategoria, usuarioId,
				pageable);
		return new ResponseEntity<>(contenidos, HttpStatus.OK);
	}

	// 33.
	// api/contenidos/obtener-contenidos-desactivados?usuarioId=4
	@GetMapping("/obtener-contenidos-desactivados")
	public ResponseEntity<Page<Contenido>> obtenerContenidosDesactivados(@RequestParam("usuarioId") Long usuarioId,
			@PageableDefault(size = 20, page = 0, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
		Page<Contenido> contenidos = iContenidoService.obtenerContenidoDesactivadoPorUsuario(usuarioId, pageable);
		return new ResponseEntity<>(contenidos, HttpStatus.OK);
	}

	// 44.
	// api/contenidos/obtener-contenidos-activados?usuarioId=4
	@GetMapping("/obtener-contenidos-activados")
	public ResponseEntity<Page<Contenido>> obtenerContenidosActivados(
			@RequestParam("usuarioId") Long usuarioId,
			@PageableDefault(size = 20, page = 0, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
		Page<Contenido> contenidos = iContenidoService.obtenerContenidoActivadoPorUsuario(usuarioId, pageable);
		return new ResponseEntity<>(contenidos, HttpStatus.OK);
	}

	// 55.
	

	// 66.
	// http://localhost:8880/api/contenidos/por-categoria/Desarrollo%20web
	@GetMapping("/por-categoria/{nombreCategoria}")
	public ResponseEntity<Page<Contenido>> getContenidosPorCategoria(
			@PathVariable("nombreCategoria") String nombreCategoria,
			Pageable pageable) {
		try {
			Page<Contenido> contenidos = iContenidoService.findByCategoriaNombre(nombreCategoria, pageable);
			return ResponseEntity.ok(contenidos);
			/*
			 * } catch (CategoriaNotFoundException e) {
			 * return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
			 */
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}

	// 77.
	// http://localhost:8880/api/contenidos/por-categoria/Desarrollo%20web/activados?activado=false
	@GetMapping("/por-categoria/{nombreCategoria}/activados")
	public ResponseEntity<Page<Contenido>> getContenidosPorCategoriaYActivados(
			@PathVariable("nombreCategoria") String nombreCategoria,
			@RequestParam(value = "activado", required = false) Boolean activado,
			Pageable pageable) {
		try {
			Page<Contenido> contenidos = iContenidoService.findByCategoriaNombreAndActivado(nombreCategoria, activado,
					pageable);
			return ResponseEntity.ok(contenidos);
			/*
			 * } catch (CategoriaNotFoundException e) {
			 * return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
			 */
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}

	// 777.

	
	@GetMapping("/")
	public ResponseEntity<Page<ContenidoDto>> obtenerContenidosPaginados(

			@RequestParam(required = false) String nombreCategoria,

			@RequestParam(required = false) String titulo,

			@RequestParam(required = false) Boolean activado,

			@RequestParam(required = false) String nombreUsuario,

			@PageableDefault(sort = "id", direction = Sort.Direction.ASC) Pageable pageable,

			@RequestParam(defaultValue = "0") int page,

			@RequestParam(defaultValue = "10") int size,

			@RequestParam(defaultValue = "false") Boolean mostrarTodos) {

		Page<Contenido> contenidos = null;

		if (nombreUsuario == null || nombreUsuario.isEmpty()) {
			nombreUsuario = "visitante";
		}

		Optional<Usuario> usuarioOptional = iUsuarioService.buscarPorUsuarioNombre(nombreUsuario);
		log.info("**************************************************************");

		if (usuarioOptional.isPresent()) {
			Usuario usuario = usuarioOptional.get();

			String roleToCheck1 = "ROLE_ADMIN";

			boolean isAdmin = usuario.getRoles().stream()
					.anyMatch(rol -> rol.getRolNombre().toString().equalsIgnoreCase(roleToCheck1));

			String roleToCheck2 = "ROLE_DOCENTE";

			boolean isDocente = usuario.getRoles().stream()
					.anyMatch(rol -> rol.getRolNombre().toString().equalsIgnoreCase(roleToCheck2));

			String roleToCheck3 = "ROLE_ESTUDIANTE";

			boolean isEstudiante = usuario.getRoles().stream()
					.anyMatch(rol -> rol.getRolNombre().toString().equalsIgnoreCase(roleToCheck3));

			log.info("**************************************************************");
			log.info("usuario" + usuarioOptional);
			log.info("**************************************************************");
			log.info("isDocente" + isDocente);
			log.info("**************************************************************");
			log.info("isAdmin" + isAdmin);
			log.info("**************************************************************");
			log.info("isDocente", isDocente);

			if (isAdmin) {
				// ... (Resto de tu lógica para administradores)
				log.info("El usuario es ADMIN1");

				if (mostrarTodos != null && mostrarTodos) {
					log.info("mostrarTodos1: " + mostrarTodos);
					log.info("activado1: " + activado);
					// consulta 66 .
					contenidos = iContenidoService.findByCategoriaNombre(nombreCategoria,
							pageable);

				} else if (activado != null && activado) {
					log.info("mostrarTodos2: " + mostrarTodos);
					log.info("activado2: " + activado);
					log.info("TodoslosContenidosActivados: ");
					// consulta 77 . activado=true
					contenidos = iContenidoService.findByCategoriaNombreAndActivado(nombreCategoria, true,
							pageable);
				} else {
					log.info("mostrarTodos3: " + mostrarTodos);
					log.info("activado3: " + activado);
					log.info("TodoslosContenidosDesactivados: ");
					// consulta 77 . activado=fale
					contenidos = iContenidoService.findByCategoriaNombreAndActivado(nombreCategoria, false,
							pageable);
				}
			} else if (isDocente) {
				// ... (Resto de tu lógica para docentes)
				log.info("El usuario es DOCENTE");
				if (mostrarTodos != null && mostrarTodos) {
					log.info("mostrarTodos1: " + mostrarTodos);
					log.info("activado111: " + activado);
					log.info("nombreCategoria: " + nombreCategoria);
					log.info("id-usuario: " + usuarioOptional.get().getId());
					// consulta 22 .
					contenidos = iContenidoService.buscarPorCategoriaUsuario(nombreCategoria,
							usuarioOptional.get().getId(), pageable);
				} else if (activado != null && activado) {
					log.info("mostrarTodos2: " + mostrarTodos);
					log.info("activado2: " + activado);
					log.info("TodoslosContenidosActivadosDeEsteDocente: ");
					// consulta 44 .
					contenidos = iContenidoService.obtenerContenidoActivadoPorUsuario(usuarioOptional.get().getId(),
							pageable);
				} else {
					log.info("mostrarTodos3: " + mostrarTodos);
					log.info("activado3: " + activado);
					log.info("TodoslosContenidosDesactivadosDeEsteDocente: ");
					// consulta 33 .
					contenidos = iContenidoService.obtenerContenidoDesactivadoPorUsuario(usuarioOptional.get()
							.getId(),
							pageable);
				}
			} else if (isEstudiante) {
				log.info("El usuario NO es DOCENTE ni ADMIN");
				log.info(
						"_----------------------------------------------------------------------------------------------------------------");
				log.info("usuario: {}", usuario);
				log.info("usuario.getId(): {}", usuario.getId());
				contenidos = iContenidoService.findByCategoriaNombreAndActivadoAndUsuarioIdIsNull(nombreCategoria,
						usuarioOptional.get().getId(), pageable);
				// messagingTemplate.convertAndSend("/topic/actualizacion-contenidos",
				// contenidos);
			} else {
				log.info("El usuario NO es DOCENTE ni ADMIN niESTUDIANTE");
				contenidos = iContenidoService.findByCategoriaNombreAndActivado(nombreCategoria, true,
						pageable);
				log.info(
						"leo----------------------------------------------------------------------------------------------------------------");
			}
			log.info("contenidos: {}", contenidos);
		} else {
			log.error(
					"**************************************************************************************");
			log.error("Usuario no encontrado: ");
			// consulta 77 . activado = true
			contenidos = iContenidoService.findByCategoriaNombreAndActivado(nombreCategoria, true,
					pageable);
		}

		Page<ContenidoDto> dtoPage = contenidos.map(contenido -> convertirContenidoADTO(contenido));

		return new ResponseEntity<>(dtoPage, HttpStatus.OK);
		// return new ResponseEntity<>(contenidos, HttpStatus.OK);
	}

	public ContenidoDto convertirContenidoADTO(Contenido contenido) {
		ContenidoDto dto = new ContenidoDto();
		dto.setId(contenido.getId());
		dto.setNombreFoto(contenido.getNombreFoto());
		dto.setNombre(contenido.getNombre());
		dto.setDescripcion(contenido.getDescripcion());
		dto.setEtiquetas(contenido.getEtiquetas());
		dto.setFechaLimite(contenido.getFechaLimite());
		dto.setPrograma(contenido.getPrograma());
		dto.setMatriculados(contenido.getMatriculados());
		dto.setActivado(contenido.getActivado());
		dto.setCategoriaId(contenido.getCategoria().getId());
		dto.setPrecio(contenido.getPrecio());
		dto.setPorcentajeAdmin(contenido.getPorcentajeAdmin());
		dto.setListaContenidoUsuario(contenido.getListaContenidoUsuario());

		return dto;
	}

	@GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Contenido>> getContenidosByUsuarioId(@PathVariable Long usuarioId) {
        List<Contenido> contenidos = iContenidoService.findContenidosByUsuarioId(usuarioId);

        // Valida si hay resultados
        if (contenidos.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(contenidos);
    }

}
