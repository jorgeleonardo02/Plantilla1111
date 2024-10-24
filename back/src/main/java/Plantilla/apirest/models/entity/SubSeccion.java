package Plantilla.apirest.models.entity;

import lombok.Data;
import javax.persistence.*;

@Data
@Entity
@Table(name = "subseccion")
public class SubSeccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "numero_subseccion")
    private Long numeroSubSeccion;

    @Column(name = "nombre_subseccion")
    private String nombreSubseccion;

    @Column(name = "contenido_tipo")
    private String contenidoTipo;

    @Column(name = "contenido_url")
    private String contenidoUrl;

    @Column(name = "contenido_texto")
    private String contenidoTexto;

    @ManyToOne
    @JoinColumn(name = "seccion_id", nullable = false)
    private Seccion seccion;
}
