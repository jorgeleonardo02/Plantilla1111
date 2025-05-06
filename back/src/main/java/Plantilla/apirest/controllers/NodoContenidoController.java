package Plantilla.apirest.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import Plantilla.apirest.models.dto.NodoContenidoDTO;
import Plantilla.apirest.models.entity.NodoContenido;
import Plantilla.apirest.service.INodoContenidoService;

@RestController
@RequestMapping("/api/nodos")
public class NodoContenidoController {

    @Autowired
    private INodoContenidoService service;

    @GetMapping
    public List<NodoContenido> listar() {
        return service.obtenerTodos();
    }

    @PostMapping
    public NodoContenido crear(@RequestBody NodoContenido nodo) {
        return service.guardar(nodo);
    }

    /* @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
    } */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/raiz")
    public ResponseEntity<List<NodoContenidoDTO>> obtenerNodosRaiz() {
        return ResponseEntity.ok(service.obtenerNodosRaiz());
    }

    @PostMapping("/dto")
    public ResponseEntity<NodoContenidoDTO> guardarNodo(@RequestBody NodoContenidoDTO dto) {
        return ResponseEntity.ok(service.guardarNodo(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<NodoContenidoDTO> obtenerPorId(@PathVariable Long id) {
        NodoContenidoDTO dto = service.obtenerDTOPorId(id);
        return dto != null ? ResponseEntity.ok(dto) : ResponseEntity.notFound().build();
    }
}