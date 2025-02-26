package Plantilla.apirest.models.entity;

import java.io.Serializable;
import java.util.List;
import javax.persistence.Column;
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
@Table(name = "contenidos")
@Data
public class Contenido implements Serializable {

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
	private String programa;
	private Long matriculados;
	private Boolean activado;
	private Long precio;
	private double porcentajeAdmin = 0.2;
	private double calificacion;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "categoria_id")
	@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
	private Categoria categoria;

	// @JsonIgnore
	@OneToMany(mappedBy = "contenido", fetch = FetchType.LAZY)
	@JsonIgnoreProperties({ "contenido", "handler", "hibernateLazyInitializer" })
	private List<ContenidoUsuario> listaContenidoUsuario;

	// constructor vacío
	public Contenido() {
	}

	public Contenido(Long id, String nombreFoto, String nombre, String descripcion, String etiquetas,
			String fechaLimite, String programa, Long matriculados, Boolean activado, Categoria categoria,
			Long precio, double porcentajeAdmin, double calificacion) {
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
		this.porcentajeAdmin = porcentajeAdmin;// valorAdmin;
		this.calificacion = calificacion;
	}

	public List<ContenidoUsuario> getListaContenidoUsuario() {
		return listaContenidoUsuario;
	}

	public void setListaContenidoUsuario(List<ContenidoUsuario> listaContenidoUsuario) {
		this.listaContenidoUsuario = listaContenidoUsuario;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}

}
