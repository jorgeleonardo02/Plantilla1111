package Plantilla.apirest.controllers;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import Plantilla.apirest.common.CommonRestController;
import Plantilla.apirest.models.entity.Categoria;
import Plantilla.apirest.service.ICategoriaService;

//@CrossOrigin(origins = { "http://localhost:4200", "*" })
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/categorias")
@RestController
public class CategoriaRestController extends CommonRestController<Categoria, ICategoriaService> {

}
