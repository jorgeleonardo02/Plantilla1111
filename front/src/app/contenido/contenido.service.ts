import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CommonService } from '../common/common.service';
import { Contenido } from './contenido';
import alertasSweet from 'sweetalert2';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ContenidoService extends CommonService<Contenido> {
  //protected override rutaEndPoint = 'http://localhost:8080/api/contenidos';

  protected override rutaEndPoint = environment.endPointContenido;
  // esta variable se ubica acá para facilitar el trabajo entre los componentes producto y formularioProducto
  private foto: File | any;
  listaContenidos: Contenido[];
  private eliminarFoto = false;
  private idCategoria = new BehaviorSubject<number>(0);
  private nombreCategoria = new BehaviorSubject<string>("");

  constructor(enrutador: Router,
              http: HttpClient) { super(enrutador, http); // instancio la clase padre
}

  recogerListaDeContenidos(listaContenidos: Contenido[]) {
    this.listaContenidos = listaContenidos;
  }

  entregarListaContenidos(): Contenido[] {
    return this.listaContenidos;
  }

  contenidoExiste(id: number): Observable<boolean> {
    return this.httpCliente.get<boolean>(`${this.rutaEndPoint}/contenido-existe?id=${id}`);
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

  obtenerFotoContenidoPorID(idContenido: number): Observable<any> {
    return this.httpCliente
      .get(this.rutaEndPoint + '/' + 'contenidoFoto' + '/' + idContenido, {
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

  listarContenidosPorIdCategoria(idCategoria: number): Observable<any> {
    return this.httpCliente
      .get(this.rutaEndPoint + '/categoria/' + idCategoria)
      .pipe(
        catchError((e: any) => {
          alertasSweet.fire('Error', e.error.mensaje + ' : ' + e.error.error);
          return throwError(() => e);
        })
      );
  }

  agregarContenidoConfoto(contenido: Contenido, archivo: File): Observable<any> {
    const datosFormulario = new FormData();

    datosFormulario.append('archivo', archivo);
    datosFormulario.append('titulo', contenido.titulo);
    datosFormulario.append('descripcion', contenido.descripcion);
    datosFormulario.append('etiquetas', contenido.etiquetas);
    datosFormulario.append('programa', contenido.programa);
    datosFormulario.append('activado', contenido.activado.toString());
    //JSON.stringify: se convierte el objeto en una cadena JSON para poder enviarlo en el cuerpo de la solicitud HTTP

    datosFormulario.append("idCategoria", contenido.categoria.id.toString());
    datosFormulario.append("precio", contenido.precio.toString());

    console.log('datosFormulario');
    console.log( datosFormulario);
    // al pasar un FormData en el Body no se necesita cabecera porque
    // al ser ese tipo de variable, se sobreentiende que la cabecera será un MultiPart
    return this.httpCliente
      .post(this.rutaEndPoint + '/' + 'contenidoFoto', datosFormulario)
      .pipe(
        catchError((e) => {
          console.log(e.error.mensaje);
          alertasSweet.fire('Error', e.error.mensaje + ' : ' + e.error.error);
          return throwError(() => e);
        })
      );
  }

  modificarContenidoConfoto(contenido: Contenido, archivo: File): Observable<any> {
    const datosFormulario = new FormData();
    datosFormulario.append('archivo', archivo);
    datosFormulario.append('titulo', contenido.titulo);
    datosFormulario.append('descripcion', contenido.descripcion);
    datosFormulario.append('etiquetas', contenido.etiquetas);
    datosFormulario.append('programa', contenido.programa);
    datosFormulario.append('nombreFoto', contenido.nombreFoto);

    // al pasar un FormData en el Body no se necesita cabecera porque
    // al ser ese tipo de variable, se sobreentiende que la cabecera será un MultiPart
    return this.httpCliente
      .put(
        this.rutaEndPoint + '/contenidoFoto' + '/' + contenido.id,
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

  modificarContenidoFotoNull(contenido: Contenido): Observable<any> {
    return this.httpCliente
      .put(
        this.rutaEndPoint + '/contenidoFotoNull/' + contenido.id,
        contenido,
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

  eliminaContenido(idElemento: number): Observable<any> {
    return this.httpCliente
      .delete(this.rutaEndPoint + '/contenido/' + idElemento, {
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
    return this.httpCliente.get(`${this.rutaEndPoint}/categoria/${idCategoria}/titulo?page=${pagina}&size=${tamanoPagina}`, { params: parametros});
  }
  contenidosCompleto(nombreCategoria: string, nombreUsuario: string, mostrarTodos: boolean, activado: boolean, pagina?: number, tamanoPagina?: number): Observable<any> {
    let url = `${this.rutaEndPoint}/?nombreCategoria=${nombreCategoria.replace(/-/g, " ")}&nombreUsuario=${nombreUsuario}&mostrarTodos=${mostrarTodos}&activado=${activado}`;
    if (pagina !== undefined && tamanoPagina !== undefined) {
      url += `&page=${pagina}&size=${tamanoPagina}`;
    }
    return this.httpCliente.get(url);
  }

  existsContenido(nombreCategoria: string, usuarioId: number, contenidoId: number): Observable<boolean> {
    let params = new HttpParams()
      .set('nombreCategoria', nombreCategoria)
      .set('usuarioId', usuarioId.toString());
    return this.httpCliente.get<boolean>(`${this.rutaEndPoint}/${contenidoId}/existe`, { params });
  }

  contenidosPorNombreDeCategoriaPaginado(nombreCategoria: string, pagina: number, tamanoPagina: number): Observable<any> {
    return this.httpCliente.get(this.rutaEndPoint+"/categoria/nombre/activado/"+nombreCategoria.replace(/-/g, " ")+"/titulo?page="+pagina+"&size="+tamanoPagina/* , { params: parametros} */ );
  }

  contenidosPorNombreDeCategoriaActivadoPaginado(nombreCategoria: string, pagina: number, tamanoPagina: number/* , activado: boolean */): Observable<any> {
    return this.httpCliente.get(this.rutaEndPoint+"/categoria/nombre/activado/"+nombreCategoria.replace(/-/g, " ")+"/titulo?page="+pagina+"&size="+tamanoPagina/* "/titulo", { params: parametros} */);
  }

  contenidosPorIdUsuario(idUsuario: number){
    return this.httpCliente.get(this.rutaEndPoint+"/usuario/"+idUsuario);
  }

}