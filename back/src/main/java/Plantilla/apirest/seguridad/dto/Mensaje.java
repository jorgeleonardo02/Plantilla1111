package Plantilla.apirest.seguridad.dto;

import lombok.Data;

@Data
public class Mensaje {

	private String mensaje;
	//private String error;

	public Mensaje(String mensaje/*, String error*/) {
		this.mensaje = mensaje;
		//this.error = error;
	}

	/*public Mensaje(String mensaje) {
		this.mensaje = mensaje;
	}*/

	public String getMensaje() {
		return mensaje;
	}

	public void setMensaje(String mensaje) {
		this.mensaje = mensaje;
	}

}
