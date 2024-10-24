package Plantilla.apirest.models.dto;

import Plantilla.apirest.seguridad.enums.RolNombre;
import lombok.Data;

@Data
public class RolDto {
    private int id;
    private RolNombre rolNombre;
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public RolNombre getRolNombre() {
		return rolNombre;
	}
	public void setRolNombre(RolNombre rolNombre) {
		this.rolNombre = rolNombre;
	}

}
