package Plantilla.apirest.seguridad.entidad;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;

import Plantilla.apirest.seguridad.enums.RolNombre;
import lombok.Data;

@Entity
@Data
public class Rol {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotNull
    @Enumerated(EnumType.STRING)
    private RolNombre rolNombre;

    // Constructor vacio
    /*public Rol() {
    }*/

    // Constructor con rolNombre
    /*public Rol(int id, @NotNull RolNombre rolNombre) {
        this.rolNombre = rolNombre;
        this.id = id;
    }*/

    // Getters y Setters

      public Long getId() {
      return id;
      }

      public void setId(Long id) {
      this.id = id;
      }

      public RolNombre getRolNombre() {
      return rolNombre;
      }

      public void setRolNombre(RolNombre rolNombre) {
      this.rolNombre = rolNombre;
      }

}
