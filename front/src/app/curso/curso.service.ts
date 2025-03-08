import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CommonService } from '../common/common.service';
import { Curso } from './curso';
import alertasSweet from 'sweetalert2';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CursoService extends CommonService<Curso> {
  //protected override rutaEndPoint = 'http://localhost:8080/api/contenidos';

  protected override rutaEndPoint = environment.endPointCursos;
  // esta variable se ubica acá para facilitar el trabajo entre los componentes producto y formularioProducto
  private foto: File | any;
  listaCursos: Curso[];
  private eliminarFoto = false;
  private idCategoria = new BehaviorSubject<number>(0);
  private nombreCategoria = new BehaviorSubject<string>("");

  constructor(enrutador: Router,
              http: HttpClient) { super(enrutador, http); // instancio la clase padre
}

  recogerListaDeCursos(listaCursos: Curso[]) {
    this.listaCursos = listaCursos;
  }

  entregarListaCursos(): Curso[] {
    return this.listaCursos;
  }

  cursoExiste(id: number): Observable<boolean> {
    return this.httpCliente.get<boolean>(`${this.rutaEndPoint}/curso-existe?id=${id}`);
  }

  public setIdCategoria(id: number) {
    //console.log("servicioId: "+id);
    this.idCategoria.next(id);  
  }

  public getIdCategoria(): Observable<number> {
    return this.idCategoria.asObservable();
  }

  public setNombreCategoria(nombreCategoria: string) {
    console.log("nombreCategoria en contenidoService");
    console.log(nombreCategoria);
    this.nombreCategoria.next(nombreCategoria);
  }

  public getNombreCategoria(){
    console.log("getNombreCategoria en contenidoService ");
    console.log(this.nombreCategoria);
    return this.nombreCategoria.asObservable();
  }

  obtenerFotoCursoPorID(idCurso: number): Observable<any> {
    return this.httpCliente
      .get(this.rutaEndPoint + '/' + 'cursoFoto' + '/' + idCurso, {
        observe: 'response',
        responseType: 'blob',
      })
      .pipe(
        catchError((e) => {
          console.log(e.error.mensaje);
          alertasSweet.fire('Error', e.error.mensaje + ' : ' + e.error.error);
          return throwError(() => e);
        })
      );
  }

  listarCursosPorIdCategoria(idCategoria: number): Observable<any> {
    return this.httpCliente
      .get(this.rutaEndPoint + '/categoria/' + idCategoria)
      .pipe(
        catchError((e: any) => {
          alertasSweet.fire('Error', e.error.mensaje + ' : ' + e.error.error);
          return throwError(() => e);
        })
      );
  }

  agregarCursoConfoto(curso: Curso, archivo: File): Observable<any> {
    const datosFormulario = new FormData();

    datosFormulario.append('archivo', archivo);
    datosFormulario.append('nombre', curso.nombre);
    datosFormulario.append('descripcion', curso.descripcion);
    datosFormulario.append('etiquetas', curso.etiquetas);
    datosFormulario.append('listaHabilidades', JSON.stringify(curso.listaHabilidades));
    datosFormulario.append('activado', curso.activado.toString());
    //JSON.stringify: se convierte el objeto en una cadena JSON para poder enviarlo en el cuerpo de la solicitud HTTP
    datosFormulario.append("idCategoria", curso.categoria.id.toString());
    datosFormulario.append("precio", curso.precio.toString());

    console.log('datosFormulario');
    console.log( datosFormulario);
    // al pasar un FormData en el Body no se necesita cabecera porque
    // al ser ese tipo de variable, se sobreentiende que la cabecera será un MultiPart
    return this.httpCliente
      .post(this.rutaEndPoint + '/' + 'cursoFoto', datosFormulario)
      .pipe(
        catchError((e) => {
          console.log(e.error.mensaje);
          alertasSweet.fire('Error', e.error.mensaje + ' : ' + e.error.error);
          return throwError(() => e);
        })
      );
  }

  modificarCursoConfoto(curso: Curso, archivo: File): Observable<any> {
    const datosFormulario = new FormData();
    datosFormulario.append('archivo', archivo);
    datosFormulario.append('nombre', curso.nombre);
    datosFormulario.append('descripcion', curso.descripcion);
    datosFormulario.append('etiquetas', curso.etiquetas);
    datosFormulario.append('listaHabilidades', JSON.stringify(curso.listaHabilidades));
    datosFormulario.append('nombreFoto', curso.nombreFoto);

    // al pasar un FormData en el Body no se necesita cabecera porque
    // al ser ese tipo de variable, se sobreentiende que la cabecera será un MultiPart
    return this.httpCliente
      .put(
        this.rutaEndPoint + '/cursoFoto' + '/' + curso.id,
        datosFormulario
      )
      .pipe(
        catchError((e) => {
          console.log(e.error.mensaje);
          alertasSweet.fire('Error', e.error.mensaje + ' : ' + e.error.error);
          return throwError(() => e);
        })
      );
  }

  modificarCursoFotoNull(curso: Curso): Observable<any> {
    return this.httpCliente
      .put(
        this.rutaEndPoint + '/cursoFotoNull/' + curso.id,
        curso,
        { headers: this.cabeceraHttp }
      )
      .pipe(
        catchError((e) => {
          console.log(e.error.mensaje);
          alertasSweet.fire('Error', e.error.mensaje + ' : ' + e.error.error);
          return throwError(() => e);
        })
      );
  }

  // estos métodos se utilizan para intercambiar la variable foto entre componentes diferentes
  get obtenerFoto(): File {
    return this.foto;
  }

  setFoto(foto: File | any) {
    this.foto = foto;
  }

  setEstadoEliminarFoto(estadoNuevo: boolean): void {
    this.eliminarFoto = estadoNuevo;
  }

  get getEstadoEliminarFoto(): boolean {
    return this.eliminarFoto;
  }

  eliminaCurso(idElemento: number): Observable<any> {
    return this.httpCliente
      .delete(this.rutaEndPoint + '/curso/' + idElemento, {
        headers: this.cabeceraHttp,
      })
      .pipe(
        catchError((e) => {
          alertasSweet.fire('Error', e.error.mensaje + ' : ' + e.Error.error);
          return throwError(() => e);
        })
      );
  }

  elementosCategoriaIdPaginado(idCategoria: number, pagina: number, tamanoPagina: number): Observable<any> {
    const parametros = new HttpParams()
    .set('page', pagina)
    .set('size', tamanoPagina);
    return this.httpCliente.get(`${this.rutaEndPoint}/categoria/${idCategoria}/nombre?page=${pagina}&size=${tamanoPagina}`, { params: parametros});
  }

  cursoCompleto(nombreCategoria: string, nombreUsuario: string, mostrarTodos: boolean, activado: boolean, pagina?: number, tamanoPagina?: number): Observable<any> {
    let url = `${this.rutaEndPoint}/?nombreCategoria=${nombreCategoria.replace(/-/g, " ")}&nombreUsuario=${nombreUsuario}&mostrarTodos=${mostrarTodos}&activado=${activado}`;
    if (pagina !== undefined && tamanoPagina !== undefined) {
      url += `&page=${pagina}&size=${tamanoPagina}`;
    }
    console.log("url");
    console.log(url);
    console.log("this.httpCliente.get(url)");
    console.log(this.httpCliente.get(url));
    return this.httpCliente.get(url);
  }

  existsCurso(nombreCategoria: string, usuarioId: number, cursoId: number): Observable<boolean> {
    let params = new HttpParams()
      .set('nombreCategoria', nombreCategoria)
      .set('usuarioId', usuarioId.toString());
    return this.httpCliente.get<boolean>(`${this.rutaEndPoint}/${cursoId}/existe`, { params });
  }

  cursosPorNombreDeCategoriaPaginado(nombreCategoria: string, pagina: number, tamanoPagina: number): Observable<any> {
    return this.httpCliente.get(this.rutaEndPoint+"/categoria/nombre/activado/"+nombreCategoria.replace(/-/g, " ")+"/nombre?page="+pagina+"&size="+tamanoPagina/* , { params: parametros} */ );
  }

  cursosPorNombreDeCategoriaActivadoPaginado(nombreCategoria: string, pagina: number, tamanoPagina: number/* , activado: boolean */): Observable<any> {
    return this.httpCliente.get(this.rutaEndPoint+"/categoria/nombre/activado/"+nombreCategoria.replace(/-/g, " ")+"/nombre?page="+pagina+"&size="+tamanoPagina/* "/titulo", { params: parametros} */);
  }

  cursosPorIdUsuario(idUsuario: number){
    return this.httpCliente.get(this.rutaEndPoint+"/usuario/"+idUsuario);
  }

}