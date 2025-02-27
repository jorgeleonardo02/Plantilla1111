package Plantilla.apirest.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import Plantilla.apirest.common.CommonServiceImpl;
import Plantilla.apirest.models.dao.ICursoUsuarioDao;
import Plantilla.apirest.models.entity.Curso;
import Plantilla.apirest.models.entity.CursoUsuario;

@Service
public class CursoUsuarioServicioImpl extends CommonServiceImpl<CursoUsuario, ICursoUsuarioDao>
        implements ICursoUsuarioServicio {

    private final ICursoUsuarioDao cursoUsuarioDao;

    @Autowired
    public CursoUsuarioServicioImpl(ICursoUsuarioDao cursoUsuarioDao) {
        super(cursoUsuarioDao); // Llama al constructor de la superclase
        this.cursoUsuarioDao = cursoUsuarioDao;
    }

    public Page<CursoUsuario> obtenerCursosPorUsuarioId(Long usuarioId, Pageable pageable) {
        return cursoUsuarioDao.findCursosByUsuarioId(usuarioId, pageable);
    }

    public Page<Curso> obtenerCursosPorUsuarioIdPaginado(Long usuarioId, Pageable pageable) {
        return cursoUsuarioDao.encontrarCursosByUsuarioId(usuarioId, pageable);
    }

}
