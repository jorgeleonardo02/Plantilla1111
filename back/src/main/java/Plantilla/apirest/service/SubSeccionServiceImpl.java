package Plantilla.apirest.service;

import org.springframework.stereotype.Service;

import Plantilla.apirest.common.CommonServiceImpl;
import Plantilla.apirest.models.dao.ISeccionRepository;
import Plantilla.apirest.models.dao.ISubSeccionRepository;
import Plantilla.apirest.models.entity.Seccion;
import Plantilla.apirest.models.entity.SubSeccion;

@Service
public class SubSeccionServiceImpl extends CommonServiceImpl<SubSeccion, ISubSeccionRepository> implements ISubSeccionService{
    
    private final ISubSeccionRepository subSeccionRepository;

    public SubSeccionServiceImpl(ISubSeccionRepository subSeccionRepository) {
        super(subSeccionRepository);
        this.subSeccionRepository = subSeccionRepository;
    }

    @Override
    public boolean existeIdSeccionNumeroSubSeccion(Long seccionId, Long numeroSubSeccion) {
        return subSeccionRepository.existsBySeccionIdAndNumeroSubSeccion(seccionId, numeroSubSeccion);
    }
}
