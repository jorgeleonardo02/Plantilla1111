import { Injectable } from '@angular/core';
import { CommonService } from '../common/common.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subseccion } from './subseccion';
@Injectable({
  providedIn: 'root'
})
export class SubSeccionService extends CommonService<Subseccion> {
  protected override rutaEndPoint: string = 'http://localhost:8880/api/subsecciones'; // URL del backend
  constructor(httpCliente: HttpClient, enrutador: Router) {
    super(enrutador, httpCliente);
  }
}

