// 1  bueno faltan una validaciones

/* import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeModule } from '@angular/material/tree';
import { QuillModule } from 'ngx-quill';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditorComponent } from '../editor/editor.component';
import { NodoContenidoDTO, NodoContenidoService } from '../nodo-contenido.service';

  export interface NodoContenido {
    id?: number;
    name: string;
    children?: NodoContenido[];
    path?: string;
    contenidoTexto?: string;
    numeroSeccion?: string;
  }

interface NodoPlano {
  expandable: boolean;
  name: string;
  level: number;
  path: string;
  numeroSeccion?: string;
}

@Component({
  selector: 'app-contenido2',
  templateUrl: './contenido2.component.html',
  styleUrls: ['./contenido2.component.css'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatIconModule,
    QuillModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatTreeModule
    
  ]
})
export class Contenido2Component implements OnInit {
  formSeccion!: FormGroup;
  dataArbol: NodoContenido[] = [];
  formNodosMap: Map<NodoContenido, FormGroup> = new Map();
  
  constructor(
    private dialogRef: MatDialogRef<Contenido2Component>,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private nodoContenidoService: NodoContenidoService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dataSource.data = this.dataArbol;
  }

  treeControl = new FlatTreeControl<NodoPlano>(
    node => node.level,
    node => node.expandable
  );

  transformador = (node: NodoContenido, level: number): NodoPlano => ({
    name: node.name,
    level,
    expandable: !!node.children && node.children.length > 0,
    path: this.getRuta(node),
    numeroSeccion: node.numeroSeccion  // si quieres mostrarlo en el template
  });

  treeFlattener = new MatTreeFlattener(
    this.transformador,
    node => node.level,
    node => node.expandable,
    node => node.children
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  hasChild = (_: number, node: NodoPlano) => node.expandable;

  //gOnInit(): void {
    //this.formSeccion = this.fb.group({
      //nombreCurso: [this.data.curso.nombre, Validators.required],
      //secciones: this.fb.array([])
    //});
    //this.dataSource.data = this.dataArbol;
    //this.agregarSeccion(); // Primera sección por defecto
    //this.actualizarDataSource();
    
  //}

  ngOnInit(): void {
    this.formSeccion = this.fb.group({
      nombreCurso: [this.data.curso.nombre, Validators.required],
      secciones: this.fb.array([])
    });
  
    // 1) Cargar árboles guardados en BD
    this.nodoContenidoService.obtenerNodosRaiz().subscribe({
      next: (raices: NodoContenido[]) => {
        this.dataArbol = raices;

        // Si no hay ninguna sección en BD, crea una por defecto
        if (this.dataArbol.length === 0) {
          this.agregarSeccion();
        }

        this.dataArbol = raices.sort((a, b) =>
          a.numeroSeccion!.localeCompare(b.numeroSeccion!, undefined, { numeric: true })
        );
        //this.asignarNumerosYPaths(this.dataArbol);   // recalcula numeroSeccion y path
        this.actualizarFormularios();                // sincroniza tus formularios
        this.actualizarDataSource();                 // aplica paginación y pintado
        console.log('Árbol cargado desde BD:');
        this.imprimirArbol(this.dataArbol);
      },
      error: (err) => {
        console.error('Error cargando árboles desde BD', err);
        // Fallback: si falla, crear sección por defecto
        this.agregarSeccion();
      }
    });
  }

  actualizarDataSource(): void {
    const inicio = this.paginaActual * this.tamanioPagina;
    const dataPaginada = this.dataArbol.slice(inicio, inicio + this.tamanioPagina);
    this.dataSource.data = dataPaginada;
  }
  
  // 1  
  //agregarSeccion(): void {
    //const nuevaSeccion: NodoContenido = {
      //name: `Sección ${this.dataSource.data.length + 1}`,
      //children: [{ name: '1', children: [] }]
    //};
    //this.dataArbol.push(nuevaSeccion);
    //this.actualizarDataSource(); // Aplica paginación y actualiza el tree
    //this.actualizarFormularios(); 
    //console.log("dataArbol");
    //console.log(this.dataArbol); // Verifica la estructura del árbol
    //console.log("Estructura del árbol:");
  //this.imprimirArbol(this.dataArbol); // Aquí imprime todo jerárquicamente
  //} 

  // v111
  agregarSeccion(): void {
    const nuevaSeccion: NodoContenido = {
      name: `Sección ${this.dataArbol.length + 1}`,
      children: [],
      numeroSeccion: '', // Se asigna en actualizarNumerosSeccion
    };
    this.dataArbol.push(nuevaSeccion);
    this.actualizarData(); // Importante para actualizar el árbol
    this.actualizarNumerosSeccion(); // Asignar número jerárquico
  }
  
  //agregarHijo(padre: NodoContenido): void {
    //if (!padre.children) padre.children = [];
    //padre.children.push({ name: `${padre.children.length + 1}`, children: [] });
    //this.actualizarData();
    //console.log("Estructura del árbol:");
  //this.imprimirArbol(this.dataArbol); // Aquí imprime todo jerárquicamente
  //}

  // v111
  agregarHijo(padre: NodoContenido): void {
    if (!padre.children) padre.children = [];
  
    const nuevoHijo: NodoContenido = {
      name: `Subsección ${padre.children.length + 1}`,
      children: [],
      numeroSeccion: '', // Se asigna después
    };
  
    padre.children.push(nuevoHijo);
    this.actualizarData();
    this.actualizarNumerosSeccion(); // Recalcular numeración
  }
  
  // v111
  actualizarNumerosSeccion(): void {
    const asignarNumeros = (nodos: NodoContenido[], prefijo: string = '') => {
      nodos.forEach((nodo, index) => {
        const nuevoPrefijo = prefijo ? `${prefijo}.${index + 1}` : `${index + 1}`;
        nodo.numeroSeccion = nuevoPrefijo;
        if (nodo.children) {
          asignarNumeros(nodo.children, nuevoPrefijo);
        }
      });
    };
  
    asignarNumeros(this.dataArbol);
    this.actualizarData(); // Vuelve a reflejar cambios en el árbol plano
  }
  
  agregarRaiz(): void {
    const nuevoIndice = this.dataArbol.length + 1;
  
    const nuevoNodo: NodoContenido = {
      name: `Sección ${nuevoIndice}`,
      numeroSeccion: `${nuevoIndice}`,
      children: []
    };
  
    this.dataArbol.push(nuevoNodo);
    this.actualizarData();
  }

  //eliminarUltimaSeccion() {
    //if (this.dataArbol.length > 1) {
      //this.dataArbol.pop();
       // Si la página actual ya no tiene datos, retroceder una página si es posible
    //const totalPaginas = this.totalPaginas;
    //if (this.paginaActual >= totalPaginas && this.paginaActual > 0) {
      //this.paginaActual--;
    //}
      //this.actualizarDataSource(); // recarga el árbol con paginación
    //}
  //}

  // v111
  eliminarUltimaSeccion(): void {
  if (this.dataArbol.length > 0) {
    const nodoEliminado = this.dataArbol.pop(); // Elimina la última sección raíz

    // Elimina el form asociado si existe
    if (nodoEliminado) {
      this.formNodosMap.delete(nodoEliminado);
    }

    // Recalcula la estructura y la numeración
    this.actualizarData();
    this.actualizarNumerosSeccion();

    // Si la página actual ya no tiene datos, retroceder una página si es posible
    const totalPaginas = this.totalPaginas;
    if (this.paginaActual >= totalPaginas && this.paginaActual > 0) {
      this.paginaActual--;
    }

    // Refresca los datos mostrados
    this.actualizarData();
  }
}


        eliminarNodo(padre: NodoContenido | null, nodo: NodoContenido): void {
          if (padre === null) {
            // No permitimos dejar el árbol sin secciones
            if (this.dataArbol.length <= 1) {
              console.warn('Debe haber al menos una sección.');
              return;
            }
        
            // Si el nodo tiene un id (persistido en BD), llamamos al DELETE
            if (nodo.id != null) {
              this.nodoContenidoService.eliminarNodo(nodo.id).subscribe({
                next: () => {
                  this._removerYActualizar(nodo);
                },
                error: err => {
                  console.error('Error al borrar nodo en BD', err);
                }
              });  
            } else {
              // Nodo sin id: sólo eliminamos en memoria
              this._removerYActualizar(nodo);
            }
          } else {
            // Eliminación de subnodos en memoria; save posterior en BD con orphanRemoval
            // if (padre.children!.length <= 1) {
              //console.warn('Debe haber al menos una subsección.');
              //return;
            //} 
            padre.children = padre.children!.filter(n => n !== nodo);
            padre.children!.forEach((hijo, idx) => {
              hijo.name = `${idx + 1}`;
            });
            this.actualizarDataSource();
            this.actualizarFormularios();
            console.log("Estructura tras borrar subnodo:", this.dataArbol);
          }
        }

          //eliminarNodo(padre: NodoContenido | null, nodoAEliminar: NodoContenido): void {
           // if (padre) {
              // Si el nodo tiene padre, lo buscamos entre sus hijos
             // padre.children = padre.children?.filter(child => child !== nodoAEliminar) || [];
            //} else {
              // Si no tiene padre, está en la raíz
              //this.dataArbol = this.dataArbol.filter(nodo => nodo !== nodoAEliminar);
            //}
          
            // Después de eliminar, actualizamos el árbol y numeración
            //this.actualizarData();
            //this.actualizarNumerosSeccion(); // 🔧 Importante para actualizar número de sección
          //}
          
        
        // Método auxiliar para DRY
        private _removerYActualizar(nodo: NodoContenido) {
          // 1) Filtrar el array de roots
          this.dataArbol = this.dataArbol.filter(n => n !== nodo);
          // 2) Renumerar nombres
          this.dataArbol.forEach((seccion, idx) => {
            seccion.name = `Sección ${idx + 1}`;
          });
          // 3) Ajustar paginación si la página actual quedó vacía
          const totalPag = this.totalPaginas;
          if (this.paginaActual >= totalPag && this.paginaActual > 0) {
            this.paginaActual--;
          }
          // 4) Refrescar tree y formularios
          this.actualizarDataSource();
          this.actualizarFormularios();
          console.log("Estructura tras borrar root:", this.dataArbol);
        }
  
  actualizarData(): void {
    const nodosExpandidos = this.treeControl.expansionModel.selected.map(n => n.name);
    this.dataSource.data = [...this.dataSource.data];
    setTimeout(() => {
      this.treeControl.dataNodes.forEach(nodo => {
        if (nodosExpandidos.includes(nodo.name)) {
          this.treeControl.expand(nodo);
        }
      });
    });
  }

  getParent(nodeBuscado: NodoContenido, nodos: NodoContenido[] = this.dataSource.data, padre: NodoContenido | null = null): NodoContenido | null {
    for (let nodo of nodos) {
      if (nodo === nodeBuscado) return padre;
      if (nodo.children) {
        const resultado = this.getParent(nodeBuscado, nodo.children, nodo);
        if (resultado) return resultado;
      }
    }
    return null;
  }

  getNodoDesdePlano(nodoPlano: NodoPlano): NodoContenido {
    const encontrarNodo = (nodos: NodoContenido[]): NodoContenido | null => {
      for (let nodo of nodos) {
        if (this.getRuta(nodo) === nodoPlano.path) return nodo;
        if (nodo.children) {
          const resultado = encontrarNodo(nodo.children);
          if (resultado) return resultado;
        }
      }
      return null;
    };

    const nodoEncontrado = encontrarNodo(this.dataSource.data);
    if (!nodoEncontrado) {
      throw new Error(`No se encontró el nodo para la ruta: ${nodoPlano.path}`);
    }
    return nodoEncontrado;
  }

  getRuta(nodo: NodoContenido, nodos: NodoContenido[] = this.dataArbol): string {
    const ruta: string[] = [];
    const encontrarRuta = (n: NodoContenido[], camino: string[]): boolean => {
      for (let i = 0; i < n.length; i++) {
        const actual = n[i];
        const nuevaRuta = [...camino, `${i + 1}`];
        if (actual === nodo) {
          ruta.push(...nuevaRuta);
          return true;
        }
        if (actual.children && encontrarRuta(actual.children, nuevaRuta)) {
          return true;
        }
      }
      return false;
    };
    encontrarRuta(nodos, []);
    return ruta.join('.');
  }

  onSubmit(): void {
    if (this.formSeccion.valid) {
      console.log('Formulario enviado:', this.formSeccion.value);
      this.dialogRef.close(this.formSeccion.value);
    } else {
      console.log('Formulario inválido. Revisa los campos.');
    }
  }

  getFormGroup(nodo: NodoContenido): FormGroup {
    if (!this.formNodosMap.has(nodo)) {
      const path = this.getRuta(nodo);
      const fg = this.fb.group({
        numeroSeccion: [path, Validators.required],
        //nombreSeccion: [`Sección ${path}`, Validators.required],
        nombreSeccion: ['', Validators.required],
        contenidoTexto: [nodo.contenidoTexto || ''] // Inicializa con contenido HTML vacío si no existe

      });
      this.formNodosMap.set(nodo, fg);
    }
    return this.formNodosMap.get(nodo)!;
  }
  
paginaActual = 0;
tamanioPagina = 1;

get totalPaginas() {
  return Math.ceil(this.dataArbol.length / this.tamanioPagina);
}

paginaAnterior() {
  if (this.paginaActual > 0){
    this.paginaActual--;
    this.actualizarDataSource();
  }
    
}

paginaSiguiente() {
  if (this.paginaActual < this.totalPaginas - 1) 
    {
      this.paginaActual++;
      this.actualizarDataSource();
    }
}

actualizarFormularios(): void {
  const recorrerNodos = (nodos: NodoContenido[]) => {
    nodos.forEach(nodo => {
      const path = this.getRuta(nodo);
      //const nombre = nodo.name || ''; // Utiliza el nombre existente o una cadena vacía
      if (this.formNodosMap.has(nodo)) {
        const form = this.formNodosMap.get(nodo)!;
        form.patchValue({
          numeroSeccion: '',//path,
          //nombreSeccion: nombre
          nombreSeccion: `Sección ${path}`
        });
      } else {
        const form = this.fb.group({
          numeroSeccion: [path, Validators.required],
          //nombreSeccion: [nombre, Validators.required]
          nombreSeccion: [`Sección ${path}`, Validators.required]
        });
        this.formNodosMap.set(nodo, form);
      }
      if (nodo.children) {
        recorrerNodos(nodo.children);
      }
    });
  };
  recorrerNodos(this.dataArbol);
}
  

abrirEditor(nodo: NodoContenido) {
  const dialogRef = this.dialog.open(EditorComponent, {
    width: '800px',
    data: { nodo } // o solo contenidoTexto, según necesites
  });

  dialogRef.afterClosed().subscribe((resultado: any) => {
    if (resultado) {
      nodo.name = resultado.titulo;
      nodo.contenidoTexto = resultado.contenidoHTML;
      console.log('nodo.name:', nodo.name);
      console.log('nodo.contenidoTexto:', nodo.contenidoTexto);
      // Actualizar el formulario asociado al nodo
      const form = this.getFormGroup(nodo);
      form.patchValue({
        nombreSeccion: resultado.titulo,
        contenidoTexto: resultado.contenidoHTML
      });

      // Actualizar la visualización del árbol
      this.actualizarData();
    }
  });
}
//imprimirArbol(data: NodoContenido[], nivel: string = ''): void {
  //data.forEach((nodo, index) => {
    //const numeroSeccion = nivel ? `${nivel}.${index + 1}` : `${index + 1}`;
    //console.log(`numero de seccion: ${numeroSeccion} nombre de seccion: ${nodo.name}`);
    //if (nodo.children && nodo.children.length > 0) {
      //this.imprimirArbol(nodo.children, numeroSeccion);
    //}
  //});
//}
  
    contadorGlobal = 0; // <- contador para todos los nodos

        imprimirArbol(data: NodoContenido[], nivel: string = ''): void {
          data.forEach((nodo, index) => {
            const numeroSeccion = nivel ? `${nivel}.${index + 1}` : `${index + 1}`;
            const form = this.getFormGroup(nodo); 
            const nombreActualizado = form?.get('nombreSeccion')?.value || nodo.name;
            console.log(`numero de seccion: ${numeroSeccion} nombre de seccion: ${nombreActualizado}`);
            
            if (nodo.children && nodo.children.length > 0) {
              this.imprimirArbol(nodo.children, numeroSeccion);
            }
          });
        }
    
    generarNumeroSeccion(nivel: string): string {
      return nivel ? `${nivel}.${this.contadorGlobal}` : `${this.contadorGlobal}`;
    }

  private mapNodoContenidoToDTO(nodo: NodoContenido): NodoContenidoDTO {
    return {
      id: nodo.id,                                     // sigue igual
      name: nodo.name,                                 // sigue igual
      path: nodo.path  ?? '',                          // ya lo tenías
      numeroSeccion: nodo.numeroSeccion ?? '',         // ← ¡agregado!
      contenidoTexto: nodo.contenidoTexto ?? '',       // sigue igual
      children: nodo.children
        ? nodo.children.map(child => this.mapNodoContenidoToDTO(child))
        : []
    };
  }

  onClickGuardar() {
    // Actualiza numeroSeccion y path en TODOS los nodos
    this.asignarNumerosYPaths(this.dataArbol);

    // Mapea y guarda
    this.guardarArbol();
  }

  guardarArbol() {
    const arbolDTO: NodoContenidoDTO[] =
      this.dataArbol.map(nodo => this.mapNodoContenidoToDTO(nodo));
      console.log('Árbol a guardar:', arbolDTO);
    arbolDTO.forEach(nodoDTO => {
      this.nodoContenidoService.guardarNodo(nodoDTO).subscribe({
        next: respuesta => console.log('Nodo guardado correctamente', respuesta),
        error: error => console.error('Error al guardar el nodo', error)
      });
    });
  }
    // u  
    asignarNumerosYPaths(
      nodos: NodoContenido[],
      prefijoNumero: string = '',
      prefijoPath: string = ''
    ): void {
      nodos.forEach((nodo, index) => {
        const numeroSeccion = prefijoNumero 
          ? `${prefijoNumero}.${index + 1}` 
          : `${index + 1}`;
        nodo.numeroSeccion = numeroSeccion;
        // Solo asignar nombre automático si no ha sido modificado manualmente
        if (!nodo.name || nodo.name.startsWith('Sección')) {
          nodo.name = `Sección ${numeroSeccion}`;
        }
        nodo.path = `${prefijoPath}/${nodo.name}`;
        if (nodo.children && nodo.children.length > 0) {
          this.asignarNumerosYPaths(nodo.children, numeroSeccion, nodo.path);
        }
      });
    }
}  */
    


