package Plantilla.apirest.models.entity;

import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import Plantilla.apirest.seguridad.entidad.Usuario;
import lombok.Data;

@Entity
@Data
public class CursoUsuario implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "listaCursoUsuario", "handler", "hibernateLazyInitializer" })
    private Curso curso;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "password", "listaCursoUsuario", "handler", "hibernateLazyInitializer" })
    private Usuario usuario;

    public CursoUsuario() {

    }

    public CursoUsuario(Curso curso, Usuario usuario) {
        this.curso = curso;
        this.usuario = usuario;
    }

    @Override
    public String toString() {
        return "CursoUsuario{" +
                "id=" + id +
                ", curso=" + curso.getId() +
                ", usuario=" + usuario.getId() +
                '}';
    }

    /*
     * public Long getId() {
     * return id;
     * }
     * 
     * public void setId(Long id) {
     * this.id = id;
     * }
     * 
     * public Contenido getContenido() {
     * return contenido;
     * }
     * 
     * public void setContenido(Contenido contenido) {
     * this.contenido = contenido;
     * }
     * 
     * public Usuario getUsuario() {
     * return usuario;
     * }
     * 
     * public void setUsuario(Usuario usuario) {
     * this.usuario = usuario;
     * }
     */

    public static long getSerialversionuid() {
        return serialVersionUID;
    }

}
