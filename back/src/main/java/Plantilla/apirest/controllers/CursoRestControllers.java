package Plantilla.apirest.controllers;

import java.io.IOException;
import java.net.MalformedURLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
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
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
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
import Plantilla.apirest.models.dao.ICursoRepository;
import Plantilla.apirest.models.dao.ICursoUsuarioDao;
import Plantilla.apirest.models.dto.CategoriaDto;
import Plantilla.apirest.models.dto.CursoDto;
import Plantilla.apirest.models.dto.CursoDto2;
import Plantilla.apirest.models.dto.CursoUsuarioDto;
import Plantilla.apirest.models.dto.UsuarioDto2;
import Plantilla.apirest.models.entity.Categoria;
import Plantilla.apirest.models.entity.Curso;
import Plantilla.apirest.models.entity.CursoUsuario;
import Plantilla.apirest.rta.RespuestaDatos;
import Plantilla.apirest.seguridad.entidad.Usuario;
import Plantilla.apirest.seguridad.servicio.UserDetailsServicioImpl;
import Plantilla.apirest.seguridad.servicio.UsuarioServicio;
import Plantilla.apirest.service.CursoServiceImpl;
import Plantilla.apirest.service.ICategoriaService;
import Plantilla.apirest.service.ICursoService;
import Plantilla.apirest.service.ICursoUsuarioServicio;
import Plantilla.apirest.service.IRepositorioService;
import Plantilla.apirest.service.IUsuarioService;

/* @CrossOrigin(origins = { "http://localhost:4200", "*" }, exposedHeaders = { "Access-Control-Expose-Headers",
		"Content-Disposition" }) */
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/cursos")
@RestController
public class CursoRestControllers extends CommonRestController<Curso, ICursoService> {

	private final Logger log = LoggerFactory.getLogger(getClass());
	private final ICursoService iService;
	private final ModelMapper modelMapper;

	@Autowired
	ICursoRepository iCursoRepository;

	@Autowired
	UserDetailsServicioImpl userDetailsServicioImpl;

	//@Autowired
	//IContenidoDao iContenidoDao;

	@Autowired
	ICategoriaService iCategoriaService;

	@Autowired
	ICursoService iCursoService;

	@Autowired
	CursoServiceImpl cursoServiceImp;

	@Autowired
	IRepositorioService iRepositorioService;

	@Autowired
	UsuarioServicio usuarioServicio;

	@Autowired
	IUsuarioService iUsuarioService;

	@Autowired
	ICursoUsuarioServicio iCursoUsuarioServicio;

	@Autowired
	ICursoUsuarioDao iCursoUsuarioDao;

	@Autowired
	private SimpMessagingTemplate messagingTemplate;

	public CursoRestControllers(ICursoUsuarioServicio iCursoUsuarioServicio, ICursoService iService,
			ModelMapper modelMapper) {
		this.iCursoUsuarioServicio = iCursoUsuarioServicio;
		this.iService = iService;
		this.modelMapper = modelMapper;
	}

	@Autowired
	public CursoRestControllers(ICursoService iService, ModelMapper modelMapper) {
		this.iService = iService;
		this.modelMapper = modelMapper;
		configurarModelMapper();
	}

	@GetMapping("/contenido-existe")
	public boolean contenidoExiste(@RequestParam Long id) {
		return iCursoService.cursoExiste(id);
	}

	@GetMapping("/{cursoId}/existe")
	public ResponseEntity<Boolean> existsCurso(
			@RequestParam String nombreCategoria,
			@RequestParam Long usuarioId,
			@PathVariable Long cursoId) {
		boolean exists = iCursoService.existsCurso(nombreCategoria, usuarioId, cursoId);
		return ResponseEntity.ok(exists);
	}

