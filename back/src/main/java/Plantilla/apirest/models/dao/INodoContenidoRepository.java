package Plantilla.apirest.models.dao;

import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import Plantilla.apirest.models.entity.NodoContenido;

public interface INodoContenidoRepository extends JpaRepository<NodoContenido, Long>{

    @EntityGraph(attributePaths = {"children", "contenidoTexto"}) 
    @Query("SELECT n FROM NodoContenido n WHERE n.padre IS NULL")
    List<NodoContenido> findByPadreIsNull();
    
}
