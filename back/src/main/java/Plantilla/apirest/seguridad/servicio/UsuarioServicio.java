package Plantilla.apirest.seguridad.servicio;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import Plantilla.apirest.seguridad.entidad.Usuario;
import Plantilla.apirest.seguridad.repositorio.UsuarioRepositorio;

@Service
@Transactional // Coherencia de la BD si falla una operacion vuelve al estado anterior
public class UsuarioServicio {

    @Autowired
    UsuarioRepositorio usuarioRepositorio;

    public Optional<Usuario> getByNombreUsuario(String nombreUsuario) {
        return usuarioRepositorio.findByNombreUsuario(nombreUsuario);
    }

    public boolean existsByNombreUsuario(String nombreUsuario) {
        return usuarioRepositorio.existsByNombreUsuario(nombreUsuario);
    }

    public boolean existsByCorreo(String correo) {
        return usuarioRepositorio.existsByCorreo(correo);
    }

    // Para guardar
    public void save(Usuario usuario) {
        usuarioRepositorio.save(usuario);
    }

}
