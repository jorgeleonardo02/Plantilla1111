package Plantilla.apirest.controllers;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import Plantilla.apirest.common.CommonRestController;
import Plantilla.apirest.models.dao.ISubSeccionRepository;
import Plantilla.apirest.models.entity.SubSeccion;
import Plantilla.apirest.service.ISubSeccionService;


@RestController
@RequestMapping("/api/subsecciones")
public class SubSeccionRestController extends CommonRestController<SubSeccion, ISubSeccionService> {

    private final ISubSeccionService subSeccionService;

    @Autowired
    public SubSeccionRestController(ISubSeccionService subSeccionService) {
        super();
        this.subSeccionService = subSeccionService;
    }

    @GetMapping("/existe")
    public ResponseEntity<Boolean> existePorSeccionYNumero(
        @RequestParam @NotNull Long seccionId, 
        @RequestParam @NotNull @Min(1) Long numeroSubSeccion) {
        
        boolean existe = subSeccionService.existeIdSeccionNumeroSubSeccion(seccionId, numeroSubSeccion);
        return ResponseEntity.ok(existe);
    }
}
