package Plantilla.apirest.models.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import Plantilla.apirest.models.entity.Seccion;

@Repository
public interface ISeccionRepository extends JpaRepository<Seccion, Long> {
    boolean existsByNumeroSeccion(Long numeroSeccion);
}

