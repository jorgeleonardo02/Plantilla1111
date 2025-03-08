package Plantilla.apirest.models.dto;

import java.util.List;

import lombok.Data;

@Data
public class CursoDto2 {
	private Long id;
	private String nombreFoto;
	private String nombre;
	private String descripcion;
	private String etiquetas;
	private String fechaLimite;
	private List<String> listaHabilidades;
	private Long matriculados;
	private boolean comprado;
	private CategoriaDto categoria;
	private List<CursoUsuarioDto> listaCursoUsuario;
	private Long precio;
	private double valorAdmin;
	private double calificacion;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getNombreFoto() {
		return nombreFoto;
	}

	public void setNombreFoto(String nombreFoto) {
		this.nombreFoto = nombreFoto;
	}

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public String getDescripcion() {
		return descripcion;
	}

	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}

	public String getEtiquetas() {
		return etiquetas;
	}

	public void setEtiquetas(String etiquetas) {
		this.etiquetas = etiquetas;
	}

	public String getFechaLimite() {
		return fechaLimite;
	}

	public void setFechaLimite(String fechaLimite) {
		this.fechaLimite = fechaLimite;
	}



	public Long getMatriculados() {
		return matriculados;
	}

	public void setMatriculados(Long matriculados) {
		this.matriculados = matriculados;
	}

	public boolean isComprado() {
		return comprado;
	}

	public void setComprado(boolean comprado) {
		this.comprado = comprado;
	}

	public CategoriaDto getCategoria() {
		return categoria;
	}

	public void setCategoria(CategoriaDto categoria) {
		this.categoria = categoria;
	}

	public List<CursoUsuarioDto> getListaCursoUsuario() {
		return listaCursoUsuario;
	}

	public void setListaCursoUsuario(List<CursoUsuarioDto> listaCursoUsuario) {
		this.listaCursoUsuario = listaCursoUsuario;
	}

}
