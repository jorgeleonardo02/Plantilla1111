package Plantilla.apirest.service;

import Plantilla.apirest.common.ICommonService;
import Plantilla.apirest.models.entity.Contenido;
//import Plantilla.apirest.models.dto.ContenidoUsuarioDto;
import Plantilla.apirest.models.entity.ContenidoUsuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IContenidoUsuarioServicio extends ICommonService<ContenidoUsuario> {
    // boolean esDocentePropietario(Long contenidoId, Long usuarioId);
    // Page<Contenido> obtenerContenidosPorUsuarioId(Long usuarioId, Pageable
    // paginacion);
    Page<ContenidoUsuario> obtenerContenidosPorUsuarioId(Long usuarioId, Pageable paginacion);

    Page<Contenido> obtenerContenidosPorUsuarioIdPaginado(Long usuarioId, Pageable pageable);
}