// ************************************** 2 ******************************************** *

import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule } from '@angular/material/tree';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { QuillModule } from 'ngx-quill';
import { NodoContenidoDTO, NodoContenidoService } from '../nodo-contenido.service';
import { EditorComponent } from '../editor/editor.component';


export interface NodoContenido {
  id?: number;
  name: string;
  children?: NodoContenido[];
  path?: string;
  contenidoTexto?: string;
  numeroSeccion?: string;
}

interface NodoPlano {
  expandable: boolean;
  name: string;
  level: number;
  path: string;
  numeroSeccion?: string;
}

@Component({
  selector: 'app-contenido2',
  templateUrl: './contenido2.component.html',
  styleUrls: ['./contenido2.component.css'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatIconModule,
    QuillModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatTreeModule
  ]
})
export class Contenido2Component implements OnInit {
  formSeccion!: FormGroup;
  dataArbol: NodoContenido[] = [];
  formNodosMap: Map<NodoContenido, FormGroup> = new Map();
  

  constructor(
    private dialogRef: MatDialogRef<Contenido2Component>,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private nodoContenidoService: NodoContenidoService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dataSource.data = this.dataArbol;
  }

  treeControl = new FlatTreeControl<NodoPlano>(
    node => node.level,
    node => node.expandable
  );

