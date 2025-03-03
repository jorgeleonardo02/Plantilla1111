package Plantilla.apirest.seguridad.controlador;

import java.text.ParseException;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import javax.validation.Valid;

import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import Plantilla.apirest.seguridad.dto.JwtDto;
import Plantilla.apirest.seguridad.dto.LoginUsuario;
import Plantilla.apirest.seguridad.dto.Mensaje;
import Plantilla.apirest.seguridad.dto.NuevoUsuario;
import Plantilla.apirest.seguridad.entidad.Rol;
import Plantilla.apirest.seguridad.entidad.Usuario;
//import Plantilla.apirest.seguridad.entidad.UsuarioPrincipal;
import Plantilla.apirest.seguridad.enums.RolNombre;
import Plantilla.apirest.seguridad.jwt.JwtProvider;
import Plantilla.apirest.seguridad.servicio.RolServicio;
import Plantilla.apirest.seguridad.servicio.UserDetailsServicioImpl;
import Plantilla.apirest.seguridad.servicio.UsuarioServicio;
import Plantilla.apirest.service.IUsuarioService;

@RestController
@RequestMapping("/auth")
@CrossOrigin
public class AuthControlador {

    private final Logger log = LoggerFactory.getLogger(getClass());

    @Autowired(required = true)
    PasswordEncoder passwordEncoder;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UsuarioServicio usuarioService;

    @Autowired
    UserDetailsServicioImpl userDetailsServicioImpl;

    @Autowired
    RolServicio rolService;

    /*
     * @Autowired
     * IUsuarioService iUsuarioService;
     */

    @Autowired
    JwtProvider jwtProvider;

    private final IUsuarioService iUsuarioService;
    private final ModelMapper modelMapper;

    // @Autowired
    public AuthControlador(IUsuarioService iUsuarioService, ModelMapper modelMapper) {
        this.iUsuarioService = iUsuarioService;
        this.modelMapper = modelMapper;
    }

    @PostMapping("/nuevo")
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> nuevo(@Valid @RequestBody NuevoUsuario nuevoUsuario, BindingResult bindingResult) {
        if (bindingResult.hasErrors())
            return new ResponseEntity<>(new Mensaje("Campos mal puestos o email inválido"), HttpStatus.BAD_REQUEST);
        if (usuarioService.existsByNombreUsuario(nuevoUsuario.getNombreUsuario()))
            return new ResponseEntity<>(new Mensaje("Ese nombre ya existe"), HttpStatus.BAD_REQUEST);
        if (usuarioService.existsByCorreo(nuevoUsuario.getCorreo()))
            return new ResponseEntity<>(new Mensaje("Ese correo ya existe"), HttpStatus.BAD_REQUEST);
        Usuario usuario = new Usuario(nuevoUsuario.getNombre(), nuevoUsuario.getNombreUsuario(),
                nuevoUsuario.getCorreo(), nuevoUsuario.getLimiteCursos(),
                passwordEncoder.encode(nuevoUsuario.getPassword()));
        Set<Rol> roles = new HashSet<>();
        if (nuevoUsuario.getRoles().contains("ADMIN"))
            roles.add(rolService.getByRolNombre(RolNombre.ROLE_ADMIN).get());
        if (nuevoUsuario.getRoles().contains("DOCENTE"))
            roles.add(rolService.getByRolNombre(RolNombre.ROLE_DOCENTE).get());
        if (nuevoUsuario.getRoles().contains("ESTUDIANTE"))
            roles.add(rolService.getByRolNombre(RolNombre.ROLE_ESTUDIANTE).get());
        if (nuevoUsuario.getRoles().contains("VISITANTE"))
            roles.add(rolService.getByRolNombre(RolNombre.ROLE_VISITANTE).get());
        if (nuevoUsuario.getRoles().contains("GERENCIA"))
            roles.add(rolService.getByRolNombre(RolNombre.ROLE_GERENCIA).get());
        usuario.setRoles(roles);
        usuarioService.save(usuario);
        return new ResponseEntity<>(new Mensaje("usuario guardado"), HttpStatus.CREATED);
    }

