package Plantilla.apirest.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;

/* import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import Plantilla.apirest.common.CommonRestController;
import Plantilla.apirest.models.entity.Contenido;
import Plantilla.apirest.models.entity.ContenidoUsuario;
import Plantilla.apirest.seguridad.entidad.Usuario;
import Plantilla.apirest.service.IContenidoService;
import Plantilla.apirest.service.IContenidoUsuarioServicio;
import Plantilla.apirest.service.service.IUsuarioService; */

//import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import Plantilla.apirest.common.CommonRestController;
import Plantilla.apirest.models.dto.UsuarioDto2;
import Plantilla.apirest.seguridad.dto.Mensaje;
import Plantilla.apirest.seguridad.entidad.Usuario;
import Plantilla.apirest.service.IUsuarioService;

//@CrossOrigin(origins = { "http://localhost:4200", "*" })
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("api/usuario")
@RestController
public class UsuarioControlador extends CommonRestController<Usuario, IUsuarioService> {

    private final IUsuarioService iUsuarioService;
    private final ModelMapper modelMapper;

    // @Autowired
    public UsuarioControlador(IUsuarioService iUsuarioService, ModelMapper modelMapper) {
        this.iUsuarioService = iUsuarioService;
        this.modelMapper = modelMapper;
    }

    // lista de solo usuarios rol docente
    @GetMapping("/docentes")
    public ResponseEntity<List<UsuarioDto2>> listaUsuariosDocentes() {
        List<Usuario> usuariosDocentes = this.iUsuarioService.listaUsuariosDocentes();
        List<UsuarioDto2> usuariosDocentesDto = usuariosDocentes.stream()
                .map(usuario -> modelMapper.map(usuario, UsuarioDto2.class))
                .collect(Collectors.toList());

        return ResponseEntity.ok(usuariosDocentesDto);
    }

    // lista solo de id de usuarios docente
    @GetMapping("/completo/docentes")
    public ResponseEntity<List<Long>> getIdsUsuariosDocentes() {
        List<Long> idsUsuariosDocentes = this.iUsuarioService.listaIdsUsuariosDocentes();
        return ResponseEntity.ok(idsUsuariosDocentes);
    }

    // usuario por nombre con su listaContenidoUsuario contenidos
    @GetMapping("/completo/nombre/{nombreUsuario}")
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> buscarPorUsuarioNombre(@PathVariable String nombreUsuario) {
        if (nombreUsuario == null) {
            return null;
            // return new ResponseEntity<>(new Mensaje("El nombre de usuario es nulo")/* ,
            // HttpStatus.BAD_REQUEST */);
        }
        Optional<Usuario> usuarioOptional = iUsuarioService.buscarPorUsuarioNombre(nombreUsuario);
        if (usuarioOptional.isPresent()) {
            Usuario usuario = usuarioOptional.get();
            // Realiza las operaciones necesarias con el usuario
            return ResponseEntity.ok(usuario);// si hay usuario devuelve status HTTP 200 (OK)
        } else {
            return null;
            // return new ResponseEntity<>(new Mensaje("Usuario no encontrado")/* ,
            // HttpStatus.NOT_FOUND */);
        }
    }

    // usuario por nombre sin password ni listaContenidoUsuario
    @GetMapping("/nombre/{nombreUsuario}")
    public ResponseEntity<?> buscarPorUsuarioDto2Nombre(@PathVariable String nombreUsuario) {
        Optional<Usuario> usuarioOptional = iUsuarioService.buscarPorUsuarioNombre(nombreUsuario);
        if (usuarioOptional.isPresent()) {
            Usuario usuario = usuarioOptional.get();
            // Realizar la conversión de Usuario a UsuarioDto
            UsuarioDto2 usuarioDto = new UsuarioDto2();
            usuarioDto.setId(usuario.getId());
            usuarioDto.setNombre(usuario.getNombre());
            usuarioDto.setNombreUsuario(usuario.getNombreUsuario());
            usuarioDto.setCorreo(usuario.getCorreo());
            usuarioDto.setLimiteCursos(usuario.getLimiteCursos());
            usuarioDto.setRoles(usuario.getRoles());
            return ResponseEntity.ok(usuarioDto); // Devuelve el UsuarioDto en lugar del Usuario
        } else {
            return ResponseEntity.ok(null);
        }
    }

    @PutMapping("/{id}") // con la id obtenemos de la base de datos y actualizamos
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<?> EditarUsuario(@RequestBody Usuario usuario, @PathVariable Long id) {// modificado
        Usuario usuarioActual = null;
        Map<String, Object> mapa = new HashMap<>();
        usuarioActual = iService.obtenerElementoPorID(id);// Pedido por id
        if (usuarioActual == null) {
            mapa.put("mensaje",
                    "Error: no se puede editar el usuario id: " + id.toString() + ", no existe en la base de datos");
            return new ResponseEntity<>(mapa, HttpStatus.NOT_FOUND);// Estatus 404
        }
        try {
            usuarioActual.setId(usuario.getId());
            usuarioActual.setCorreo(usuario.getCorreo());
            usuarioActual.setNombre(usuario.getNombre());
            usuarioActual.setNombreUsuario(usuario.getNombreUsuario());
            usuarioActual.setPassword(usuario.getPassword());
            usuarioActual.setLimiteCursos(usuario.getLimiteCursos());
            usuarioActual.setRoles(usuario.getRoles());
            usuarioActual.setListaCursoUsuario(usuario.getListaCursoUsuario());

            usuarioActual = iService.guardarElemento(usuarioActual);// persistir o guardar
        } catch (DataAccessException e) {
            mapa.put("mensaje", "Error al actualizar el usuario en la base de datos");
            mapa.put("error", e.getMessage().concat(e.getMostSpecificCause().getMessage()));// por que ocurrio el error
            return new ResponseEntity<>(mapa, HttpStatus.INTERNAL_SERVER_ERROR);// Staus
        }
        mapa.put("mensaje", "El usuario ha sido actualizado con éxitos!");
        mapa.put("contenido", usuarioActual);
        return new ResponseEntity<>(mapa, HttpStatus.CREATED);
    }
}