  transformador = (node: NodoContenido, level: number): NodoPlano => ({
    name: node.name,
    level,
    expandable: !!node.children && node.children.length > 0,
    path: this.getRuta(node),
    numeroSeccion: node.numeroSeccion
  });

  treeFlattener = new MatTreeFlattener(
    this.transformador,
    node => node.level,
    node => node.expandable,
    node => node.children
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: NodoPlano) => node.expandable;

  ngOnInit(): void {
    this.formSeccion = this.fb.group({
      nombreCurso: [this.data.curso.nombre, Validators.required],
      secciones: this.fb.array([])
    });

    this.nodoContenidoService.obtenerNodosRaiz().subscribe({
      next: (raices: NodoContenido[]) => {
        this.dataArbol = raices;

        if (this.dataArbol.length === 0) {
          this.agregarSeccion();
        }

        this.dataArbol = raices.sort((a, b) =>
          a.numeroSeccion!.localeCompare(b.numeroSeccion!, undefined, { numeric: true })
        );

        this.actualizarFormularios();
        
        console.log('Árbol cargado desde BD:');
        this.imprimirArbol(this.dataArbol);
        this.actualizarDataSource();
      },
      error: (err) => {
        console.error('Error cargando árboles desde BD', err);
        this.agregarSeccion();
      }
    });
  }

