import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../common/common.service';
import { Categoria } from './categoria';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService extends CommonService<Categoria>{

    //protected override rutaEndPoint = 'http://localhost:8080/api/categorias'; 
    protected override rutaEndPoint = environment.endPointCategoria;

  constructor(enrutador: Router, http: HttpClient) { 
    super(enrutador, http); // instancio la clase padre
  }
  

}
