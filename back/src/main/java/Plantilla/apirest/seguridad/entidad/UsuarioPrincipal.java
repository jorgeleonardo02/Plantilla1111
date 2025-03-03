package Plantilla.apirest.seguridad.entidad;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import lombok.Data;

@Data
public class UsuarioPrincipal implements UserDetails { // interface userdetails

    private String nombre;
    private String nombreUsuario;
    private String correo;
    private String password;
    private Long limiteCursos;
    private Collection<? extends GrantedAuthority> autoridades;// autenticacion, autorizacion

    // Constructor de todos los campos
    public UsuarioPrincipal(String nombre, String nombreUsuario, String correo, String password, Long limiteCursos,
            Collection<? extends GrantedAuthority> autoridades) {
        this.nombre = nombre;
        this.nombreUsuario = nombreUsuario;
        this.correo = correo;
        this.password = password;
        this.autoridades = autoridades;
        this.limiteCursos = limiteCursos;
    }

    // Metodo estatico mas importante, asigna los provilegios a cada usuario,
    // autorizacion si es admin o usuario
    public static UsuarioPrincipal build(Usuario usuario) {

        // Se convierten los roles en autoridades apartir de nombre del rol
        // obtenemos una lista de grantedAuthority apartir de los roles
        // Estamos convirtiendo la clase rol en clase grantedAuthority
        // Se devuelve un usuarioPrincipal
        List<GrantedAuthority> autoridades = usuario.getRoles().stream()
                .map(rol -> new SimpleGrantedAuthority(rol.getRolNombre().name())).collect(Collectors.toList());

        return new UsuarioPrincipal(usuario.getNombre(), usuario.getNombreUsuario(), usuario.getCorreo(),
                usuario.getPassword(), usuario.getLimiteCursos(), autoridades);
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return autoridades;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return nombreUsuario;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    public String getNombre() {
        return nombre;
    }

    public String getCorreo() {
        return correo;
    }

    public Long getLimiteCursos() {
        return limiteCursos;
    }

    /**
     *
     */
    private static final long serialVersionUID = 1L;

    public static long getSerialversionuid() {
        return serialVersionUID;
    }

    public String getNombreUsuario() {
        return nombreUsuario;
    }

    public void setNombreUsuario(String nombreUsuario) {
        this.nombreUsuario = nombreUsuario;
    }

    public Collection<? extends GrantedAuthority> getAutoridades() {
        return autoridades;
    }

    public void setAutoridades(Collection<? extends GrantedAuthority> autoridades) {
        this.autoridades = autoridades;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setLimiteCursos(Long limiteCursos) {
        this.limiteCursos = limiteCursos;
    }

}
