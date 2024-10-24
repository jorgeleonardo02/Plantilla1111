package Plantilla.apirest.service;

import org.springframework.stereotype.Service;
import Plantilla.apirest.common.CommonServiceImpl;
import Plantilla.apirest.models.dao.ISubSeccionRepository;
import Plantilla.apirest.models.entity.SubSeccion;

@Service
public class SubSeccionService extends CommonServiceImpl<SubSeccion, ISubSeccionRepository> {

    public SubSeccionService(ISubSeccionRepository subSeccionRepository) {
        super(subSeccionRepository);
    }

}
