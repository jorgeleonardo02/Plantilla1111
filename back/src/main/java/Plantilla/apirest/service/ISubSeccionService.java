package Plantilla.apirest.service;

import Plantilla.apirest.common.ICommonService;
import Plantilla.apirest.models.entity.SubSeccion;

public interface ISubSeccionService extends ICommonService<SubSeccion> {
    boolean existeIdSeccionNumeroSubSeccion(Long seccionId, Long numeroSubSeccion);
}