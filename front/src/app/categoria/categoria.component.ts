import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import alertasSweet from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Categoria } from './categoria';
import { CategoriaService } from './categoria.service';
import { FormCategoriaComponent } from './form-categoria/form-categoria.component';
import { TokenService } from '../seguridad/service/token.service';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css']
})
export class CategoriaComponent implements OnInit {

 
  columnasTabla: string[] = ['nombre', 'acciones'];
  datos: MatTableDataSource<Categoria>;

  // Paginador
  // Variables con valores iniciales para el paginador
  totalRegistros = 0;
  paginaActual = 0;
  totalPorPaginas = 5;
  pageSizeOptions: number[] = [3, 5, 10, 25, 100];
  @ViewChild(MatPaginator, {static: true}) paginador: MatPaginator;
  @ViewChild(MatSort, {static: true}) ordenadorRegistros: MatSort; // Sort

  constructor(private categoriaService: CategoriaService,
              private alertaSnackBar: MatSnackBar,
              public tokenService: TokenService,
              public ventanaModal: MatDialog) { }

  ngOnInit(): void {
    
    this.ObtenerListaCategoria();
    this.Paginado();
  }

  AbrirVentanaModalForm(): void {
    const referenciaVentanaModal = this.ventanaModal.open(FormCategoriaComponent,
      {
        width: '60%',
        height: 'auto',
        position: {left: '30%', top: '60px'}
      });
    referenciaVentanaModal.afterClosed().subscribe( resultado => {
        // no hay resultados cuando se cancela la operación (se cierra la ventana modal)
        if (resultado != null) {
          this.CrearCategoria(resultado);
        }
      });
  }

  CrearCategoria(categoria: any){
    this.categoriaService.agregarElemento(categoria).subscribe( categoria => {
      alertasSweet.fire('Categoria creada!', 'categoria  <strong>' + categoria.elemento.nombre + '</strong> creada con éxito.', 'success');
      this.Paginado(); 
    });
  }

  listaCategorias: Categoria[];
  ObtenerListaCategoria(){
    this.categoriaService.listarElementos().subscribe(categorias => {
      this.listaCategorias = categorias;
    });
  }
  
  // Datos Paginador
paginar(evento: PageEvent): void {
  this.paginaActual = evento.pageIndex;
  this.totalPorPaginas = evento.pageSize; // Lo que enviamos al backend
  this.Paginado();
}

// Paginador
private Paginado(): void {
  this.categoriaService.obtenerElementosPaginado(this.paginaActual.toString(), this.totalPorPaginas.toString()).subscribe(paginacion => {
    this.listaCategorias = paginacion.content as Categoria[];
    this.totalRegistros = paginacion.totalElements as number; // Cantidad de registros
    this.paginador._intl.itemsPerPageLabel = 'Registros por página:';
    // Para utilizar la tabla
    this.datos = new MatTableDataSource<Categoria>(this.listaCategorias);
  });
}

// Reordenar Sort
reordenar(sort: Sort) {

  const listEnvioCiudad = this.listaCategorias.slice(); // obtenemos el array*/

  /*
  Si no está activo el sorting o no se ha establecido la dirección (asc ó desc)
  se asigna los mismos datos (sin ordenar)
  */
  if (!sort.active || sort.direction === '' ) {
  this.datos = new MatTableDataSource<Categoria>(this.listaCategorias);
  return;
  }

  /*this.datos = new MatTableDataSource<Categoria>(
  this.listaCategorias = listEnvioCiudad.sort( (a, b) => {

    const esAscendente = sort.direction === 'asc'; // Se determina si es ascendente
    switch (sort.active) { // Obtiene el id (string) de la columna seleccionada
      case 'nombre': return this.comparar(a.nombre, b.nombre, esAscendente); // compara por id
  }
  }));*/
  // cada vez que se haga clic en un botón para reordenar es necesario paginar de nuevo
}

  // Esta función compara dos String junto con el valor de la variable isAsc y retorna:
  comparar(a: number | string, b: number | string, esAscendente: boolean) {
    return (a < b ? -1 : 1) * (esAscendente ? 1 : -1);
  }

  // Eliminar
public Eliminar(categoria: Categoria): void {
  Swal.fire ({
  title: '¿Estas seguro?',
  text: '¿Seguro que desea Eliminar la categoria' + categoria.nombre + ' ?',
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#ad3333',
  cancelButtonText: 'No, cancelar!',
  confirmButtonText: 'Si, eliminar!'
  }).then((respuesta) => {
    if (respuesta.value) {
        if(categoria.listaCurso.length !=0 ) {
          this.alertaSnackBar.open("No se puede eliminar esta categoria, hay curso de esta categoria!!", 'Cerrar', {
          duration: 8000 });
        } else {
            this.categoriaService.eliminaElemento(categoria.id).subscribe(respuesta => {
              this.Paginado();
              alertasSweet.fire('Categoria eliminada!', 'categoria  <strong>' + categoria.nombre + '</strong> Eliminado con éxito.', 'success');
              this.Paginado(); 
            });
        }
      }
  });
}
}
