package Plantilla.apirest.controllers;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import Plantilla.apirest.common.CommonRestController;
import Plantilla.apirest.models.entity.Seccion;
import Plantilla.apirest.service.ISeccionService;

//@CrossOrigin(origins = { "http://localhost:4200", "*" })
//@CrossOrigin(origins = "http://localhost:4200")

/* @RestController
@RequestMapping("/api/secciones")
public class SeccionRestController extends CommonRestController <Seccion, ISeccionService> {

    private final ISeccionService seccionService;

    public SeccionRestController(ISeccionService seccionService) {
        super(seccionService);
    }

    @GetMapping("/existe/{numeroSeccion}")
    public ResponseEntity<?> verificarNumeroSeccion(@PathVariable Long numeroSeccion) {
        boolean existe = seccionService.numeroSeccionExiste(numeroSeccion);
        return ResponseEntity.ok(Map.of("existe", existe));
    }
} */

@RestController
@RequestMapping("/api/secciones")
public class SeccionRestController extends CommonRestController<Seccion, ISeccionService> {

    public SeccionRestController() {
        // Constructor vacío para permitir que Spring maneje la inyección.
    }

    @GetMapping("/existe/{numeroSeccion}")
    public ResponseEntity<?> verificarNumeroSeccion(@PathVariable Long numeroSeccion) {
        boolean existe = iService.numeroSeccionExiste(numeroSeccion);
        return ResponseEntity.ok(Map.of("existe", existe));
    }
}
