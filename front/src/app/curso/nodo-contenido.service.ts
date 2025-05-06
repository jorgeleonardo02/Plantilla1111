import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface NodoContenidoDTO {
  id?: number;
  name: string;
  path: string;
  numeroSeccion: string;
  contenidoTexto: string;
  children: NodoContenidoDTO[];
}

@Injectable({
  providedIn: 'root'
})
export class NodoContenidoService {

  private baseUrl = '/api/nodos'; // Tu base url de backend

  constructor(private http: HttpClient) {}

  obtenerNodosRaiz(): Observable<NodoContenidoDTO[]> {
    return this.http.get<NodoContenidoDTO[]>(`${this.baseUrl}/raiz`);
  }

  guardarNodo(dto: NodoContenidoDTO): Observable<NodoContenidoDTO> {
    return this.http.post<NodoContenidoDTO>(`${this.baseUrl}/dto`, dto);
  }

  obtenerNodoPorId(id: number): Observable<NodoContenidoDTO> {
    return this.http.get<NodoContenidoDTO>(`${this.baseUrl}/${id}`);
  }

  eliminarNodo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
