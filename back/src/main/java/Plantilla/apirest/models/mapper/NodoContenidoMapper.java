package Plantilla.apirest.models.mapper;

import Plantilla.apirest.models.dto.NodoContenidoDTO;
import Plantilla.apirest.models.entity.NodoContenido;

import java.util.List;
import java.util.stream.Collectors;

/* public class NodoContenidoMapper {

    public static NodoContenidoDTO toDTO(NodoContenido entity) {
        if (entity == null) return null;

        NodoContenidoDTO dto = new NodoContenidoDTO();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setPath(entity.getPath());
        dto.setContenidoTexto(entity.getContenidoTexto());

        if (entity.getChildren() != null) {
            dto.setChildren(entity.getChildren().stream()
                .map(NodoContenidoMapper::toDTO)
                .collect(Collectors.toList()));
        }

        return dto;
    }

    public static NodoContenido toEntity(NodoContenidoDTO dto) {
        if (dto == null) return null;

        NodoContenido entity = new NodoContenido();
        entity.setId(dto.getId());
        entity.setName(dto.getName());
        entity.setPath(dto.getPath());
        entity.setContenidoTexto(dto.getContenidoTexto());

        if (dto.getChildren() != null) {
            entity.setChildren(dto.getChildren().stream()
                .map(NodoContenidoMapper::toEntity)
                .collect(Collectors.toList()));
        }

        return entity;
    }
} */
public class NodoContenidoMapper {

    public static NodoContenidoDTO toDTO(NodoContenido entity) {
        if (entity == null) return null;

        NodoContenidoDTO dto = new NodoContenidoDTO();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setPath(entity.getPath());
        dto.setNumeroSeccion(entity.getNumeroSeccion());
        dto.setContenidoTexto(entity.getContenidoTexto());

        if (entity.getChildren() != null && !entity.getChildren().isEmpty()) {
            List<NodoContenidoDTO> childrenDTOs = entity.getChildren()
                .stream()
                .map(NodoContenidoMapper::toDTO) // llamada recursiva
                .collect(Collectors.toList());
            dto.setChildren(childrenDTOs);
        }

        return dto;
    }

    public static NodoContenido toEntity(NodoContenidoDTO dto) {
        if (dto == null) return null;
        NodoContenido entity = new NodoContenido();
        entity.setId(dto.getId());
        entity.setName(dto.getName());
        entity.setPath(dto.getPath());
        entity.setNumeroSeccion(dto.getNumeroSeccion());
        entity.setContenidoTexto(dto.getContenidoTexto());
    
        if (dto.getChildren() != null && !dto.getChildren().isEmpty()) {
            List<NodoContenido> children = dto.getChildren()
                .stream()
                .map(childDto -> {
                    NodoContenido childEntity = toEntity(childDto);
                    childEntity.setPadre(entity); // El backend asigna el padre automáticamente
                    return childEntity;
                })
                .collect(Collectors.toList());
            entity.setChildren(children);
        }
        return entity;
    }    
}
