import { Injectable } from '@angular/core';
import { NuevoUsuario } from '../modeloAcceso/nuevo-usuario';
import { Observable, tap } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { JwtDto } from '../modeloAcceso/jwt-dto';
import { LoginUsuario } from '../modeloAcceso/login-usuario';
import { environment } from 'environments/environment';
import { TokenService } from './token.service';
//import { environment } from '../../environments/environment.prod';
import { CarritoService } from '../../carrito/carrito.service';

const TOKEN_KEY = "AuthToken"; // De clave
@Injectable({
  providedIn: 'root'
})
export class AuthService {
   //authURL = 'http://localhost:8080/auth/'; 
   protected authURL = environment.endPointAuth;
  
  constructor(private httpClient: HttpClient,
              private tokenService: TokenService,
              private carritoService: CarritoService
  ){}

  public nuevo(nuevoUsuario: NuevoUsuario): Observable<any> {
    return this.httpClient.post<any>(this.authURL + 'nuevo', nuevoUsuario);
  }
  /* public login(loginUsuario: LoginUsuario): Observable<JwtDto> {
    return this.httpClient.post<JwtDto>(this.authURL + 'login', loginUsuario);
  } */
  
    public login(loginUsuario: LoginUsuario): Observable<JwtDto> {
      return this.httpClient.post<JwtDto>(this.authURL + 'login', loginUsuario).pipe(
        tap((jwtDto: JwtDto) => {
          this.setToken(jwtDto.token);
          //this.verificarYEliminarContenidosDelCarrito();
        })
      );
    }

  public refresh(dto: JwtDto): Observable<JwtDto> {
    return this.httpClient.post<JwtDto>(this.authURL + 'refresh', dto);
  }
  
  AddItem(): Observable<any>{
  return this.httpClient.get<any>(this.authURL + 'items/AddItem');
 }

 /* public cambiarRolUsuario(nombreUsuario: string, nuevoRol: string): Observable<any> {
  const params = new HttpParams()
    .set('nombreUsuario', nombreUsuario)
    .set('nuevoRol', nuevoRol);
  return this.httpClient.post(this.authURL +'cambiar-rol', null, { params });
} */
public cambiarRolUsuario(nombreUsuario: string, nuevoRol: string): Observable<any> {
  const params = new HttpParams()
    .set('nombreUsuario', nombreUsuario)
    .set('nuevoRol', nuevoRol);

  return this.httpClient.post<any>(this.authURL + 'cambiar-rol', null, { params }).pipe(
    tap((jwtDto: any) => {
      // Actualizar el token en el servicio después de cambiar el rol
      this.setToken(jwtDto.token);
    })
  );
  
}
public setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}
/* private verificarYEliminarContenidosDelCarrito(): void {
  const rol = this.tokenService.obtenerRol();
  if (rol === 'ROLE_ESTUDIANTE') {
    this.carritoService.eliminarContenidosBasadosEnRol(rol);
  }
} */


}