	@GetMapping("/cursoFoto/{idCurso}")
	/* @PreAuthorize("hasRole('ADMIN')") */
	public ResponseEntity<?> obtenerFotoCursoPorID(@PathVariable Long idCurso) {
		Curso curso = null;
		Map<String, Object> mapa = new HashMap<>();
		try {
			curso = this.iCursoService.obtenerElementoPorID(idCurso);
		} catch (DataAccessException e) {
			// armo el mapa para agregarlo al ResponseEntity
			mapa.put("mensaje", "Ha ocurrido un error al obtener el curso con ID " + idCurso);
			mapa.put("error", e.getMessage() + ": " + e.getMostSpecificCause());
			return new ResponseEntity<>(mapa, HttpStatus.INTERNAL_SERVER_ERROR);
		}
		if (curso == null || curso.getNombreFoto() == null) {
			mapa.put("mensaje",
					"El curso con ID " + idCurso+ " no se encuentra registrado o no tiene imagen registrada");
			return new ResponseEntity<>(mapa, HttpStatus.NOT_FOUND);
		}
		Resource imagen = null;
		try {
			imagen = iRepositorioService.obtenerFoto(curso.getNombreFoto());
		} catch (MalformedURLException e) {
			e.printStackTrace();
		}
		return ResponseEntity.ok()
				.header("Content-Disposition", curso.getNombreFoto()) // en el header envío el nombre del archivo
																			// para poderlo usar en el Front
				.contentType(MediaType.IMAGE_JPEG).body(imagen);
	}

