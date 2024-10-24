package Plantilla.apirest.models.dto;

import java.util.List;

import lombok.Data;

@Data
public class ContenidoDto2 {
	private Long id;
	private String nombreFoto;
	private String titulo;
	private String descripcion;
	private String etiquetas;
	private String fechaLimite;
	private String programa;
	private Long matriculados;
	private boolean comprado;
	private CategoriaDto categoria;
	private List<ContenidoUsuarioDto> listaContenidoUsuario;
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

	public String getTitulo() {
		return titulo;
	}

	public void setTitulo(String titulo) {
		this.titulo = titulo;
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

	public String getPrograma() {
		return programa;
	}

	public void setPrograma(String programa) {
		this.programa = programa;
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

	public List<ContenidoUsuarioDto> getListaContenidoUsuario() {
		return listaContenidoUsuario;
	}

	public void setListaContenidoUsuario(List<ContenidoUsuarioDto> listaContenidoUsuario) {
		this.listaContenidoUsuario = listaContenidoUsuario;
	}

}
