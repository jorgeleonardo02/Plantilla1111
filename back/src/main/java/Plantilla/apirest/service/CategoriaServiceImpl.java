package Plantilla.apirest.service;

//import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import Plantilla.apirest.common.CommonServiceImpl;
import Plantilla.apirest.models.dao.ICategoriasDao;
import Plantilla.apirest.models.entity.Categoria;

//@Service
/*@org.springframework.stereotype.Repository
public class CategoriaServiceImpl extends CommonServiceImpl<Categoria, ICategoriasDao> implements ICategoriaService {
    private final ICategoriasDao iCategoriasDao;

    @Autowired
    public CategoriaServiceImpl(@Qualifier("iCategoriasDao") ICategoriasDao iCategoriasDao,
            Repository repository) {
        super(repository); // Llama al constructor de la superclase
        this.iCategoriasDao = iCategoriasDao;
    }
}*/

@Service
public class CategoriaServiceImpl extends CommonServiceImpl<Categoria, ICategoriasDao> implements ICategoriaService {
    public CategoriaServiceImpl(// @Qualifier("iCategoriasDao")
            ICategoriasDao iCategoriasDao) {
        super(iCategoriasDao); // Llamar al constructor de la superclase
    }
}