    actualizarDataSource(): void {
      const inicio = this.paginaActual * this.tamanioPagina;
      const dataPaginada = this.dataArbol.slice(inicio, inicio + this.tamanioPagina);
      this.dataSource.data = dataPaginada;
    }
    
  agregarSeccion(): void {this.actualizarDataSource()
    const nuevaSeccion: NodoContenido = {
      name: `Sección ${this.dataArbol.length + 1}`,
      children: [],
      numeroSeccion: '',
    };
    
    this.dataArbol.push(nuevaSeccion);   
    this.actualizarData();
    this.actualizarDataSource();
    this.actualizarNumerosSeccion(this.dataArbol);
  }

  agregarRaiz(): void {
    const nuevoIndice = this.dataArbol.length + 1;
    const nuevoNodo: NodoContenido = {
      name: `Sección ${nuevoIndice}`,
      numeroSeccion: `${nuevoIndice}`,
      children: []
    };
    this.dataArbol.push(nuevoNodo);
    this.actualizarData();
  }

  agregarHijo(padre: NodoContenido): void {
    if (!padre.children) {
      padre.children = [];
    }

    const nuevoHijo: NodoContenido = {
      // se carga en el input numero y nombre por defecto
      name: `Subsección ${padre.numeroSeccion}.${padre.children.length + 1}`,
      children: [],
      numeroSeccion: `${padre.numeroSeccion}.${padre.children.length + 1}`
    };

    padre.children.push(nuevoHijo);
    this.actualizarData();
    this.actualizarDataSource();
    console.log("Estructura del árbol después de agregar hijo:");
    this.imprimirArbol(this.dataArbol);
  }

    eliminarUltimaSeccion(): void {
      console.log("leoleo");
      // ✅ Evita dejar el árbol sin secciones
      if (this.dataArbol.length <= 1) {
        console.warn('Debe haber al menos una sección.');
        return;
      }
    
      if (this.dataArbol.length > 0) {
        const nodoEliminado = this.dataArbol.pop();
        if (nodoEliminado) {
          this.formNodosMap.delete(nodoEliminado);
        }
    
        const nuevaLongitud = this.dataArbol.length;
        const totalPaginas = Math.ceil(nuevaLongitud / this.tamanioPagina);
        const ultimaPaginaPosible = Math.floor((nuevaLongitud - 1) / this.tamanioPagina);
        if (this.paginaActual > ultimaPaginaPosible) {
          console.log("✅ Se va a retroceder una página");
          this.paginaActual--;
        }
    
        // 🔄 Refrescar vista y estructura
        this.actualizarDataSource();
        this.actualizarNumerosSeccion(this.dataArbol);
        this.actualizarData();
      }
    }
      
        eliminarNodo(padre: NodoContenido | null, nodoAEliminar: NodoContenido): void {
         

          // ✅ Evita dejar el árbol sin secciones
        if (!padre && this.dataArbol.length <= 1) {
          console.warn('Debe haber al menos una sección.');
          return;
        }
          const eliminarVisualmente = () => {
            if (!padre) {
              const index = this.dataArbol.indexOf(nodoAEliminar);
              if (index > -1) this.dataArbol.splice(index, 1);
            } else if (padre.children) {
              const index = padre.children.indexOf(nodoAEliminar);
              if (index > -1) padre.children.splice(index, 1);
            }
        
            // Eliminar formularios
            const eliminarFormulariosRecursivo = (nodo: NodoContenido) => {
              this.formNodosMap.delete(nodo);
              this.formularios.delete(nodo);
              nodo.children?.forEach(hijo => eliminarFormulariosRecursivo(hijo));
            };
            eliminarFormulariosRecursivo(nodoAEliminar);
        
            // ✅ Aquí recalculas númeroSeccion y path en todos los nodos
            this.asignarNumerosYPaths(this.dataArbol);  // <-- ¡Este es el cambio clave!
        
            // Recalcular secciones (si aún lo necesitas, opcional si lo reemplazas por asignarNumerosYPaths)
            this.actualizarNumerosSeccion(this.dataArbol); // puedes eliminar esto si ya no lo usas
        
            // 🔥 Fuerza cambio de referencia para que Angular lo detecte
            this.dataArbol = [...this.dataArbol];

          const nuevaLongitud = this.dataArbol.length;
          const totalPaginas = Math.ceil(nuevaLongitud / this.tamanioPagina);
          const ultimaPaginaPosible = Math.floor((nuevaLongitud - 1) / this.tamanioPagina);
          if (this.paginaActual > ultimaPaginaPosible) {
            this.paginaActual--;
          }
        
            this.actualizarFormularios();
            this.actualizarDataSource(); // ya usa slice()
            this.treeControl.expandAll(); // Opcional: para ver todos los nodos después del cambio
          };
        
          if (nodoAEliminar.id != null) {
            this.nodoContenidoService.eliminarNodo(nodoAEliminar.id).subscribe({
              next: () => eliminarVisualmente(),
              error: err => console.error('Error al borrar nodo en BD', err)
            });
          } else {
            eliminarVisualmente();
          }
        }
        
      

  actualizarNumerosSeccion(nodos: NodoContenido[], prefijo: string = ''): void {
    nodos.forEach((nodo, index) => {
      const numeroActual = prefijo ? `${prefijo}.${index + 1}` : `${index + 1}`;
      nodo.numeroSeccion = numeroActual;

      const form = this.formNodosMap.get(nodo);
      if (form) {
        form.get('numeroSeccion')?.setValue(numeroActual, { emitEvent: false });
      }

      if (nodo.children && nodo.children.length > 0) {
        this.actualizarNumerosSeccion(nodo.children, numeroActual);
      }
    });
  }

    actualizarData(): void {
      // Guardar los nombres o IDs de los nodos expandidos
      const nodosExpandidos = this.treeControl.expansionModel.selected.map(n => n.name);
    
      // Actualizar datos
      this.actualizarNumerosSeccion(this.dataArbol);
      this.dataSource.data = [...this.dataArbol];
    
      // Restaurar expansión en el próximo ciclo de detección de cambios
      setTimeout(() => {
        this.treeControl.dataNodes.forEach(nodo => {
          if (nodosExpandidos.includes(nodo.name)) {
            this.treeControl.expand(nodo);
          }
        });
      });
    
      // Corregir página si es necesario
      if (this.paginaActual >= this.totalPaginas && this.paginaActual > 0) {
        this.paginaActual--;
      }
    }

