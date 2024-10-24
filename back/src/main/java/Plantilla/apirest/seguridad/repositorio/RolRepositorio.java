package Plantilla.apirest.seguridad.repositorio;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import Plantilla.apirest.seguridad.entidad.Rol;
import Plantilla.apirest.seguridad.enums.RolNombre;

@Repository
public interface RolRepositorio extends JpaRepository<Rol, Long> {
    // Encontrar por Rol nombre
    Optional<Rol> findByRolNombre(RolNombre rolNombre);
}