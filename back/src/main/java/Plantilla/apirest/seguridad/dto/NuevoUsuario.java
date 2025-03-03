package Plantilla.apirest.seguridad.dto;

import java.util.HashSet;
import java.util.Set;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

import lombok.Data;

/* Esta clase se utiliza para la creación de nuevos usuarios*/
@Data
public class NuevoUsuario {
	@NotBlank // No puede ser nulo , no puede ser una cadena vacia, ni espacios en blanco
	private String nombre;
	@NotBlank
	private String nombreUsuario;
	@Email
	private String correo;
	@NotBlank
	private String password;
	private Long limiteCursos;
	private Set<String> roles = new HashSet<>();// Por que se van a utilisar Json para mejorar el trafico. COn una
														// API
	// Rest es mejor usar cadenas (String)

	// Se Generan los Getter y Setter

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

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public Set<String> getRoles() {
		return roles;
	}

	public void setRoles(Set<String> roles) {
		this.roles = roles;
	}

	public Long getLimiteCursos() {
		return limiteCursos;
	}

	public void setLimiteCursos(Long limiteCursos) {
		this.limiteCursos = limiteCursos;
	}

}
