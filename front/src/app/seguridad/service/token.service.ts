import { Injectable} from "@angular/core";
import { Router } from "@angular/router";
import { NuevoUsuario } from '../modeloAcceso/nuevo-usuario';
import { BehaviorSubject, Subject, Observable, of } from "rxjs";
import { map } from 'rxjs/operators';
import { UsuarioService } from '../../usuario/usuario.service';
import { UsuarioDto } from "src/app/usuario/usuario-dto";
import { UsuarioDto2 } from "src/app/usuario/usuario-dto2";
import { InactivoService } from "./inactivo.service";

// Comprorbar si estamos o no logeados y para obtener los privilegios
// Costantes se van a tener almacenados en el navegador
// Ruta consola/aplicaton/sesion storage
const TOKEN_KEY = "AuthToken"; // De clave
@Injectable({
  providedIn: 'root',
})
export class TokenService {
  roles: Array<string> = []; // vacio inicia; rol;
  //usuario: NuevoUsuario;
  /* private usuario = new BehaviorSubject<NuevoUsuario>({
    nombre: '',
    nombreUsuario: '',
    correo: '',
    password: '',
    roles: []
  }); */
  public nombreUsuario: /* = new BehaviorSubject< */ string /* >('') */;
  public correoUsuario: /*  = new BehaviorSubject< */ string /* >('') */;
  //private rolSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private usuario: UsuarioDto2 | null = null; // Almacena el usuario en caché
  private nombRol: Subject<string> = new Subject<string>();
  constructor(private router: Router, 
              private inactivoService: InactivoService,
              private usuarioService: UsuarioService) {
                this.initInactivityDetection();//iniciar la lógica de detección de inactividad al crear una instancia del objeto 
              }

  private initInactivityDetection(): void {
    this.inactivoService.getInactivityObservable().subscribe(() => {
      // Acciones a realizar cuando hay inactividad
      this.logOut();
      this.router.navigate(['/']);
    });
  }

  /* actualizarRol(nuevoRol: string): void {
    this.rolSubject.next(nuevoRol);
  }

  obtenerRol(): Observable<string> {
    return this.rolSubject.asObservable();
  }
 */
  public getRouter() {
    return this.router;
  }

  usuarioActual(): UsuarioDto2 | any {
    return this.usuarioService.buscarUsuarioPorNombre(this.getUserName());
  }

  /* usuarioActual2(): Observable<UsuarioDto2> {
    return this.usuarioService.buscarUsuarioPorNombre(this.getUserName());
  } */
  usuarioActual2(): Observable<UsuarioDto2 | null> {
    return this.usuarioService.buscarUsuarioPorNombre(this.getUserName());
  }

  // Se calcula el nombre del rol
  nombreRol() {
    if (this.rolAdmin()) {
      return 'ADMINISTRADOR';
    } else {
      if (this.rolDocente()) {
        return 'DOCENTE';
      } else {
        if (this.rolEstudiante()) {
          return 'ESTUDIANTE';
        } else {
          if (this.rolVisitante()) {
            return 'VISITANTE';
          } else {
            if (this.rolGerencia()) {
              return 'GERENCIA';
            } else {
              return 'Debes iniciar sesion';
            }
          }
        }
      }
    }
  }
  
  public obtenerRol(): string | null {
    const token = this.getToken();
    if (token) {
      const payload = token.split('.')[1];
      const payloadDecode = atob(payload);
      const values = JSON.parse(payloadDecode);
      return values.roles ? values.roles[0] : null;
    }
    return null;
  }

  // Método para actualizar el rol y emitir cambios
  /* actualizarRol(rol: string): void {
    this.nombRol.next(rol);
    //this.nombreRol = nuevoRol;
  }
  

  // Método para suscribirse a cambios en el rol
  obtenerRolObservable(): Observable<string> {
    return this.nombRol.asObservable();
  }
 */
  /* public setUsuario(usuario: NuevoUsuario){
    this.usuario.next(usuario);
  }
  public getUsuario(): Observable<NuevoUsuario>{
    return this.usuario.asObservable();
  } */

