package Plantilla.apirest.seguridad.entidad;

/*import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.validation.constraints.NotNull;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import Plantilla.apirest.models.entity.ContenidoUsuario;
import lombok.Data;

@Entity
@Data
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotNull
    private String nombre;
    @NotNull
    @Column(unique = true)
    private String nombreUsuario;
    @NotNull
    @Column(unique = true)
    private String correo;
    @NotNull
    private String password;
    private Long limiteContenidos;

    @NotNull
    @ManyToMany(fetch = FetchType.EAGER) // un usuario muschos roles, 1 rol muchos usuarios
    // Se crea tabla y relaciones de id
    @JoinTable(name = "usuario_rol", joinColumns = @JoinColumn(name = "usuario_id"), inverseJoinColumns = @JoinColumn(name = "rol_id"))
    private Set<Rol> roles = new HashSet<Rol>();

    @OneToMany(mappedBy = "usuario", fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "usuario", "listaContenidoUsuario", "handler", "hibernateLazyInitializer" })
    private List<ContenidoUsuario> listaContenidoUsuario;*/

// Se genera un constructor vacio
/*public Usuario() {
}*/

// Se genera un constructor sin id y rol
/*public Usuario(@NotNull String nombre, @NotNull String nombreUsuario, @NotNull String correo,
        @NotNull Long limiteContenidos, @NotNull String password) {

    this.nombre = nombre;
    this.nombreUsuario = nombreUsuario;
    this.correo = correo;
    this.password = password;
    this.limiteContenidos = limiteContenidos;
}*/

/* public Set<Rol> getRoles() {
     return roles;
 }

 public boolean tieneRolDocente() {
     return roles.stream()
             .anyMatch(rol -> rol.getRolNombre().toString().equalsIgnoreCase("ROLE_DOCENTE"));
 }

 public boolean tieneRolVisitante() {
     return roles.stream()
             .anyMatch(rol -> rol.getRolNombre().toString().equalsIgnoreCase("ROLE_VISITANTE"));
 }

 public boolean tieneRolGerencia() {
     return roles.stream()
             .anyMatch(rol -> rol.getRolNombre().toString().equalsIgnoreCase("ROLE_GERENCIA"));
 }
}*/

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import Plantilla.apirest.models.entity.CursoUsuario;
import lombok.Data;

@Entity
@Data
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private String nombre;

    @NotNull
    @Column(unique = true)
    private String nombreUsuario;

    @NotNull
    @Column(unique = true)
    private String correo;

    @NotNull
    private String password;

    private Long limiteCursos;

    @NotNull
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "usuario_rol", joinColumns = @JoinColumn(name = "usuario_id"), inverseJoinColumns = @JoinColumn(name = "rol_id"))
    private Set<Rol> roles = new HashSet<>();

    @JsonIgnore
    @OneToMany(mappedBy = "usuario", fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "usuario", "listaCursoUsuario", "handler", "hibernateLazyInitializer" })
    private List<CursoUsuario> listaCursoUsuario;

    // Constructor completo
    public Usuario() {
    }

    public Usuario(@NotNull String nombre, @NotNull String nombreUsuario, @NotNull String correo,
            Long limiteCursos, @NotNull String password) {
        this.nombre = nombre;
        this.nombreUsuario = nombreUsuario;
        this.correo = correo;
        this.password = password;
        this.limiteCursos = limiteCursos;

    }

    public Set<Rol> getRoles() {
        return roles;
    }

    public boolean tieneRolDocente() {
        return roles.stream()
                .anyMatch(rol -> rol.getRolNombre().toString().equalsIgnoreCase("ROLE_DOCENTE"));
    }

    public boolean tieneRolEstudiante() {
        return roles.stream()
                .anyMatch(rol -> rol.getRolNombre().toString().equalsIgnoreCase("ROLE_ESTUDIANTE"));
    }

    public boolean tieneRolVisitante() {
        return roles.stream()
                .anyMatch(rol -> rol.getRolNombre().toString().equalsIgnoreCase("ROLE_VISITANTE"));
    }

    public boolean tieneRolGerencia() {
        return roles.stream()
                .anyMatch(rol -> rol.getRolNombre().toString().equalsIgnoreCase("ROLE_GERENCIA"));
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getNombreUsuario() {
        return nombreUsuario;
    }

    public void setNombreUsuario(String nombreUsuario) {
        this.nombreUsuario = nombreUsuario;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Long getLimiteCursos() {
        return limiteCursos;
    }

    public void setLimiteCursos(Long limiteCursos) {
        this.limiteCursos = limiteCursos;
    }

    public List<CursoUsuario> getListaCursoUsuario() {
        return listaCursoUsuario;
    }

    public void setListaCursoUsuario(List<CursoUsuario> listaCursoUsuario) {
        this.listaCursoUsuario = listaCursoUsuario;
    }

    public void setRoles(Set<Rol> roles) {
        this.roles = roles;
    }

}
