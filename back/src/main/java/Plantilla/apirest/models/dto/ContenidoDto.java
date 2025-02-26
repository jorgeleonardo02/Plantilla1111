package Plantilla.apirest.models.dto;

import java.util.List;

import Plantilla.apirest.models.entity.Contenido;
import Plantilla.apirest.models.entity.ContenidoUsuario;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ContenidoDto {
	private Long id;
	private String nombreFoto;
	private String nombre;
	private String descripcion;
	private String etiquetas;
	private String fechaLimite;
	private String programa;
	private Long matriculados;
	private Boolean activado;
	private CategoriaDto categoria;
	private Long categoriaId;
	private Long precio;
	private double porcentajeAdmin;
	private double calificacion;
	private List<ContenidoUsuario> listaContenidoUsuario;

	public ContenidoDto() {
	}

	public ContenidoDto(Contenido contenido) {
		this.id = contenido.getId();
		this.nombreFoto = contenido.getNombreFoto();
		this.nombre = contenido.getNombre();
		this.descripcion = contenido.getDescripcion();
		this.etiquetas = contenido.getEtiquetas();
		this.fechaLimite = contenido.getFechaLimite();
		this.programa = contenido.getPrograma();
		this.matriculados = contenido.getMatriculados();
		this.activado = contenido.getActivado();
		this.precio = contenido.getPrecio();
		this.porcentajeAdmin = contenido.getPorcentajeAdmin();
		this.calificacion = contenido.getCalificacion();
		this.categoria = new CategoriaDto(contenido.getCategoria());
	}

	public ContenidoDto(Long id, String nombreFoto, String nombre, String descripcion, String etiquetas,
			String fechaLimite, String programa, Long matriculados, Boolean activado,
			Long precio, double porcentajeAdmin, double calificacion, CategoriaDto categoria) {
		this.id = id;
		this.nombreFoto = nombreFoto;
		this.nombre = nombre;
		this.descripcion = descripcion;
		this.etiquetas = etiquetas;
		this.fechaLimite = fechaLimite;
		this.programa = programa;
		this.matriculados = matriculados;
		this.activado = activado;
		this.categoria = categoria;
		this.precio = precio;
		this.porcentajeAdmin = porcentajeAdmin;
		this.calificacion = calificacion;
	}
}