package Plantilla.apirest.seguridad.repositorio;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import Plantilla.apirest.seguridad.entidad.Usuario;

@Repository
public interface UsuarioRepositorio extends JpaRepository<Usuario, Long> {
	// Tener un usuario apartir de nombre usuario
	Optional<Usuario> findByNombreUsuario(String nombreUsuario);

	// Si existe Usuario por nombreUsuario o por correo
	boolean existsByNombreUsuario(String nombreUsuario);

	boolean existsByCorreo(String correo);

}
