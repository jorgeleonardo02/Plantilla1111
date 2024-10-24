/*
 * package Plantilla.apirest;
 *
 * import Plantilla.apirest.seguridad.entidad.Rol;
 * import Plantilla.apirest.seguridad.entidad.Usuario;
 * import Plantilla.apirest.seguridad.enums.RolNombre;
 *
 * public class UsuarioTest {
 * public static void main(String[] args) {
 * // Crear un objeto Usuario con roles
 * Usuario usuarioConRoles = new Usuario();
 * Rol rolDocente = new Rol(2, RolNombre.ROLE_DOCENTE);
 * usuarioConRoles.getRoles().add(rolDocente);
 *
 * // Verificar si tiene el rol de docente
 * boolean tieneRolDocente = usuarioConRoles.tieneRolDocente();
 * System.out.println("Usuario con roles tiene rol de docente: " +
 * tieneRolDocente);
 *
 * // Crear un objeto Usuario sin roles
 * Usuario usuarioSinRoles = new Usuario();
 * Rol rolDocente2 = new Rol(2, RolNombre.ROLE_DOCENTE);
 * usuarioSinRoles.getRoles().add(rolDocente2);
 *
 * // Verificar si tiene el rol de docente
 * boolean tieneRolDocente2 = usuarioSinRoles.tieneRolDocente();
 * System.out.println("Usuario sin roles tiene rol de docente2: " +
 * tieneRolDocente2);
 *
 * }
 * }
 */