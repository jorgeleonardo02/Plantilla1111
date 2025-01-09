package Plantilla.apirest.models.entity;

import lombok.Data;

import java.sql.Array;
import java.util.Map;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.vladmihalcea.hibernate.type.json.JsonType;
import org.hibernate.annotations.Type;
import com.vladmihalcea.hibernate.type.json.JsonType;
import org.hibernate.annotations.Type;

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

    //@Column(name = "contenido_tipo")
    //private String contenidoTipo;

    //@Column(name = "contenido_url")
    //private String contenidoUrl;

     /* @Column(name = "contenido_texto")
    private String contenidoTexto; */

   /*  @Type(type = "json")
    @Column(columnDefinition = "jsonb") // Para PostgreSQL
    private ContenidoJson contenido;
 */
    //@Type(JsonType.class)
    //@Column(name = "contenido", columnDefinition = "text") // Usa "jsonb" si estás en PostgreSQL
    //private ContenidoJson contenido;

    /* @Type(type = "text")
    @Column(name = "contenido", columnDefinition = "text")
    private Map<String, String> contenido; */

    
    
    @Column(name = "contenido", columnDefinition = "text")
    // @Convert(converter = ContenidoJsonConverter.class)
    private String contenido; // Esto se mapea desde y hacia JSON. */

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seccion_id", nullable = false)
    @JsonIgnoreProperties({ "listaSubSeccion", "handler", "hibernateLazyInitializer" })
    private Seccion seccion;

    
   
}

