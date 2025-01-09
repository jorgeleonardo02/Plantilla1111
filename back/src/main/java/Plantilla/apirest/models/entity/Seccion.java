package Plantilla.apirest.models.entity;

import lombok.Data;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

@Data
@Entity
@Table //(name = "seccion")
public class Seccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "numero_seccion")
    private Long numeroSeccion;

    @Column(name = "nombre_seccion")
    private String nombreSeccion;

    @ManyToOne
    @JoinColumn(name = "contenido_id", nullable = true)
    @JsonIgnoreProperties({ "listaContenidoUsuario", "handler", "hibernateLazyInitializer" })
    private Contenido contenido;

    @OneToMany(mappedBy = "seccion", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SubSeccion> listaSubSeccion;
} 