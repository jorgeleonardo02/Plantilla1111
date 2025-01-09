import { Injectable } from '@angular/core';
import { CommonService } from '../common/common.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SubSeccion } from './sub-seccion';
@Injectable({
  providedIn: 'root'
})
export class SubSeccionService extends CommonService<SubSeccion> {
  protected override rutaEndPoint: string = 'http://localhost:8888/api/subsecciones'; // URL del backend
  constructor(httpCliente: HttpClient, enrutador: Router) {
    super(enrutador, httpCliente);
  }
}

