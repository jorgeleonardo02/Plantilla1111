package Plantilla.apirest.seguridad.servicio;

//public class UserDetailsServicioImpl {

//}
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import Plantilla.apirest.seguridad.entidad.Usuario;
import Plantilla.apirest.seguridad.entidad.UsuarioPrincipal;

//@Service
//public class UserDetailsServicioImpl implements UserDetailsService {

//  @Autowired
//UsuarioServicio usuarioServicio;

//@Override
//public UserDetails loadUserByUsername(String nombreUsuario) throws UsernameNotFoundException {
//  Usuario usuario = usuarioServicio.getByNombreUsuario(nombreUsuario).get();// con get() se convierte en optional
//return UsuarioPrincipal.build(usuario);// Se construye el usuario
//}
//}

@Service
public class UserDetailsServicioImpl implements UserDetailsService {

    @Autowired
    UsuarioServicio usuarioServicio;

    @Override
    public UserDetails loadUserByUsername(String nombreUsuario) throws UsernameNotFoundException {
        Usuario usuario = usuarioServicio.getByNombreUsuario(nombreUsuario)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + nombreUsuario));

        return UsuarioPrincipal.build(usuario);
    }
}