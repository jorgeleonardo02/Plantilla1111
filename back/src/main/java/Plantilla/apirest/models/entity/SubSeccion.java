package Plantilla.apirest.models.entity;

import lombok.Data;
import javax.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@Entity
@Table //(name = "subseccion")
public class SubSeccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //@Column(name = "numero_subseccion")
    private Long numeroSubSeccion;

    //@Column(name = "nombre_subseccion")
    private String nombreSubSeccion;
 
    @Column(name = "contenido", columnDefinition = "text")
    // @Convert(converter = ContenidoJsonConverter.class)
    private String contenido; // Esto se mapea desde y hacia JSON. */

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seccion_id", nullable = false)
    @JsonIgnoreProperties({ "listaSubSeccion", "handler", "hibernateLazyInitializer" })
    private Seccion seccion;

    
   
}