  // Nueva función para verificar la expiración del token
  /*  private tokenExpirado(): boolean {
    const token = this.getToken();
    if (token) {
      const fechaExpiracion = this.obtenerFechaExpiracion(token);
      return fechaExpiracion < new Date();
    }
    return true;
  } */

  /* private obtenerFechaExpiracion(token: string): Date {
    const payload = token.split('.')[1];
    const payloadDecode = atob(payload);
    const values = JSON.parse(payloadDecode);
    const exp = values.exp;
    return new Date(exp * 1000);
  }

  // Nueva función para verificar si el usuario está autenticado y el token no ha expirado
  public autenticado(): boolean {
    return this.logueado() && !this.tokenExpirado();
  } */

  // Nueva función para obtener el usuario actual solo si está autenticado
  /* public obtenerUsuarioActual(): Observable<UsuarioDto2> {
    return this.autenticado() ? this.usuarioActual2() : of(null); // Utilizar 'of' para devolver un observable con valor nulo
  } */

  /* public obtenerUsuarioActual(): Observable<UsuarioDto2> {
    return this.usuarioActual2().pipe(
      map(usuario => usuario || null) // Si el usuario es nulo, devolver un valor nulo
    );
  } */
  /* public obtenerUsuarioActual(): Observable<UsuarioDto2 | null> {
    return this.autenticado() ? this.usuarioActual2() : of(null);
  } */

  public setNombreUsuario(nombreUsuario: string) {
    /* this.nombreUsuario = nombreUsuario; */
    window.localStorage.removeItem('nombreUsuario'); // se removueve
    window.localStorage.setItem('nombreUsuario', nombreUsuario); // graba authtoken en localStorage
  }
  public getNombreUsuario(): string | any {
    //return this.nombreUsuario;
    return localStorage.getItem('nombreUsuario');
  }
  public setCorreoUsuario(correoUsuario: string) {
    //this.correoUsuario = correoUsuario;
    window.localStorage.removeItem('correo'); // se removueve
    window.localStorage.setItem('correo', correoUsuario); // graba authtoken en localStorage
  }
  public getCorreoUsuario(): string | any {
    //return this.correoUsuario;
    return localStorage.getItem('correo');
  }

  // Se carga el token
  public setToken(token: string): void {
    window.localStorage.removeItem(TOKEN_KEY); // se removueve
    window.localStorage.setItem(TOKEN_KEY, token); // graba authtoken en localStorage
  }

  // Muestra el token
  public getToken(): string | any {
    //console.log(localStorage.getItem(TOKEN_KEY));
    return localStorage.getItem(TOKEN_KEY);
  }
  // Método para obtener el usuario almacenado en caché
  public obtenerUsuarioCacheado(): Observable<UsuarioDto2 | null> {
    return of(this.usuario);
  }

  // Método para cargar el usuario almacenado en caché desde el almacenamiento local
  private loadCachedUser(): void {
    const cachedUser = localStorage.getItem('cachedUser');
    if (cachedUser) {
      this.usuario = JSON.parse(cachedUser);
    }
  }

  // Método para actualizar el usuario almacenado en caché
  private updateCachedUser(): void {
    localStorage.setItem('cachedUser', JSON.stringify(this.usuario));
  }

  // Método para actualizar el rol del usuario
  public actualizarRol(rol: string): void {
    if (this.usuario) {
      // Actualizar el rol del usuario almacenado en caché
      this.usuario.roles = [rol];
      
      this.updateCachedUser();
    }
  }

  // Método para obtener el observable que emite cambios en el rol
  public obtenerRolObservable(): Observable<string> {
    return this.nombRol.asObservable();
  }


  // Si hay sesion
  public logueado(): boolean {
    if (this.getToken()) {
      return true;
    }
    return false;
  }

