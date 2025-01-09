package Plantilla.apirest.service;

import org.springframework.stereotype.Service;

import Plantilla.apirest.common.CommonServiceImpl;
import Plantilla.apirest.models.dao.ISeccionRepository;
import Plantilla.apirest.models.entity.Seccion;

@Service
public class SeccionServiceImpl extends CommonServiceImpl<Seccion, ISeccionRepository> implements ISeccionService {

    private final ISeccionRepository seccionRepository;

    public SeccionServiceImpl(ISeccionRepository seccionRepository) {
        super(seccionRepository);
        this.seccionRepository = seccionRepository;
    }

    @Override
    public boolean numeroSeccionExiste(Long numeroSeccion) {
        return seccionRepository.existsByNumeroSeccion(numeroSeccion);
    }
}
