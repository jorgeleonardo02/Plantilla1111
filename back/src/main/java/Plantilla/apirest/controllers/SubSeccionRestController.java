package Plantilla.apirest.controllers;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import Plantilla.apirest.common.CommonRestController;
import Plantilla.apirest.models.entity.SubSeccion;
import Plantilla.apirest.service.SubSeccionService;

//@CrossOrigin(origins = { "http://localhost:4200", "*" })
//@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/subsecciones")
public class SubSeccionRestController extends CommonRestController<SubSeccion, SubSeccionService> {
    // No necesitas código adicional aquí, ya que hereda todo de
    // CommonRestController
}
