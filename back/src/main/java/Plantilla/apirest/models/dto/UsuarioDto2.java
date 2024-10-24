package Plantilla.apirest.models.dto;

import java.util.HashSet;
import java.util.Set;

import Plantilla.apirest.seguridad.entidad.Rol;
import lombok.Data;

@Data
public class UsuarioDto2 {
	private Long id;
	private String nombre;
	private String nombreUsuario;
	private String correo;
	private Long limiteContenidos;
	private Set<Rol> roles;

	public UsuarioDto2() {
		super();
	}

	public UsuarioDto2(Long id, String nombre, String nombreUsuario, String correo, Long limiteContenidos) {
		this.id = id;
		this.nombre = nombre;
		this.nombreUsuario = nombreUsuario;
		this.correo = correo;
		this.limiteContenidos = limiteContenidos;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public String getNombreUsuario() {
		return nombreUsuario;
	}

	public void setNombreUsuario(String nombreUsuario) {
		this.nombreUsuario = nombreUsuario;
	}

	public String getCorreo() {
		return correo;
	}

	public void setCorreo(String correo) {
		this.correo = correo;
	}

	public Long getLimiteContenidos() {
		return limiteContenidos;
	}

	public void setLimiteContenidos(Long limiteContenidos) {
		this.limiteContenidos = limiteContenidos;
	}

}
