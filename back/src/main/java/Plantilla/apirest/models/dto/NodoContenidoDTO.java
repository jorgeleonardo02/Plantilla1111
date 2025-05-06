package Plantilla.apirest.models.dto;

import java.util.ArrayList;
import java.util.List;

import lombok.Data;

@Data
public class NodoContenidoDTO {
    private Long id;
    private String name;
    private String path;
    private String numeroSeccion;
    private String contenidoTexto;
    private List<NodoContenidoDTO> children = new ArrayList<>();
}