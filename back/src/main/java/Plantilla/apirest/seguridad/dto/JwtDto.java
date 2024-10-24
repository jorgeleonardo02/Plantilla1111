package Plantilla.apirest.seguridad.dto;

//import org.springframework.security.core.userdetails.UserDetails;

//import Plantilla.apirest.seguridad.entidad.UsuarioPrincipal;

// se va a utilizar cuando se haga un login esta clase devuelve Jwt del controlador
public class JwtDto {
    private String token;
    private String nombre;
    private String correo;

    public JwtDto() {
    }

    public JwtDto(String token/* , UserDetails usuario */) {
        this.token = token;
        /* this.usuario = usuario; */
    }

    // Getters y Setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    /*
     * public UserDetails getUsuario() {
     * return this.usuario;
     * }
     *
     * public void setUsuario(UserDetails usuario) {
     * this.usuario = usuario;
     * }
     */

    /*
     * public String getCorreo() {
     * if (usuario instanceof UsuarioPrincipal) {
     * return ((UsuarioPrincipal) usuario).getCorreo();
     * }
     * return null;
     * }
     *
     * public String getNombre() {
     * if (usuario instanceof UsuarioPrincipal) {
     * return ((UsuarioPrincipal) usuario).getNombre();
     * }
     * return null;
     * }
     */
    public JwtDto(String token, String nombre, String correo) {
        this.token = token;
        this.nombre = nombre;
        this.correo = correo;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

}
