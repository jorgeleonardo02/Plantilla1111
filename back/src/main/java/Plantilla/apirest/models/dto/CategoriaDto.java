package Plantilla.apirest.models.dto;

import Plantilla.apirest.models.entity.Categoria;
import lombok.Getter;
import lombok.Setter;

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