package Plantilla.apirest.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import Plantilla.apirest.models.dao.IClienteDao;
import Plantilla.apirest.models.entity.Cliente;

@Service
public class ClienteServicioImpl implements IClienteServicio {

    private IClienteDao iClienteDao;

    @Override
    @Transactional(readOnly = true)
    public List<Cliente> mostrarListaContenidos() {
        return (List<Cliente>) iClienteDao.findAll();
    }

}
