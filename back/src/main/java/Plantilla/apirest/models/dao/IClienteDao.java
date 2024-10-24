package Plantilla.apirest.models.dao;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import Plantilla.apirest.models.entity.Cliente;

@Repository
public interface IClienteDao extends PagingAndSortingRepository<Cliente, Long> {

}
