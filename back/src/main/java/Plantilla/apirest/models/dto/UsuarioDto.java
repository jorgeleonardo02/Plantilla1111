package Plantilla.apirest.models.dto;

import lombok.Data;

@Data
public class UsuarioDto {
	private Long id;
	private String nombreUsuario;

	public UsuarioDto() {
		super();
	}

	public UsuarioDto(Long id, String nombreUsuario) {
		this.id = id;
		this.nombreUsuario = nombreUsuario;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getNombreUsuario() {
		return nombreUsuario;
	}

	public void setNombreUsuario(String nombreUsuario) {
		this.nombreUsuario = nombreUsuario;
	}

}
