package Plantilla.apirest.models.dto;

public class ContenidoUsuarioDto3 {

    private Long id;
    private ContenidoDto contenido;

    // Constructor, getters y setters

    public ContenidoUsuarioDto3(Long id, ContenidoDto contenido) {
        this.id = id;
        this.contenido = contenido;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ContenidoDto getContenido() {
        return contenido;
    }

    public void setContenido(ContenidoDto contenido) {
        this.contenido = contenido;
    }
}