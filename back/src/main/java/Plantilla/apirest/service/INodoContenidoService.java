package Plantilla.apirest.service;

import java.util.List;

import Plantilla.apirest.models.dto.NodoContenidoDTO;
import Plantilla.apirest.models.entity.NodoContenido;

public interface INodoContenidoService {
    NodoContenido guardar(NodoContenido nodo);
    List<NodoContenido> obtenerTodos();
    NodoContenido obtenerPorId(Long id);
    void eliminar(Long id);
    List<NodoContenidoDTO> obtenerNodosRaiz();
    NodoContenidoDTO guardarNodo(NodoContenidoDTO dto);
    NodoContenidoDTO obtenerDTOPorId(Long id);
}