  getParent(nodeBuscado: NodoContenido, nodos: NodoContenido[] = this.dataArbol, padre: NodoContenido | null = null): NodoContenido | null {
     
  for (let nodo of nodos) {
      if (nodo === nodeBuscado) return padre;
      if (nodo.children) {
        const resultado = this.getParent(nodeBuscado, nodo.children, nodo);
        if (resultado) return resultado;
      }
    }
    return null;
  }

  getNodoDesdePlano(nodoPlano: NodoPlano): NodoContenido {
    const encontrarNodo = (nodos: NodoContenido[]): NodoContenido | null => {
      for (let nodo of nodos) {
        if (this.getRuta(nodo) === nodoPlano.path) return nodo;
        if (nodo.children) {
          const resultado = encontrarNodo(nodo.children);
          if (resultado) return resultado;
        }
      }
      return null;
    };
    const nodoEncontrado = encontrarNodo(this.dataArbol);

    if (!nodoEncontrado) {
      throw new Error(`No se encontró el nodo para la ruta: ${nodoPlano.path}`);
    }
    return nodoEncontrado;
  }

  getRuta(nodo: NodoContenido, nodos: NodoContenido[] = this.dataArbol): string {
    const ruta: string[] = [];
    const encontrarRuta = (n: NodoContenido[], camino: string[]): boolean => {
      for (let i = 0; i < n.length; i++) {
        const actual = n[i];
        const nuevaRuta = [...camino, `${i + 1}`];
        if (actual === nodo) {
          ruta.push(...nuevaRuta);
          return true;
        }
        if (actual.children && encontrarRuta(actual.children, nuevaRuta)) {
          return true;
        }
      }
      return false;
    };
    encontrarRuta(nodos, []);
    return ruta.join('.');
  }

  /* getFormGroup(nodo: NodoContenido): FormGroup {
    if (!this.formNodosMap.has(nodo)) {
      const path = this.getRuta(nodo);
      const formGroup = this.fb.group({
        name: [nodo.name],
        contenidoTexto: [nodo.contenidoTexto || ''],
        numeroSeccion: [nodo.numeroSeccion || path]
      });
      this.formNodosMap.set(nodo, formGroup);
    }
    return this.formNodosMap.get(nodo)!;
  }
 */

  formularios: Map<NodoContenido, FormGroup> = new Map();

getFormGroup(nodo: NodoContenido): FormGroup {
  if (!this.formularios.has(nodo)) {
    const form = this.fb.group({
      numeroSeccion: [nodo.numeroSeccion || '', Validators.required],
      nombreSeccion: [nodo.name || '', Validators.required],
    });
    // 🔄 Sincronizar nombreSeccion del form con nodo.name

    form.get('nombreSeccion')?.valueChanges.subscribe((valor) => {
      nodo.name = valor ?? '';
    });
    this.formularios.set(nodo, form);
  }
  return this.formularios.get(nodo)!;
}
  
  actualizarFormularios(): void {
    const recorrer = (nodos: NodoContenido[]) => {
      nodos.forEach(n => {
        const form = this.getFormGroup(n); // crea o recupera el form
  
        // 🔥 actualiza manualmente los valores en el formulario
        form.get('numeroSeccion')?.setValue(n.numeroSeccion);
        form.get('name')?.setValue(n.name);
        form.get('path')?.setValue(n.path);
        form.get('nombreSeccion')?.setValue(n.name); // ✅ aquí actualizas también nombreSeccion

  
        if (n.children) recorrer(n.children);
      });
    };
    recorrer(this.dataArbol);
  }
  imprimirArbol(nodos: NodoContenido[], nivel: number = 0): void {
    nodos.forEach(n => {
      const indentacion = ' '.repeat(nivel * 2);
      console.log(`${indentacion}${n.numeroSeccion} - ${n.name}`);
      if (n.children) {
        this.imprimirArbol(n.children, nivel + 1);
      }
    });
  }

  onSubmit(): void {
    if (this.formSeccion.valid) {
      console.log('Formulario enviado:', this.formSeccion.value);
      this.dialogRef.close(this.formSeccion.value);
    } else {
      console.log('Formulario inválido. Revisa los campos.');
    }
  }

  ///////////////////////////////////////////
  abrirEditor(nodo: NodoContenido) {
    const dialogRef = this.dialog.open(EditorComponent, {
      width: '800px',
      data: { nodo } // o solo contenidoTexto, según necesites
    });
  
    dialogRef.afterClosed().subscribe((resultado: any) => {
      if (resultado) {
        nodo.name = resultado.titulo;
        nodo.contenidoTexto = resultado.contenidoHTML;
        console.log('nodo.name:', nodo.name);
        console.log('nodo.contenidoTexto:', nodo.contenidoTexto);
        // Actualizar el formulario asociado al nodo
        const form = this.getFormGroup(nodo);
        form.patchValue({
          nombreSeccion: resultado.titulo,
          contenidoTexto: resultado.contenidoHTML
        });
  
        // Actualizar la visualización del árbol
        this.actualizarData();
        this.actualizarDataSource();
      }
    });
  }
  
paginaActual = 0;
tamanioPagina = 1;

get totalPaginas() {
  return Math.ceil(this.dataArbol.length / this.tamanioPagina);
}

paginaAnterior() {
  if (this.paginaActual > 0){
    this.paginaActual--;
    this.actualizarDataSource();
  }
    
}

paginaSiguiente() {
  if (this.paginaActual < this.totalPaginas - 1) 
    {
      this.paginaActual++;
      this.actualizarDataSource();
    }
}

asignarNumerosYPaths(
  nodos: NodoContenido[],
  prefijoNumero: string = '',
  prefijoPath: string = ''
): void {
  nodos.forEach((nodo, index) => {
    const numeroSeccion = prefijoNumero 
      ? `${prefijoNumero}.${index + 1}` 
      : `${index + 1}`;
    nodo.numeroSeccion = numeroSeccion;
    // Solo asignar nombre automático si no ha sido modificado manualmente
    //if (!nodo.name || nodo.name.startsWith('Sección')) {
      //nodo.name = `Sección ${numeroSeccion}`;
    //}
    if (!nodo.name || nodo.name.startsWith('Sección') || nodo.name.startsWith('Subsección')) {
      nodo.name = prefijoNumero === ''
        ? `Sección ${numeroSeccion}`
        : `Subsección ${numeroSeccion}`;
    }
    nodo.path = `${prefijoPath}/${nodo.name}`;
    
    if (nodo.children && nodo.children.length > 0) {
      this.asignarNumerosYPaths(nodo.children, numeroSeccion, nodo.path);
    }
  });
}

onClickGuardar() {
  // Actualiza numeroSeccion y path en TODOS los nodos
  this.asignarNumerosYPaths(this.dataArbol);

  // Mapea y guarda
  this.guardarArbol();
  
}

private mapNodoContenidoToDTO(nodo: NodoContenido): NodoContenidoDTO {
  return {
    id: nodo.id,                                     // sigue igual
    name: nodo.name,                                 // sigue igual
    path: nodo.path  ?? '',                          // ya lo tenías
    numeroSeccion: nodo.numeroSeccion ?? '',         // ← ¡agregado!
    contenidoTexto: nodo.contenidoTexto ?? '',       // sigue igual
    children: nodo.children
      ? nodo.children.map(child => this.mapNodoContenidoToDTO(child))
      : []
  };
}

guardarArbol() {
  const arbolDTO: NodoContenidoDTO[] =
    this.dataArbol.map(nodo => this.mapNodoContenidoToDTO(nodo));
    console.log('Árbol a guardar:', arbolDTO);
  arbolDTO.forEach(nodoDTO => {
    this.nodoContenidoService.guardarNodo(nodoDTO).subscribe({
      next: respuesta => console.log('Nodo guardado correctamente', respuesta),
      error: error => console.error('Error al guardar el nodo', error)
    });
  });
}

}



