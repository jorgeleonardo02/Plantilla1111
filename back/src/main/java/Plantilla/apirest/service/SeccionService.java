package Plantilla.apirest.service;

import org.springframework.stereotype.Service;
import Plantilla.apirest.common.CommonServiceImpl;
import Plantilla.apirest.models.dao.ISeccionRepository;
import Plantilla.apirest.models.entity.Seccion;

@Service
public class SeccionService extends CommonServiceImpl<Seccion, ISeccionRepository> {

    public SeccionService(ISeccionRepository seccionRepository) {
        super(seccionRepository);
    }

}
