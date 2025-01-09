package Plantilla.apirest.models.entity;


import java.util.List;
import java.util.Map;
import lombok.Data;
@Data
public class ContenidoJson {
    private List<Operacion> ops;

    @Data
    public static class Operacion {
        private String insert;
        private Map<String, Object> attributes;
    }
}