//**************************************************

/* import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeModule } from '@angular/material/tree';
import { QuillModule } from 'ngx-quill';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditorComponent } from '../editor/editor.component';
import { NodoContenidoDTO, NodoContenidoService } from '../nodo-contenido.service';

  export interface NodoContenido {
    id?: number;
    name: string;
    children?: NodoContenido[];
    path?: string;
    contenidoTexto?: string;
    numeroSeccion?: string;
  }

interface NodoPlano {
  expandable: boolean;
  name: string;
  level: number;
  path: string;
  numeroSeccion?: string;
}

@Component({
  selector: 'app-contenido2',
  templateUrl: './contenido2.component.html',
  styleUrls: ['./contenido2.component.css'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatIconModule,
    QuillModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatTreeModule
    
  ]
})
export class Contenido2Component implements OnInit {


//********************************

  formSeccion!: FormGroup;
  dataArbol: NodoContenido[] = [];
  formNodosMap: Map<NodoContenido, FormGroup> = new Map();
  
  constructor(
    private dialogRef: MatDialogRef<Contenido2Component>,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private nodoContenidoService: NodoContenidoService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dataSource.data = this.dataArbol;
  }

  treeControl = new FlatTreeControl<NodoPlano>(
    node => node.level,
    node => node.expandable
  );

  transformador = (node: NodoContenido, level: number): NodoPlano => ({
    name: node.name,
    level,
    expandable: !!node.children && node.children.length > 0,
    path: this.getRuta(node),
    numeroSeccion: node.numeroSeccion  // si quieres mostrarlo en el template
  });

  treeFlattener = new MatTreeFlattener(
    this.transformador,
    node => node.level,
    node => node.expandable,
    node => node.children
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  hasChild = (_: number, node: NodoPlano) => node.expandable;

  //gOnInit(): void {
    //this.formSeccion = this.fb.group({
      //nombreCurso: [this.data.curso.nombre, Validators.required],
      //secciones: this.fb.array([])
    //});
    //this.dataSource.data = this.dataArbol;
    //this.agregarSeccion(); // Primera sección por defecto
    //this.actualizarDataSource();
    
  //}

  ngOnInit(): void {
    this.formSeccion = this.fb.group({
      nombreCurso: [this.data.curso.nombre, Validators.required],
      secciones: this.fb.array([])
    });
  
    this.nodoContenidoService.obtenerNodosRaiz().subscribe({
      next: (raices: NodoContenido[]) => {
        // Solo asignamos si se reciben datos válidos
        if (raices && raices.length > 0) {
          this.dataArbol = raices.sort((a, b) =>
            a.numeroSeccion!.localeCompare(b.numeroSeccion!, undefined, { numeric: true })
          );
        } else {
          // Si no hay datos, agregamos una nueva sección por defecto
          this.agregarSeccion(); 
        }
  
        // Sincroniza formularios y UI
        this.actualizarFormularios();
        this.actualizarNumerosSeccion(this.dataArbol);
        this.actualizarDataSource();
  
        console.log('Árbol cargado desde BD:');
        this.imprimirArbol(this.dataArbol);
      },
      error: (err) => {
        console.error('Error cargando árboles desde BD', err);
  
        // En caso de error, también inicializamos con una sección por defecto
        this.dataArbol = [];
        this.agregarSeccion();
  
        this.actualizarFormularios();
        this.actualizarNumerosSeccion(this.dataArbol);
        this.actualizarDataSource();
      }
    });
  }

  actualizarDataSource(): void {
    const inicio = this.paginaActual * this.tamanioPagina;
    const dataPaginada = this.dataArbol.slice(inicio, inicio + this.tamanioPagina);
    this.dataSource.data = dataPaginada;
  }
  
  // 1  
  //agregarSeccion(): void {
    //const nuevaSeccion: NodoContenido = {
      //name: `Sección ${this.dataSource.data.length + 1}`,
      //children: [{ name: '1', children: [] }]
    //};
    //this.dataArbol.push(nuevaSeccion);
    //this.actualizarDataSource(); // Aplica paginación y actualiza el tree
    //this.actualizarFormularios(); 
    //console.log("dataArbol");
    //console.log(this.dataArbol); // Verifica la estructura del árbol
    //console.log("Estructura del árbol:");
  //this.imprimirArbol(this.dataArbol); // Aquí imprime todo jerárquicamente
  //} 

  //v12.12
  agregarSeccion(): void {this.actualizarDataSource()
    const nuevaSeccion: NodoContenido = {
      name: `Sección ${this.dataArbol.length + 1}`,
      children: [],
      numeroSeccion: '',
    };
    
    this.dataArbol.push(nuevaSeccion);
    
    this.actualizarData();
    this.actualizarDataSource();
    this.actualizarNumerosSeccion(this.dataArbol);
  }

    //agregarSeccion(): void {this.actualizarDataSource()
      //const nuevaSeccion: NodoContenido = {
        //name: `Sección ${this.dataArbol.length + 1}`,
        //children: [],
        //numeroSeccion: '',
      //};
      
      //this.dataArbol.push(nuevaSeccion);
      
      //this.actualizarData();
      //this.actualizarDataSource();
      //this.actualizarNumerosSeccion(this.dataArbol);
    //}

  // v12.12
  agregarHijo(padre: NodoContenido): void {
    if (!padre.children) {
      padre.children = [];
    }
    const nuevoHijo: NodoContenido = {
      name: `${padre.children.length + 1}`,
      children: [],
      numeroSeccion: `${padre.numeroSeccion}.${padre.children.length + 1}`
    };
    padre.children.push(nuevoHijo);
    this.actualizarData();
    this.actualizarDataSource();
    console.log("Estructura del árbol después de agregar hijo:");
    this.imprimirArbol(this.dataArbol);
  }
  
  // v12.12
  actualizarNumerosSeccion(nodos: NodoContenido[], prefijo: string = ''): void {
    nodos.forEach((nodo, index) => {
      const numeroActual = prefijo ? `${prefijo}.${index + 1}` : `${index + 1}`;
      nodo.numeroSeccion = numeroActual;

      const form = this.formNodosMap.get(nodo);
      if (form) {
        form.get('numeroSeccion')?.setValue(numeroActual, { emitEvent: false });
      }

      if (nodo.children && nodo.children.length > 0) {
        this.actualizarNumerosSeccion(nodo.children, numeroActual);
      }
    });
  }
  
   
  agregarRaiz(): void {
    const nuevoIndice = this.dataArbol.length + 1;
  
    const nuevoNodo: NodoContenido = {
      name: `Sección ${nuevoIndice}`,
      numeroSeccion: `${nuevoIndice}`,
      children: []
    };
  
    this.dataArbol.push(nuevoNodo);
    this.actualizarData();
  }

  // v12.12
  eliminarUltimaSeccion(): void {
  if (this.dataArbol.length > 0) {
    const nodoEliminado = this.dataArbol.pop(); // Elimina la última sección raíz

    // Elimina el form asociado si existe
    if (nodoEliminado) {
      this.formNodosMap.delete(nodoEliminado);
    }

    // Recalcula la estructura y la numeración
    this.actualizarData();
    this.actualizarDataSource();
    this.actualizarNumerosSeccion(this.dataArbol);

    // Si la página actual ya no tiene datos, retroceder una página si es posible
    const totalPaginas = this.totalPaginas;
    if (this.paginaActual >= totalPaginas && this.paginaActual > 0) {
      this.paginaActual--;
    }

    // Refresca los datos mostrados
    this.actualizarData();
  }
}

//v12.12
// eliminarNodo(padre: NodoContenido | null, nodoAEliminar: NodoContenido): void {
  //if (!padre) {
    //const index = this.dataArbol.indexOf(nodoAEliminar);
    //if (index > -1) this.dataArbol.splice(index, 1);
  //} else {
    //if (padre.children) {
      //const index = padre.children.indexOf(nodoAEliminar);
      //if (index > -1) padre.children.splice(index, 1);
    //}
  //}

  //this.formNodosMap.delete(nodoAEliminar);

  //const eliminarFormulariosRecursivo = (nodo: NodoContenido) => {
    //if (nodo.children) {
      //for (let hijo of nodo.children) {
        //this.formNodosMap.delete(hijo);
        //eliminarFormulariosRecursivo(hijo);
      //}
    //}
  //};
  //eliminarFormulariosRecursivo(nodoAEliminar);
  //this.actualizarNumerosSeccion(this.dataArbol);
  //this.actualizarData();
  //this.actualizarDataSource();
  //if (this.paginaActual >= this.totalPaginas && this.paginaActual > 0) {
    //this.paginaActual--;
  //}
//} 

  eliminarNodo(padre: NodoContenido | null, nodoAEliminar: NodoContenido): void {
    if (!padre) {
      const index = this.dataArbol.indexOf(nodoAEliminar);
      if (index > -1) this.dataArbol.splice(index, 1);
    } else if (padre.children) {
      const index = padre.children.indexOf(nodoAEliminar);
      if (index > -1) padre.children.splice(index, 1);
    }
  
    const eliminarFormulariosRecursivo = (nodo: NodoContenido) => {
      this.formNodosMap.delete(nodo);
      nodo.children?.forEach(hijo => eliminarFormulariosRecursivo(hijo));
    };
    eliminarFormulariosRecursivo(nodoAEliminar);
  
    this.actualizarNumerosSeccion(this.dataArbol);
    this.actualizarFormularios(); // Asegura que los formularios reflejen la nueva estructura
    this.actualizarDataSource();  // Solo actualiza la vista paginada
  }

//actualizarData(): void {
  //const nodosExpandidos = this.treeControl.expansionModel.selected.map(n => n.name);
  //this.dataSource.data = [...this.dataSource.data];
  //setTimeout(() => {
    //this.treeControl.dataNodes.forEach(nodo => {
      //if (nodosExpandidos.includes(nodo.name)) {
        //this.treeControl.expand(nodo);
      //}
    //});
  //});
//}      

//v12.12
  actualizarData(): void {
    // Guardar los nombres o IDs de los nodos expandidos
    const nodosExpandidos = this.treeControl.expansionModel.selected.map(n => n.name);
  
    // Actualizar datos
    this.actualizarNumerosSeccion(this.dataArbol);
    this.dataSource.data = [...this.dataArbol];
  
    // Restaurar expansión en el próximo ciclo de detección de cambios
    setTimeout(() => {
      this.treeControl.dataNodes.forEach(nodo => {
        if (nodosExpandidos.includes(nodo.name)) {
          this.treeControl.expand(nodo);
        }
      });
    });
  
    // Corregir página si es necesario
    if (this.paginaActual >= this.totalPaginas && this.paginaActual > 0) {
      this.paginaActual--;
    }
  }
    
  //getParent(nodeBuscado: NodoContenido, nodos: NodoContenido[] = this.dataSource.data, padre: NodoContenido | null = null): NodoContenido | null {
    getParent(nodeBuscado: NodoContenido, nodos: NodoContenido[] = this.dataArbol, padre: NodoContenido | null = null): NodoContenido | null {
    for (let nodo of nodos) {
      if (nodo === nodeBuscado) return padre;
      if (nodo.children) {
        const resultado = this.getParent(nodeBuscado, nodo.children, nodo);
        if (resultado) return resultado;
      }
    }
    return null;
  }

  getNodoDesdePlano(nodoPlano: NodoPlano): NodoContenido {
    const encontrarNodo = (nodos: NodoContenido[]): NodoContenido | null => {
      for (let nodo of nodos) {
        if (this.getRuta(nodo) === nodoPlano.path) return nodo;
        if (nodo.children) {
          const resultado = encontrarNodo(nodo.children);
          if (resultado) return resultado;
        }
      }
      return null;
    };

    //const nodoEncontrado = encontrarNodo(this.dataSource.data);
    const nodoEncontrado = encontrarNodo(this.dataArbol);
    if (!nodoEncontrado) {
      throw new Error(`No se encontró el nodo para la ruta: ${nodoPlano.path}`);
    }
    return nodoEncontrado;
  }

  getRuta(nodo: NodoContenido, nodos: NodoContenido[] = this.dataArbol): string {
    const ruta: string[] = [];
    const encontrarRuta = (n: NodoContenido[], camino: string[]): boolean => {
      for (let i = 0; i < n.length; i++) {
        const actual = n[i];
        const nuevaRuta = [...camino, `${i + 1}`];
        if (actual === nodo) {
          ruta.push(...nuevaRuta);
          return true;
        }
        if (actual.children && encontrarRuta(actual.children, nuevaRuta)) {
          return true;
        }
      }
      return false;
    };
    encontrarRuta(nodos, []);
    return ruta.join('.');
  }

  //getFormGroup(nodo: NodoContenido): FormGroup {
    //if (!this.formNodosMap.has(nodo)) {
      //const path = this.getRuta(nodo);
      //const fg = this.fb.group({
        //numeroSeccion: [path, Validators.required],
        //nombreSeccion: [`Sección ${path}`, Validators.required],
        //no nombreSeccion: ['', Validators.required],
        //contenidoTexto: [nodo.contenidoTexto || ''] // Inicializa con contenido HTML vacío si no existe

      //});
      //this.formNodosMap.set(nodo, fg);
    //}
    //return this.formNodosMap.get(nodo)!;
  //} 

  // v12.12
  getFormGroup(nodo: NodoContenido): FormGroup {
    if (!this.formNodosMap.has(nodo)) {
      const path = this.getRuta(nodo);
      const formGroup = this.fb.group({
        name: [nodo.name],
        contenidoTexto: [nodo.contenidoTexto || ''],
        numeroSeccion: [nodo.numeroSeccion || path]
      });
      this.formNodosMap.set(nodo, formGroup);
    }
    return this.formNodosMap.get(nodo)!;
  }

   //actualizarFormularios(): void {
    //const recorrerNodos = (nodos: NodoContenido[]) => {
      //nodos.forEach(nodo => {
        //const path = this.getRuta(nodo);
        // no const nombre = nodo.name || ''; // Utiliza el nombre existente o una cadena vacía
        //if (this.formNodosMap.has(nodo)) {
          //const form = this.formNodosMap.get(nodo)!;
          //form.patchValue({
            //numeroSeccion: '',//path,
            // no nombreSeccion: nombre
            //nombreSeccion: `Sección ${path}`
          //});
        //} else {
          //const form = this.fb.group({
            //numeroSeccion: [path, Validators.required],
            //no nombreSeccion: [nombre, Validators.required]
            //nombreSeccion: [`Sección ${path}`, Validators.required]
          //});
          //this.formNodosMap.set(nodo, form);
        //}
        //if (nodo.children) {
          //recorrerNodos(nodo.children);
        //}
      //});
    //};
    //recorrerNodos(this.dataArbol);
  //} 

  // v12.12
  actualizarFormularios(): void {
    const recorrer = (nodos: NodoContenido[]) => {
      nodos.forEach(n => {
        this.getFormGroup(n); // crea y mapea el formulario
        if (n.children) recorrer(n.children);
      });
    };
    recorrer(this.dataArbol);
  }

  contadorGlobal = 0; // <- contador para todos los nodos

        //imprimirArbol(data: NodoContenido[], nivel: string = ''): void {
          //data.forEach((nodo, index) => {
            //const numeroSeccion = nivel ? `${nivel}.${index + 1}` : `${index + 1}`;
            //const form = this.getFormGroup(nodo); 
            //const nombreActualizado = form?.get('nombreSeccion')?.value || nodo.name;
            //console.log(`numero de seccion: ${numeroSeccion} nombre de seccion: ${nombreActualizado}`);
            
            //if (nodo.children && nodo.children.length > 0) {
              //this.imprimirArbol(nodo.children, numeroSeccion);
            //}
          //});
        //}
  
          // v12.12
          imprimirArbol(nodos: NodoContenido[], nivel: number = 0): void {
            nodos.forEach(n => {
              const indentacion = ' '.repeat(nivel * 2);
              console.log(`${indentacion}${n.numeroSeccion} - ${n.name}`);
              if (n.children) {
                this.imprimirArbol(n.children, nivel + 1);
              }
            });
          }

  onSubmit(): void {
    if (this.formSeccion.valid) {
      console.log('Formulario enviado:', this.formSeccion.value);
      this.dialogRef.close(this.formSeccion.value);
    } else {
      console.log('Formulario inválido. Revisa los campos.');
    }
  }

  
  
paginaActual = 0;
tamanioPagina = 1;

get totalPaginas() {
  return Math.ceil(this.dataArbol.length / this.tamanioPagina);
}

paginaAnterior() {
  if (this.paginaActual > 0){
    this.paginaActual--;
    this.actualizarDataSource();
  }
    
}

paginaSiguiente() {
  if (this.paginaActual < this.totalPaginas - 1) 
    {
      this.paginaActual++;
      this.actualizarDataSource();
    }
}


  

abrirEditor(nodo: NodoContenido) {
  const dialogRef = this.dialog.open(EditorComponent, {
    width: '800px',
    data: { nodo } // o solo contenidoTexto, según necesites
  });

  dialogRef.afterClosed().subscribe((resultado: any) => {
    if (resultado) {
      nodo.name = resultado.titulo;
      nodo.contenidoTexto = resultado.contenidoHTML;
      console.log('nodo.name:', nodo.name);
      console.log('nodo.contenidoTexto:', nodo.contenidoTexto);
      // Actualizar el formulario asociado al nodo
      const form = this.getFormGroup(nodo);
      form.patchValue({
        nombreSeccion: resultado.titulo,
        contenidoTexto: resultado.contenidoHTML
      });

      // Actualizar la visualización del árbol
      this.actualizarData();
    }
  });
}

  
    
    
    generarNumeroSeccion(nivel: string): string {
      return nivel ? `${nivel}.${this.contadorGlobal}` : `${this.contadorGlobal}`;
    }

  private mapNodoContenidoToDTO(nodo: NodoContenido): NodoContenidoDTO {
    return {
      id: nodo.id,                                     // sigue igual
      name: nodo.name,                                 // sigue igual
      path: nodo.path  ?? '',                          // ya lo tenías
      numeroSeccion: nodo.numeroSeccion ?? '',         // ← ¡agregado!
      contenidoTexto: nodo.contenidoTexto ?? '',       // sigue igual
      children: nodo.children
        ? nodo.children.map(child => this.mapNodoContenidoToDTO(child))
        : []
    };
  }

  onClickGuardar() {
    // Actualiza numeroSeccion y path en TODOS los nodos
    this.asignarNumerosYPaths(this.dataArbol);

    // Mapea y guarda
    this.guardarArbol();
  }

  guardarArbol() {
    const arbolDTO: NodoContenidoDTO[] =
      this.dataArbol.map(nodo => this.mapNodoContenidoToDTO(nodo));
      console.log('Árbol a guardar:', arbolDTO);
    arbolDTO.forEach(nodoDTO => {
      this.nodoContenidoService.guardarNodo(nodoDTO).subscribe({
        next: respuesta => console.log('Nodo guardado correctamente', respuesta),
        error: error => console.error('Error al guardar el nodo', error)
      });
    });
  }
    // u  
    asignarNumerosYPaths(
      nodos: NodoContenido[],
      prefijoNumero: string = '',
      prefijoPath: string = ''
    ): void {
      nodos.forEach((nodo, index) => {
        const numeroSeccion = prefijoNumero 
          ? `${prefijoNumero}.${index + 1}` 
          : `${index + 1}`;
        nodo.numeroSeccion = numeroSeccion;
        // Solo asignar nombre automático si no ha sido modificado manualmente
        if (!nodo.name || nodo.name.startsWith('Sección')) {
          nodo.name = `Sección ${numeroSeccion}`;
        }
        nodo.path = `${prefijoPath}/${nodo.name}`;
        if (nodo.children && nodo.children.length > 0) {
          this.asignarNumerosYPaths(nodo.children, numeroSeccion, nodo.path);
        }
      });
    }
}   */