    /*
     * @PostMapping("/cambiar-rol")
     * public ResponseEntity<?> cambiarRolUsuario(@RequestParam String
     * nombreUsuario, @RequestParam String nuevoRol) {
     * if (!"ESTUDIANTE".equals(nuevoRol.toUpperCase())) {
     * return ResponseEntity.badRequest().body(new
     * Mensaje("El nuevo rol debe ser 'ESTUDIANTE'"));
     * }
     * log.info(
     * "**********************************************************************************************************************************************************************"
     * );
     * log.info("nombreUsuario: " + nombreUsuario);
     * Optional<Usuario> optionalUsuario =
     * iUsuarioService.buscarPorUsuarioNombre(nombreUsuario);//
     * usuarioService.getByNombreUsuario(nombreUsuario);
     * log.info(
     * "**********************************************************************************************************************************************************************"
     * );
     * log.info("optionalUsuario: " + optionalUsuario);
     * if (optionalUsuario.isPresent()) {
     * Usuario usuario = optionalUsuario.get();
     * log.info(
     * "**********************************************************************************************************************************************************************"
     * );
     * log.info("usuario-rol: " +
     * usuario.getRoles().iterator().next().getRolNombre().name());
     * if
     * ("ROLE_VISITANTE".equals(usuario.getRoles().iterator().next().getRolNombre().
     * name())) { // Verificar
     * // si el
     * // rol
     * // actual es VISITANTE
     * Set<Rol> nuevosRoles = new HashSet<>();
     * RolNombre rolNombre = RolNombre.valueOf("ROLE_" + nuevoRol.toUpperCase());
     * Optional<Rol> rol = rolService.getByRolNombre(rolNombre);
     * if (rol.isPresent()) {
     * nuevosRoles.add(rol.get());
     * usuario.setRoles(nuevosRoles);
     * usuarioService.save(usuario);
     * return ResponseEntity.ok(new
     * Mensaje("Rol de usuario cambiado exitosamente a " + nuevoRol));
     * } else {
     * return ResponseEntity.badRequest().body(new Mensaje("Rol " + nuevoRol +
     * " no encontrado"));
     * }
     * } else {
     * return ResponseEntity.badRequest()
     * .body(new Mensaje("El cambio de rol solo se permite para el rol VISITANTE"));
     * }
     * } else {
     * return ResponseEntity.badRequest().body(new
     * Mensaje("Usuario no encontrado"));
     * }
     * }
     */

    @PostMapping("/cambiar-rol")
    public ResponseEntity<?> cambiarRolUsuario(@RequestParam String nombreUsuario, @RequestParam String nuevoRol) {
        if (!"ESTUDIANTE".equals(nuevoRol.toUpperCase())) {
            return ResponseEntity.badRequest().body(new Mensaje("El nuevo rol debe ser 'ESTUDIANTE'"));
        }

        Optional<Usuario> optionalUsuario = iUsuarioService.buscarPorUsuarioNombre(nombreUsuario);
        if (optionalUsuario.isPresent()) {
            Usuario usuario = optionalUsuario.get();

            if ("ROLE_VISITANTE".equals(usuario.getRoles().iterator().next().getRolNombre().name())) {
                // Cambiar el rol del usuario
                Set<Rol> nuevosRoles = new HashSet<>();
                RolNombre rolNombre = RolNombre.valueOf("ROLE_" + nuevoRol.toUpperCase());
                Optional<Rol> rol = rolService.getByRolNombre(rolNombre);
                if (rol.isPresent()) {
                    nuevosRoles.add(rol.get());
                    usuario.setRoles(nuevosRoles);
                    usuarioService.save(usuario);// Actualiza el usuario existente con el nuevo rol

                    // Generar un nuevo token con los datos actualizados del usuario
                    UserDetails userDetails = userDetailsServicioImpl.loadUserByUsername(nombreUsuario);
                    Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null,
                            userDetails.getAuthorities());
                    String nuevoToken = jwtProvider.generateToken(authentication);

                    // Enviar el nuevo token al cliente como parte de la respuesta
                    JwtDto jwtDto = new JwtDto(nuevoToken);
                    return ResponseEntity.ok(jwtDto);
                } else {
                    return ResponseEntity.badRequest().body(new Mensaje("Rol " + nuevoRol + " no encontrado"));
                }
            } else {
                return ResponseEntity.badRequest()
                        .body(new Mensaje("El cambio de rol solo se permite para el rol VISITANTE"));
            }
        } else {
            return ResponseEntity.badRequest().body(new Mensaje("Usuario no encontrado"));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<JwtDto> login(@Valid @RequestBody LoginUsuario loginUsuario, BindingResult bindingResult) {
        log.info("login1: ");
        if (bindingResult.hasErrors())
            return new ResponseEntity(new Mensaje("campos mal puestos"), HttpStatus.BAD_REQUEST);

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginUsuario.getNombreUsuario(),
                        loginUsuario.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtProvider.generateToken(authentication);

        Optional<Usuario> optionalUsuario = usuarioService.getByNombreUsuario(loginUsuario.getNombreUsuario());
        log.info("login2: ");
        if (optionalUsuario.isPresent()) {
            Usuario usuario = optionalUsuario.get();
            JwtDto jwtDto = new JwtDto(jwt, usuario.getNombre(), usuario.getCorreo());
            log.info("login3: ");
            return new ResponseEntity<>(jwtDto, HttpStatus.OK);
        } else {
            // No se encontró el usuario
            log.info("login4: ");
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<JwtDto> refresh(@RequestBody JwtDto jwtDto) throws ParseException {
        String token = jwtProvider.refreshToken(jwtDto);
        String nombreUsuario = jwtProvider.getNombreUsuarioFromToken(token);
        UserDetails usuario = userDetailsServicioImpl.loadUserByUsername(nombreUsuario);
        JwtDto jwt = new JwtDto(token/* , usuario */);
        return new ResponseEntity<>(jwt, HttpStatus.OK);
    }
}
