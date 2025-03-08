package Plantilla.apirest.models.entity;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.CollectionTable;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Entity
@Table(name = "cursos")
@Data
public class Curso implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY) // Postgres
	private Long id;

	private String nombreFoto;
	@NotNull
	@Column(unique = true)
	private String nombre;
	private String descripcion;
	private String etiquetas;
	private String fechaLimite;
	private Long matriculados;
	private Boolean activado;
	private Long precio;
	private double porcentajeAdmin = 0.2;
	private double calificacion;

	// Nueva lista de habilidades
	@ElementCollection
	@CollectionTable(name = "curso_habilidades", joinColumns = @JoinColumn(name = "curso_id"))
	@Column(name = "habilidad")
	private List<String> listaHabilidades = new ArrayList<>();

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "categoria_id")
	@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
	private Categoria categoria;

	// @JsonIgnore
	@OneToMany(mappedBy = "curso", fetch = FetchType.LAZY)
	@JsonIgnoreProperties({ "curso", "handler", "hibernateLazyInitializer" })
	private List<CursoUsuario> listaCursoUsuario;

	// constructor vacío
	public Curso() {
	}

	public Curso(Long id, String nombreFoto, String nombre, String descripcion, String etiquetas,
			String fechaLimite, List<String> listaHabilidades, Long matriculados, Boolean activado, Categoria categoria,
			Long precio, double porcentajeAdmin, double calificacion) {
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
		this.porcentajeAdmin = porcentajeAdmin;// valorAdmin;
		this.calificacion = calificacion;
	}

	public List<CursoUsuario> getListaCursoUsuario() {
		return listaCursoUsuario;
	}

	public void setListaCursoUsuario(List<CursoUsuario> listaCursoUsuario) {
		this.listaCursoUsuario = listaCursoUsuario;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}

}
