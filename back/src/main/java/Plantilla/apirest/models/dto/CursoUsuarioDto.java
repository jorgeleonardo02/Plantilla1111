package Plantilla.apirest.models.dto;

import lombok.Data;

@Data
public class CursoUsuarioDto {
    private Long id;
    private UsuarioDto2 usuario;
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public UsuarioDto2 getUsuario() {
		return usuario;
	}
	public void setUsuario(UsuarioDto2 usuario) {
		this.usuario = usuario;
	}

}
