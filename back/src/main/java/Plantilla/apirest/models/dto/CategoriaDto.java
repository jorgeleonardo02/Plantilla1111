package Plantilla.apirest.models.dto;

import Plantilla.apirest.models.entity.Categoria;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

/* @Data
public class CategoriaDto {
	private Long id;
	private String nombre;

	public CategoriaDto() {
		super();
	}

	public CategoriaDto(Categoria categoria) {
		this.id = categoria.getId();
		this.nombre = categoria.getNombre();
	}

	public CategoriaDto(Long id, String nombre) {
		this.id = id;
		this.nombre = nombre;
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

}
 */

@Getter
@Setter
public class CategoriaDto {
	private Long id;
	private String nombre;

	public CategoriaDto() {
	}

	public CategoriaDto(Categoria categoria) {
		this.id = categoria.getId();
		this.nombre = categoria.getNombre();
	}

	public CategoriaDto(Long id, String nombre) {
		this.id = id;
		this.nombre = nombre;
	}
}