  // Se manipula el usuario desde el token
  public getUserName(): string | any {
    if (!this.logueado()) {
      return null;
    }
    const token = this.getToken();
    if (token != null) {
      //console.log("token: "+token);
      const payload = token.split('.')[1]; // array posicion 1
      /* console.log("token.split(.)[0]: "+ atob(token.split(".")[0]));
      console.log("token.split(.)[2]: "+ token.split(".")[2]);
      console.log("payload: "+  atob(payload)); */
      const payloadDecode = atob(payload);
      //console.log("payloadDecode: "+ payloadDecode);
      const values = JSON.parse(payloadDecode); // convertir en json
      //console.log("values: "+ values);
      const username = values.sub;
      //console.log("nombre usuario: "+username);
      return username;
    }
    return null;
  }

  // Comporbar si es admin
  public rolAdmin(): boolean | any {
    if (!this.logueado()) {
      return false;
    }

    const token = this.getToken();
    if (token != null) {
      const payload = token.split('.')[1]; // array posicion 1
      const payloadDecode = atob(payload);
      // convertir en json
      const values = JSON.parse(payloadDecode);
      const roles = values.roles;
      //console.log("roles: "+ roles);
      // si el elemento no esta en el array
      if (roles.indexOf('ROLE_ADMIN') < 0) {
        return false;
      }
      return true;
    }
  }

  // Comporbar si es DOCENTE
  public rolDocente(): boolean | any {
    if (!this.logueado()) {
      return false;
    }
    const token = this.getToken();
    if (token != null) {
      const payload = token.split('.')[1]; // array posicion 1
      const payloadDecode = atob(payload);
      // convertir en json
      const values = JSON.parse(payloadDecode);
      const roles = values.roles;
      //console.log("roles: "+ roles);
      // si el elemento no esta en el array
      if (roles.indexOf('ROLE_DOCENTE') < 0) {
        return false;
      }
      return true;
    }
  }

  // Comporbar si es ESTUDIANTE
  public rolEstudiante(): boolean | any {
    if (!this.logueado()) {
      return false;
    }
    const token = this.getToken();
    if (token != null) {
      const payload = token.split('.')[1]; // array posicion 1
      const payloadDecode = atob(payload);
      // convertir en json
      const values = JSON.parse(payloadDecode);
      //console.log("values: "+ values);
      const roles = values.roles;
      // si el elemento no esta en el array
      if (roles.indexOf('ROLE_ESTUDIANTE') < 0) {
        return false;
      }
      return true;
    }
  }
  // Comporbar si es VISITANTE
  public rolVisitante(): boolean | any {
    if (!this.logueado()) {
      return false;
    }
    const token = this.getToken();
    if (token != null) {
      const payload = token.split('.')[1]; // array posicion 1
      const payloadDecode = atob(payload);
      // convertir en json
      const values = JSON.parse(payloadDecode);
      const roles = values.roles;
      //console.log("roles: "+ roles);
      // si el elemento no esta en el array
      if (roles.indexOf('ROLE_VISITANTE') < 0) {
        return false;
      }
      return true;
    }
  }

  // Comporbar si es GERENCIA
  public rolGerencia(): boolean | any {
    if (!this.logueado()) {
      return false;
    }
    const token = this.getToken();
    if (token != null) {
      const payload = token.split('.')[1]; // array posicion 1
      const payloadDecode = atob(payload);
      // convertir en json
      const values = JSON.parse(payloadDecode);
      const roles = values.roles;
      //console.log("roles: "+ roles);
      // si el elemento no esta en el array
      if (roles.indexOf('ROLE_GERENCIA') < 0) {
        return false;
      }
      return true;
    }
  }

  public logOut(): boolean {
    window.localStorage.removeItem('AuthToken'); // Destruye el token
    /* window.localStorage.clear(); */ // Limpia lo que tengamos en sesion storage
    this.router.navigate(['/inicio']);
    return true;
  }
}
