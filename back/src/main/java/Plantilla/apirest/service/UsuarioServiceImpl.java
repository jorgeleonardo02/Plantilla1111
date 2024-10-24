package Plantilla.apirest.service;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import Plantilla.apirest.common.CommonServiceImpl;
import Plantilla.apirest.models.dao.IUsuarioDao;
import Plantilla.apirest.seguridad.entidad.Usuario;

@Service
public class UsuarioServiceImpl extends CommonServiceImpl<Usuario, IUsuarioDao> implements IUsuarioService {

  @Autowired
  private IUsuarioDao iUsuarioDao;

  public UsuarioServiceImpl(IUsuarioDao iUsuarioDao) {
    super(iUsuarioDao); // Llama al constructor de la superclase
    this.iUsuarioDao = iUsuarioDao;
  }

  @Override
  public List<Long> listaIdsUsuariosDocentes() {
    return iUsuarioDao.listaIdUsuariosDocentes();
  }

  @Override
  public List<Usuario> listaUsuariosDocentes() {
    return iUsuarioDao.listaUsuariosDocentes();
  }

  @Override
  public Optional<Usuario> buscarPorUsuarioNombre(String nombreUsuario) {
    return iUsuarioDao.findByUsuario(nombreUsuario);
  }
}