	@PostMapping("/cursoFoto")
	@PreAuthorize("hasRole('ADMIN') or hasRole('DOCENTE')")
	public ResponseEntity<?> guardarCursoConFoto(@Valid Curso curso,

			@RequestParam MultipartFile archivo, @RequestParam Long idCategoria)
			throws IOException {

		Curso cursoNuevo = null;
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
				curso.setNombreFoto(nombreFotoUnico);
			}
			Categoria categoria = this.iCategoriaService.obtenerElementoPorID(idCategoria);
			if (categoria == null) {
				// No se encontró la categoría correspondiente a la ID proporcionada
				mapa.put("mensaje", "La categoría no existe");
				return new ResponseEntity<>(mapa, HttpStatus.NOT_FOUND);
			}
			curso.setCategoria(categoria);
			// contenido.setPorcentajeAdmin(0.2);
			log.info(
					"************************************************************************************************************************************");
			log.info(
					"************************************************************************************************************************************");
			log.info("curso: {}", curso.toString());
			log.info("precio: {}", curso.getPrecio());
			log.info("curso porcentaje: {}", curso.getPorcentajeAdmin());
			log.info("habilidades: {}", curso.getListaHabilidades());
			cursoNuevo = super.iService.guardarElemento(curso);
		} catch (DataAccessException e) {

			if (iCursoRepository.existsByNombre(curso.getNombre())) {
				mapa.put("mensaje", "Ocurrió un error al registrar el elemento");
				mapa.put("error", "El titulo de curso ya existe");
				return new ResponseEntity<>(mapa,
						HttpStatus.INTERNAL_SERVER_ERROR);
			}

			mapa.put("mensaje", "Ocurrió un error al registrar el elemento");
			mapa.put("error", e.getMessage() + " : " + e.getMostSpecificCause());
			return new ResponseEntity<>(mapa,
					HttpStatus.INTERNAL_SERVER_ERROR);
		}
		mapa.put("mensaje", "Registro exitoso");
		mapa.put("elemento", cursoNuevo);

		return new ResponseEntity<>(mapa, HttpStatus.OK);
	}

	@PutMapping("/cursoFoto/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> modificarCursoConFoto(@PathVariable Long id, @Valid Curso cursoFormulario,
			@RequestParam MultipartFile archivo) throws IOException {

		System.out.println("entró a modificar");

		Curso cursoExistente = null;
		Curso cursoNuevo = null;
		Map<String, Object> mapa = new HashMap<>();

		cursoExistente = iCursoService.obtenerElementoPorID(id);

		if (cursoExistente == null) {
			mapa.put("mensaje", "El curso con id " + id + " no está registrado");
			return new ResponseEntity<>(mapa, HttpStatus.NOT_FOUND);
		}

		try {
			cursoExistente.setId(cursoFormulario.getId());
			cursoExistente.setNombreFoto(cursoFormulario.getNombreFoto());
			cursoExistente.setNombre(cursoFormulario.getNombre());
			cursoExistente.setDescripcion(cursoFormulario.getDescripcion());
			cursoExistente.setEtiquetas(cursoFormulario.getEtiquetas());
			cursoExistente.setFechaLimite(cursoFormulario.getFechaLimite());
			cursoExistente.setCategoria(cursoFormulario.getCategoria());

			if (!archivo.isEmpty()) {

				if (cursoExistente.getNombreFoto() != null) {
					iRepositorioService.borrarFoto(cursoExistente.getNombreFoto()); // elimino la foto existente
				}

				String nombreFotoNueva = iRepositorioService.copiarfotoEnCarpeta(archivo);
				cursoExistente.setNombreFoto(nombreFotoNueva);
			}

			cursoNuevo = iCursoService.guardarElemento(cursoExistente);

		} catch (DataAccessException e) {
			mapa.put("mensaje", "Ocurrio un error al modificar el curso " + cursoExistente.getNombre());
		}

		mapa.put("mensaje", "El curso " + cursoExistente.getNombre() + " ha sido modificado exitosamente");
		mapa.put("curso", cursoNuevo);

		return new ResponseEntity<>(mapa, HttpStatus.OK);
	}

	@PutMapping("/{id}") // con la id obtenemos de la base de datos y actualizamos
	@PreAuthorize("hasRole('ADMIN')")
	@ResponseStatus(HttpStatus.CREATED)
	public ResponseEntity<?> update(@RequestBody Curso curso, @PathVariable Long id) {// modificado
		Curso cursoActual = null;
		Map<String, Object> mapa = new HashMap<>();
		cursoActual = iService.obtenerElementoPorID(id);// Pedido por id
		if (cursoActual == null) {
			mapa.put("mensaje", "Error: no se puede editar, el curso iD:"
					.concat(id.toString().concat("no existe en la base de datos")));
			return new ResponseEntity<>(mapa, HttpStatus.NOT_FOUND);// Estatus 404
		}
		try {
			cursoActual.setId(curso.getId());
			cursoActual.setNombreFoto(curso.getNombreFoto());
			cursoActual.setNombre(curso.getNombre());
			cursoActual.setDescripcion(curso.getDescripcion());
			cursoActual.setEtiquetas(curso.getEtiquetas());
			cursoActual.setFechaLimite(curso.getFechaLimite());
			cursoActual.setCategoria(curso.getCategoria());
			cursoActual.setFechaLimite(curso.getFechaLimite());
			cursoActual.setListaHabilidades(curso.getListaHabilidades());
			cursoActual.setMatriculados(curso.getMatriculados());
			cursoActual = iService.guardarElemento(cursoActual);// persistir o guardar
		} catch (DataAccessException e) {
			mapa.put("mensaje", "Error al actualizar el curso en la base de datos");
			mapa.put("error", e.getMessage().concat(e.getMostSpecificCause().getMessage()));// por que ocurrio el error
			return new ResponseEntity<>(mapa, HttpStatus.INTERNAL_SERVER_ERROR);// Staus
		}
		mapa.put("mensaje", "El curso ha sido actualizado con éxitos!");
		mapa.put("curso", cursoActual);
		return new ResponseEntity<>(mapa, HttpStatus.CREATED);
	}

	@GetMapping("/categoria/{id}")
	public ResponseEntity<RespuestaDatos> listarCursosPorCategoria(@PathVariable Long id) {
		try {
			if (id == null) {
				RespuestaDatos error = new RespuestaDatos(null, false,
						"El curso con id " + id + " no está registrado");
				return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
			}

			List<Curso> cursos = iCursoService.findByCategoriaId(id);
			if (cursos.isEmpty()) {
				RespuestaDatos error = new RespuestaDatos(null, false,
						"No se encontraron contenidos para la categoría con id " + id);
				return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
			} else {
				RespuestaDatos success = new RespuestaDatos(cursos, true, "");
				return ResponseEntity.ok(success);
			}
		} catch (Exception e) {
			RespuestaDatos error = new RespuestaDatos(null, false, "Error interno del servidor: " + e.getMessage());
			return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/categoria/nombre/{nombreCategoria}/nombre")
	public Page<CursoDto> buscarPorNombreCategoriaYPorNombreCurso(
			@PathVariable String nombreCategoria,
			@RequestParam(required = false, defaultValue = "") String nombreCurso,
			@PageableDefault(sort = "id", direction = Sort.Direction.ASC) Pageable pageable) {
		Page<Curso> cursos = iCursoService.buscarPorNombreCategoriaYPorNombreCurso(nombreCategoria, nombreCurso,
				pageable);
		log.info("Cursoss: " + cursos);
		return cursos.map(this::convertToDto);
	}

	private CursoDto convertToDto(Curso curso) {

		ModelMapper modelMapper = new ModelMapper();

		CursoDto cursoDto = modelMapper.map(curso, CursoDto.class);

		if (curso.getCategoria() != null) {
			CategoriaDto categoriaDto = modelMapper.map(curso.getCategoria(), CategoriaDto.class);
			cursoDto.setCategoria(categoriaDto);
		}
		log.info("cursoDto: " + cursoDto);
		return cursoDto;
	}

	@GetMapping("/categoria/nombre/activado/{nombreCategoria}/nombre")
	public Page<CursoDto> buscarPorNombreCategoriaYPorNombreCursoYActivado(
			@PathVariable String nombreCategoria,
			@RequestParam(required = false, defaultValue = "") String nombreCurso,
			@PageableDefault(sort = "id", direction = Sort.Direction.ASC) Pageable pageable) {
		Page<Curso> cursos;

		// if (activado != null) {
			cursos = iCursoRepository
				.obtenerContenidoPorNombreCategoriaYNombreCursoPaginadoYActivado(nombreCategoria, nombreCurso, true, /*
																											 * activado,
																											 */
						pageable);
		// } else {
		// contenidos =
		// iContenidoService.buscarPorNombreCategoriaYPorTitulo(nombreCategoria, titulo,
		// pageable);
		// }

		log.info("cursos: " + cursos);
		return cursos.map(this::convertToDto);
	}

	@GetMapping("/categoria/nombre/activado/{nombreCategoria}/mostrarTodos/nombre")
	public Page<CursoDto> buscarPorNombreCategoriaYPorNombreCursoYActivadoYTodos(
			@PathVariable String nombreCategoria,
			@RequestParam(required = false, defaultValue = "") String nombreCurso,
			@RequestParam(required = false) Boolean activado,
			@PageableDefault(sort = "id", direction = Sort.Direction.ASC) Pageable pageable) {
		Page<Curso> cursos;

		if (activado != null) {
			cursos = iCursoRepository
					.obtenerContenidoPorNombreCategoriaYNombreCursoPaginadoYActivado(nombreCategoria, nombreCurso, activado,
							pageable);
		} else {
			cursos = iCursoService.buscarPorNombreCategoriaYPorNombreCurso(nombreCategoria, nombreCurso,
					pageable);
		}

		log.info("cursos: " + cursos);
		return cursos.map(this::convertToDto);
	}

	private void configurarModelMapper() {
		Converter<CursoUsuario, CursoUsuarioDto> contenidoUsuarioConverter = new AbstractConverter<>() {
			@Override
			protected CursoUsuarioDto convert(CursoUsuario source) {
				CursoUsuarioDto destino = new CursoUsuarioDto();
				destino.setId(source.getId());

				// Conversión explícita del id de int a Long
				Long usuarioId = Long.valueOf(source.getUsuario().getId());
				// destino.setUsuario(new UsuarioDto(usuarioId,
				// source.getUsuario().getNombreUsuario()));
				destino.setUsuario(new UsuarioDto2(usuarioId,
						source.getUsuario().getNombre(),
						source.getUsuario().getNombreUsuario(),
						source.getUsuario().getCorreo(),
						source.getUsuario().getLimiteCursos()));
				return destino;
			}
		};

		TypeMap<CursoUsuario, CursoUsuarioDto> typeMap = modelMapper.createTypeMap(CursoUsuario.class,
				CursoUsuarioDto.class);
		typeMap.setConverter(contenidoUsuarioConverter);
	}

	@GetMapping("/categoria/nombre/{nombreCategoria}/activado/nombre")
	public Page<CursoDto> buscarPorNombreCategoriaYPorTituloActivado(
			@PathVariable String nombreCategoria,
			@RequestParam(required = false, defaultValue = "") String nombreCurso,
			@RequestParam(required = false) Boolean activado,
			@PageableDefault(sort = "id", direction = Sort.Direction.ASC) Pageable pageable) {

		Page<Curso> cursos = iCursoRepository.obtenerContenidoPorNombreCategoriaYNombreCursoPaginadoYActivado(
				nombreCategoria, nombreCurso, activado, pageable);

		log.info("cursos: " + cursos);
		return cursos.map(this::convertToDto);
	}

	@GetMapping("/categoria/nombre/{nombreCategoria}/activado/mostrarTodos/nombre")
	public Page<CursoDto> buscarPorNombreCategoriaYPorNombreCursoYActivado(
			@PathVariable String nombreCategoria,
			@RequestParam(required = false, defaultValue = "") String nombreCurso,
			@RequestParam(required = false) Boolean activado,
			@RequestParam(required = false) Boolean mostrarTodos,
			@PageableDefault(sort = "id", direction = Sort.Direction.ASC) Pageable pageable) {
		Page<Curso> cursos;

		if (mostrarTodos != null && mostrarTodos) {
			// Mostrar todos los contenidos, independientemente de su estado de activación
			cursos = iCursoService.buscarPorNombreCategoriaYPorNombreCurso(nombreCategoria, nombreCurso,
					pageable);
		} else {
			// Filtrar por estado de activación proporcionado
			cursos = iCursoRepository.obtenerContenidoPorNombreCategoriaYNombreCursoPaginadoYActivado(
					nombreCategoria,
					nombreCurso, activado, pageable);
		}
		// log.info("contenidos-contenidos-contenidos-contenidos-contenidos: " +
		// contenidos);
		return cursos.map(this::convertToDto);
	}

	@GetMapping("elemento/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> obtenerCursoPorId(@PathVariable Long id) {
		Curso curso = iService.obtenerElementoPorID(id);

		if (curso == null) {
			return ResponseEntity.notFound().build();
		}

		CursoDto2 cursoDto = convertirACursoDto(curso);

		return ResponseEntity.ok(cursoDto);
	}

	private CursoDto2 convertirACursoDto(Curso curso) {
		CursoDto2 cursoDto = modelMapper.map(curso, CursoDto2.class);
		return cursoDto;
	}

	@GetMapping("/cursos")
	public ResponseEntity<Page<Curso>> obtenerCursosPaginados(
			@RequestParam(required = false) String categoria,
			@RequestParam(required = false) String nombreCurso,
			@RequestParam(required = false) Boolean activado,
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "10") int size) {
		Page<Curso> cursos = cursoServiceImp.obtenerCursosPaginados2(categoria, nombreCurso, activado, page,
				size);
		return new ResponseEntity<>(cursos, HttpStatus.OK);
	}

	private CursoDto convertToDto(Curso curso1, CursoDto cursoDto1) {
		return null;
	}

	// 11.
	

	// 22. Muestra todos los cursos de categoria y de usuario sin activados
	// api/cursos/buscar-por-categoria-usuario?categoria=Desarrollo%20web&usuarioId=4
	@GetMapping("/buscar-por-categoria-usuario")
	public ResponseEntity<Page<Curso>> buscarPorCategoriaYUsuario(@RequestParam("categoria") String nombreCategoria,
			@RequestParam("usuarioId") Long usuarioId, @PageableDefault(size = 20, page = 0) Pageable pageable) {
		Page<Curso> cursos = iCursoService.buscarPorCategoriaUsuario(nombreCategoria, usuarioId,
				pageable);
		return new ResponseEntity<>(cursos, HttpStatus.OK);
	}

	// 33.
	// api/cursos/obtener-cursos-desactivados?usuarioId=4
	@GetMapping("/obtener-cursos-desactivados")
	public ResponseEntity<Page<Curso>> obtenerCursosDesactivados(@RequestParam("usuarioId") Long usuarioId,
			@PageableDefault(size = 20, page = 0, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
		Page<Curso> cursos = iCursoService.obtenerCursoDesactivadoPorUsuario(usuarioId, pageable);
		return new ResponseEntity<>(cursos, HttpStatus.OK);
	}

	// 44.
	// api/cursos/obtener-cursos-activados?usuarioId=4
	@GetMapping("/obtener-cursos-activados")
	public ResponseEntity<Page<Curso>> obtenerCursosActivados(
			@RequestParam("usuarioId") Long usuarioId,
			@PageableDefault(size = 20, page = 0, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
		Page<Curso> cursos = iCursoService.obtenerCursoActivadoPorUsuario(usuarioId, pageable);
		return new ResponseEntity<>(cursos, HttpStatus.OK);
	}

	// 55.
	

	// 66.
	// http://localhost:8880/api/cursos/por-categoria/Desarrollo%20web
	@GetMapping("/por-categoria/{nombreCategoria}")
	public ResponseEntity<Page<Curso>> getCursosPorCategoria(
			@PathVariable("nombreCategoria") String nombreCategoria,
			Pageable pageable) {
		try {
			Page<Curso> cursos = iCursoService.findByCategoriaNombre(nombreCategoria, pageable);
			return ResponseEntity.ok(cursos);
			/*
			 * } catch (CategoriaNotFoundException e) {
			 * return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
			 */
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}

	// 77.
	// http://localhost:8880/api/cursos/por-categoria/Desarrollo%20web/activados?activado=false
	@GetMapping("/por-categoria/{nombreCategoria}/activados")
	public ResponseEntity<Page<Curso>> getCursosPorCategoriaYActivados(
			@PathVariable("nombreCategoria") String nombreCategoria,
			@RequestParam(value = "activado", required = false) Boolean activado,
			Pageable pageable) {
		try {
			Page<Curso> contenidos = iCursoService.findByCategoriaNombreAndActivado(nombreCategoria, activado,
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
	public ResponseEntity<Page<CursoDto>> obtenerCursosPaginados(

			@RequestParam(required = false) String nombreCategoria,

			@RequestParam(required = false) String nombreCurso,

			@RequestParam(required = false) Boolean activado,

			@RequestParam(required = false) String nombreUsuario,

			@PageableDefault(sort = "id", direction = Sort.Direction.ASC) Pageable pageable,

			@RequestParam(defaultValue = "0") int page,

			@RequestParam(defaultValue = "10") int size,

			@RequestParam(defaultValue = "false") Boolean mostrarTodos) {

		Page<Curso> cursos = null;

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
					cursos = iCursoService.findByCategoriaNombre(nombreCategoria,
							pageable);

				} else if (activado != null && activado) {
					log.info("mostrarTodos2: " + mostrarTodos);
					log.info("activado2: " + activado);
					log.info("TodoslosContenidosActivados: ");
					// consulta 77 . activado=true
					cursos = iCursoService.findByCategoriaNombreAndActivado(nombreCategoria, true,
							pageable);
				} else {
					log.info("mostrarTodos3: " + mostrarTodos);
					log.info("activado3: " + activado);
					log.info("TodoslosContenidosDesactivados: ");
					// consulta 77 . activado=fale
					cursos = iCursoService.findByCategoriaNombreAndActivado(nombreCategoria, false,
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
					cursos = iCursoService.buscarPorCategoriaUsuario(nombreCategoria,
							usuarioOptional.get().getId(), pageable);
				} else if (activado != null && activado) {
					log.info("mostrarTodos2: " + mostrarTodos);
					log.info("activado2: " + activado);
					log.info("TodoslosContenidosActivadosDeEsteDocente: ");
					// consulta 44 .
					cursos = iCursoService.obtenerCursoActivadoPorUsuario(usuarioOptional.get().getId(),
							pageable);
				} else {
					log.info("mostrarTodos3: " + mostrarTodos);
					log.info("activado3: " + activado);
					log.info("TodoslosCursosDesactivadosDeEsteDocente: ");
					// consulta 33 .
					cursos = iCursoService.obtenerCursoDesactivadoPorUsuario(usuarioOptional.get()
							.getId(),
							pageable);
				}
			} else if (isEstudiante) {
				log.info("El usuario NO es DOCENTE ni ADMIN");
				log.info(
						"_----------------------------------------------------------------------------------------------------------------");
				log.info("usuario: {}", usuario);
				log.info("usuario.getId(): {}", usuario.getId());
				cursos = iCursoService.findByCategoriaNombreAndActivadoAndUsuarioIdIsNull(nombreCategoria,
						usuarioOptional.get().getId(), pageable);
				// messagingTemplate.convertAndSend("/topic/actualizacion-contenidos",
				// contenidos);
			} else {
				log.info("El usuario NO es DOCENTE ni ADMIN niESTUDIANTE");
				cursos = iCursoService.findByCategoriaNombreAndActivado(nombreCategoria, true,
						pageable);
				log.info(
						"leo----------------------------------------------------------------------------------------------------------------");
			}
			log.info("cursos: {}", cursos);
		} else {
			log.error(
					"**************************************************************************************");
			log.error("Usuario no encontrado: ");
			// consulta 77 . activado = true
			cursos = iCursoService.findByCategoriaNombreAndActivado(nombreCategoria, true,
					pageable);
		}

		Page<CursoDto> dtoPage = cursos.map(contenido -> convertirCursoADTO(contenido));

		return new ResponseEntity<>(dtoPage, HttpStatus.OK);
		// return new ResponseEntity<>(contenidos, HttpStatus.OK);
	}

	public CursoDto convertirCursoADTO(Curso curso) {
		CursoDto dto = new CursoDto();
		dto.setId(curso.getId());
		dto.setNombreFoto(curso.getNombreFoto());
		dto.setNombre(curso.getNombre());
		dto.setDescripcion(curso.getDescripcion());
		dto.setEtiquetas(curso.getEtiquetas());
		dto.setFechaLimite(curso.getFechaLimite());
		dto.setListaHabilidades(curso.getListaHabilidades());
		dto.setMatriculados(curso.getMatriculados());
		dto.setActivado(curso.getActivado());
		dto.setCategoriaId(curso.getCategoria().getId());
		dto.setPrecio(curso.getPrecio());
		dto.setPorcentajeAdmin(curso.getPorcentajeAdmin());
		dto.setListaCursoUsuario(curso.getListaCursoUsuario());

		return dto;
	}

	@GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Curso>> getCursosByUsuarioId(@PathVariable Long usuarioId) {
        List<Curso> contenidos = iCursoService.findCursoByUsuarioId(usuarioId);

        // Valida si hay resultados
        if (contenidos.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(contenidos);
    }

}
