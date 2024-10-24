package Plantilla.apirest.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import Plantilla.apirest.common.CommonServiceImpl;
import Plantilla.apirest.models.dao.IContenidoUsuarioDao;
import Plantilla.apirest.models.entity.Contenido;
import Plantilla.apirest.models.entity.ContenidoUsuario;

@Service
public class ContenidoUsuarioServicioImpl extends CommonServiceImpl<ContenidoUsuario, IContenidoUsuarioDao>
        implements IContenidoUsuarioServicio {

    private final IContenidoUsuarioDao contenidoUsuarioDao;

    @Autowired
    public ContenidoUsuarioServicioImpl(IContenidoUsuarioDao contenidoUsuarioDao) {
        super(contenidoUsuarioDao); // Llama al constructor de la superclase
        this.contenidoUsuarioDao = contenidoUsuarioDao;
    }

    public Page<ContenidoUsuario> obtenerContenidosPorUsuarioId(Long usuarioId, Pageable pageable) {
        return contenidoUsuarioDao.findContenidosByUsuarioId(usuarioId, pageable);
    }

    public Page<Contenido> obtenerContenidosPorUsuarioIdPaginado(Long usuarioId, Pageable pageable) {
        return contenidoUsuarioDao.encontrarContenidosByUsuarioId(usuarioId, pageable);
    }

}
