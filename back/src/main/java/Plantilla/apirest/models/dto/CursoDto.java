package Plantilla.apirest.models.dto;

import java.util.List;
import Plantilla.apirest.models.entity.Curso;
import Plantilla.apirest.models.entity.CursoUsuario;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CursoDto {
	private Long id;
	private String nombreFoto;
	private String nombre;
	private String descripcion;
	private String etiquetas;
	private String fechaLimite;
	private Long matriculados;
	private Boolean activado;
	private CategoriaDto categoria;
	private Long categoriaId;
	private Long precio;
	private double porcentajeAdmin;
	private double calificacion;
	private List<CursoUsuario> listaCursoUsuario;
	private List<String> listaHabilidades;

	public CursoDto() {
	}

	public CursoDto(Curso curso) {
		this.id = curso.getId();
		this.nombreFoto = curso.getNombreFoto();
		this.nombre = curso.getNombre();
		this.descripcion = curso.getDescripcion();
		this.etiquetas = curso.getEtiquetas();
		this.fechaLimite = curso.getFechaLimite();
		this.matriculados = curso.getMatriculados();
		this.activado = curso.getActivado();
		this.precio = curso.getPrecio();
		this.porcentajeAdmin = curso.getPorcentajeAdmin();
		this.calificacion = curso.getCalificacion();
		this.categoria = new CategoriaDto(curso.getCategoria());
		this.listaHabilidades = curso.getListaHabilidades(); // Cargar habilidades
	}

	public CursoDto(Long id, String nombreFoto, String nombre, String descripcion, String etiquetas,
			String fechaLimite, List<String> listaHabilidades, Long matriculados, Boolean activado,
			Long precio, double porcentajeAdmin, double calificacion, CategoriaDto categoria) {
		this.id = id;
		this.nombreFoto = nombreFoto;
		this.nombre = nombre;
		this.descripcion = descripcion;
		this.etiquetas = etiquetas;
		this.fechaLimite = fechaLimite;
		this.listaHabilidades = listaHabilidades;
		this.matriculados = matriculados;
		this.activado = activado;
		this.categoria = categoria;
		this.precio = precio;
		this.porcentajeAdmin = porcentajeAdmin;
		this.calificacion = calificacion;
	}
}