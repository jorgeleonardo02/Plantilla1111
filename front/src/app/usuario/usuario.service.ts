import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CommonService } from '../common/common.service';
import { UsuarioDto } from './usuario-dto';
import alertasSweet from 'sweetalert2';
import { environment } from 'environments/environment';
import { UsuarioDto2 } from './usuario-dto2';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService extends CommonService<UsuarioDto> {
  
  //protected override rutaEndPoint = 'http://localhost:8082/api/usuario/odocentes';

  protected override rutaEndPoint = environment.endPointUsuario;
  private usuarioSubject: Subject<UsuarioDto2> = new Subject<UsuarioDto2>();

  constructor(enrutador: Router,
              http: HttpClient) { super(enrutador, http); // instancio la clase padre
  }

  listarUsuariosDocentes(): Observable<any> {
    return this.httpCliente
      .get(this.rutaEndPoint+'/docentes')
      .pipe(
        catchError((e: any) => {
          alertasSweet.fire('Error', e.error.mensaje + ' : ' + e.error.error);
          return throwError('error');
        })
      );
  }
  buscarUsuarioPorNombre(nombreUsuario: string): Observable<any> {
    return this.httpCliente
      .get(this.rutaEndPoint+'/nombre/'+nombreUsuario)
      .pipe(
        catchError((e: any) => {
          alertasSweet.fire('Error', e.error.mensaje + ' : ' + e.error.error);
          return throwError('error');
        })
      );
  }
  obtenerUsuarioObservable(): Observable<UsuarioDto2> {
    return this.usuarioSubject.asObservable();
  }
}
