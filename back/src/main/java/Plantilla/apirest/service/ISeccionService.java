package Plantilla.apirest.service;

import Plantilla.apirest.common.ICommonService;
import Plantilla.apirest.models.entity.Seccion;

public interface ISeccionService extends ICommonService<Seccion> {
    boolean numeroSeccionExiste(Long numeroSeccion);
}