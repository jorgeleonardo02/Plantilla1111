package Plantilla.apirest.controllers;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import Plantilla.apirest.common.CommonRestController;
import Plantilla.apirest.models.entity.Seccion;
import Plantilla.apirest.service.SeccionService;

//@CrossOrigin(origins = { "http://localhost:4200", "*" })
//@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/secciones")
public class SeccionRestController extends CommonRestController<Seccion, SeccionService> {
    // No necesitas código adicional aquí, ya que hereda todo de
    // CommonRestController
}
