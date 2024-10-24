package Plantilla.apirest.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import Plantilla.apirest.models.entity.Cliente;
import Plantilla.apirest.service.ClienteServicioImpl;

@RestController
@RequestMapping("/api")
public class ClienteControlador {

    ClienteServicioImpl clienteServicioImpl;

    @GetMapping("/clientes")
    List<Cliente> listaCientes() {
        return clienteServicioImpl.mostrarListaContenidos();
    }
}
