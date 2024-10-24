import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Categoria } from '../categoria';
import { CategoriaService } from '../categoria.service';

@Component({
  selector: 'app-form-categoria',
  templateUrl: './form-categoria.component.html',
  styleUrls: ['./form-categoria.component.css']
})
export class FormCategoriaComponent implements OnInit {

  listaCategoria: Categoria[];
  camposFormulario: FormGroup;
  constructor(private categoriaSevice: CategoriaService,
              private referenciaVentanaModal: MatDialogRef<FormCategoriaComponent>,
              private constructorFormulario: FormBuilder) { }

  ngOnInit(): void {
    this.CrearFormulario();
  }
  
  CrearFormulario(): void {
    this.camposFormulario = this.constructorFormulario.group(
      {
        nombre: ['',]
     }
    );
  }
  ListarCategorias()  {
    this.categoriaSevice.listarElementos().subscribe(categorias => {
      this.listaCategoria = categorias;
    });
  }
  cancelarOperacion(): void {
    this.referenciaVentanaModal.close();
  }
  enviarFormulario() {
    if (this.camposFormulario.invalid) {
      return this.camposFormulario.markAllAsTouched();
    } else {
      this.referenciaVentanaModal.close(this.camposFormulario.value);
    }
  }

 

}
