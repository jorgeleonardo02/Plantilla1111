import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CommonService } from '../common/common.service';
import alertasSweet from 'sweetalert2';
import { environment } from 'environments/environment';
import { CursoUsuario } from './curso-usuario';
@Injectable({
  providedIn: 'root',
})
export class CursoUsuarioService extends CommonService<CursoUsuario> {
  
  //protected override rutaEndPoint = 'http://localhost:8082/api/contenidoUsuario';

  protected override rutaEndPoint = environment.endPointCursoUsuario;

  constructor(enrutador: Router,
              http: HttpClient) { super(enrutador, http); // instancio la clase padre
  }
//http://localhost:8888/api/contenidoUsuario/rolDocente/1
  public cantidadCursosDeDocente(usuarioId: number): Observable<any> {
    return this.httpCliente
      .get(this.rutaEndPoint+'/cantidadCursos/'+usuarioId)
      .pipe(
        catchError((e: any) => {
          alertasSweet.fire('Error', e.error.error);
          return throwError('error');
        })
      );
  }
  public getCursoUsuarioByRolDocente(cursoId: number): Observable<any>{
    return this.httpCliente
      .get(this.rutaEndPoint+'/rolDocente/'+cursoId)
      .pipe(
        catchError((e: any) => {
          alertasSweet.fire('Error', e.error.error);
          return throwError('error');
        })
      );
  }

  cursosPorIdUsuario(idUsuario: number){
    return this.httpCliente
      .get(this.rutaEndPoint+'/usuario/'+idUsuario)
      .pipe(
        catchError((e: any) => {
          alertasSweet.fire('Error', e.error.error);
          return throwError('error');
        })
      );
  }

}
