import { Injectable } from '@angular/core';
import { CommonService } from '../common/common.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Seccion } from './seccion';
@Injectable({
  providedIn: 'root'
})
export class SeccionService extends CommonService<Seccion> {
  protected override rutaEndPoint: string = 'http://localhost:8888/api/secciones'; // URL del backend
  constructor(httpCliente: HttpClient, enrutador: Router) {
    super(enrutador, httpCliente);
  }
}

