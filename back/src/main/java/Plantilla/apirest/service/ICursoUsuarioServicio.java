package Plantilla.apirest.service;

import Plantilla.apirest.common.ICommonService;
import Plantilla.apirest.models.entity.Curso;
import Plantilla.apirest.models.entity.CursoUsuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ICursoUsuarioServicio extends ICommonService<CursoUsuario> {
   
    Page<CursoUsuario> obtenerCursosPorUsuarioId(Long usuarioId, Pageable paginacion);
    Page<Curso> obtenerCursosPorUsuarioIdPaginado(Long usuarioId, Pageable pageable);
}
