package Plantilla.apirest.seguridad.servicio;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import Plantilla.apirest.seguridad.entidad.Rol;
import Plantilla.apirest.seguridad.enums.RolNombre;
import Plantilla.apirest.seguridad.repositorio.RolRepositorio;

@Service
@Transactional
public class RolServicio {
    @Autowired
    RolRepositorio rolRepositorio;

    public Optional<Rol> getByRolNombre(RolNombre rolNombre) {
        return rolRepositorio.findByRolNombre(rolNombre);
    }

    public void save(Rol rol) {
        rolRepositorio.save(rol);
    }
}
