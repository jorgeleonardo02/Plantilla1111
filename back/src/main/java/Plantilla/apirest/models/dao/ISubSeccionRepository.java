package Plantilla.apirest.models.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import Plantilla.apirest.models.entity.SubSeccion;

@Repository
public interface ISubSeccionRepository extends JpaRepository<SubSeccion, Long> {
    boolean existsBySeccionIdAndNumeroSubSeccion(Long seccionId, Long numeroSubSeccion);
}

