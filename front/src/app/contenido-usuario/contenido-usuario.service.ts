import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CommonService } from '../common/common.service';
//import { UsuarioDto } from './contenido-usuario';
import alertasSweet from 'sweetalert2';
import { environment } from 'environments/environment';
import { ContenidoUsuario } from './contenido-usuario';
@Injectable({
  providedIn: 'root',
})
export class ContenidoUsuarioService extends CommonService<ContenidoUsuario> {
  
  //protected override rutaEndPoint = 'http://localhost:8082/api/contenidoUsuario';

  protected override rutaEndPoint = environment.endPointContenidoUsuario;

  constructor(enrutador: Router,
              http: HttpClient) { super(enrutador, http); // instancio la clase padre
  }
//http://localhost:8888/api/contenidoUsuario/rolDocente/1
  public cantidadContenidosDeDocente(usuarioId: number): Observable<any> {
    return this.httpCliente
      .get(this.rutaEndPoint+'/cantidadContenidos/'+usuarioId)
      .pipe(
        catchError((e: any) => {
          alertasSweet.fire('Error', e.error.error);
          return throwError('error');
        })
      );
  }
  public getContenidoUsuarioByRolDocente(contenidoId: number): Observable<any>{
    return this.httpCliente
      .get(this.rutaEndPoint+'/rolDocente/'+contenidoId)
      .pipe(
        catchError((e: any) => {
          alertasSweet.fire('Error', e.error.error);
          return throwError('error');
        })
      );
  }

}
