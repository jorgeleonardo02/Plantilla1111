package Plantilla.apirest.models.dao;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import Plantilla.apirest.models.entity.Categoria;

@Repository
public interface ICategoriasDao extends PagingAndSortingRepository<Categoria, Long> {

}
