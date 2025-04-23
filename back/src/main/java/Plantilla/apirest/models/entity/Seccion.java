package Plantilla.apirest.models.entity;

import lombok.Data;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

/* @Data
@Entity
@Table 
public class Seccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "numero_seccion")
    private Long numeroSeccion;

    @Column(name = "nombre_seccion")
    private String nombreSeccion;

    @ManyToOne
    @JoinColumn(name = "curso_id", nullable = true)
    @JsonIgnoreProperties({ "listaCursoUsuario", "handler", "hibernateLazyInitializer" })
    private Curso curso;

    @OneToMany(mappedBy = "seccion", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SubSeccion> listaSubSeccion;
}  */

@Data
@Entity
@Table
public class Seccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "numero_seccion")
    private Long numeroSeccion;

    @Column(name = "nombre_seccion")
    private String nombreSeccion;

    @Column(name = "contenido", columnDefinition = "text")
    private String contenido; // Esto se mapea desde y hacia JSON. */

    @ManyToOne
    @JoinColumn(name = "curso_id", nullable = true)
    @JsonIgnoreProperties({ "listaCursoUsuario", "handler", "hibernateLazyInitializer" })
    private Curso curso;

    // Nueva relación jerárquica
    @ManyToOne
    @JoinColumn(name = "padre_id", nullable = true)
    @JsonIgnoreProperties({ "hijo", "handler", "hibernateLazyInitializer" })
    private Seccion padre;

    @OneToMany(mappedBy = "padre", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties({ "padre", "handler", "hibernateLazyInitializer" })
    private List<Seccion> hijo;
}