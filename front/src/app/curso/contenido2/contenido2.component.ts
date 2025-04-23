/* 1 */
/* import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeModule } from '@angular/material/tree';
import { QuillModule } from 'ngx-quill';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

export interface NodoContenido {
  name: string;
  children?: NodoContenido[];
}

interface NodoPlano {
  expandable: boolean;
  name: string;
  level: number;
  path: string;
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

  constructor(
    private dialogRef: MatDialogRef<Contenido2Component>,
    private fb: FormBuilder,
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
    path: this.getRuta(node)
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

    this.agregarSeccion(); // Primera sección por defecto
  }

  get seccionesFormArray() {
    return this.formSeccion.get('secciones') as FormArray;
  }

  agregarSeccion(): void {
    const nuevaSeccion: NodoContenido = {
      name: `Sección ${this.dataSource.data.length + 1}`,
      children: [{ name: '1', children: [] }]
    };
    this.dataSource.data = [...this.dataSource.data, nuevaSeccion];
  }

  agregarHijo(padre: NodoContenido): void {
    if (!padre.children) padre.children = [];
    padre.children.push({ name: `${padre.children.length + 1}`, children: [] });
    this.actualizarData();
  }

  eliminarNodo(padre: NodoContenido | null, nodo: NodoContenido): void {
    if (padre === null) {
      // Eliminar del nivel raíz
      this.dataSource.data = this.dataSource.data.filter(n => n !== nodo);
  
      // Reindexar nombres de las secciones
      this.dataSource.data.forEach((seccion, index) => {
        seccion.name = `Sección ${index + 1}`;
      });
    } else {
      // Eliminar hijo del padre
      padre.children = padre.children?.filter(n => n !== nodo);
  
      // Reindexar nombres de hijos si deseas también mantener secuencia (opcional)
      padre.children?.forEach((hijo, index) => {
        hijo.name = `${index + 1}`;
      });
    }
  
    this.actualizarData();
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

  getRuta(nodo: NodoContenido, nodos: NodoContenido[] = this.dataSource.data): string {
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
} */


/* ************************************** 2 ******************************************** */
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeModule } from '@angular/material/tree';
import { QuillModule } from 'ngx-quill';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

export interface NodoContenido {
  name: string;
  children?: NodoContenido[];
  path?: string;
  contenidoHtml?: string;
}

interface NodoPlano {
  expandable: boolean;
  name: string;
  level: number;
  path: string;
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
    private fb: FormBuilder,
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
    path: this.getRuta(node)
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
    this.dataSource.data = this.dataArbol;
    this.agregarSeccion(); // Primera sección por defecto
    this.actualizarDataSource();
    
  }

  actualizarDataSource(): void {
    const inicio = this.paginaActual * this.tamanioPagina;
    const dataPaginada = this.dataArbol.slice(inicio, inicio + this.tamanioPagina);
    this.dataSource.data = dataPaginada;
  }
  
  /* 1 */ agregarSeccion(): void {
    const nuevaSeccion: NodoContenido = {
      name: `Sección ${this.dataSource.data.length + 1}`,
      children: [{ name: '1', children: [] }]
    };
    this.dataArbol.push(nuevaSeccion);
    this.actualizarDataSource(); // Aplica paginación y actualiza el tree
    this.actualizarFormularios(); 
  } 
  
  agregarHijo(padre: NodoContenido): void {
    if (!padre.children) padre.children = [];
    padre.children.push({ name: `${padre.children.length + 1}`, children: [] });
    this.actualizarData();
  }

  eliminarUltimaSeccion() {
    if (this.dataArbol.length > 1) {
      this.dataArbol.pop();
       // Si la página actual ya no tiene datos, retroceder una página si es posible
    const totalPaginas = this.totalPaginas;
    if (this.paginaActual >= totalPaginas && this.paginaActual > 0) {
      this.paginaActual--;
    }
      this.actualizarDataSource(); // recarga el árbol con paginación
    }
  }

  /* 1 */eliminarNodo(padre: NodoContenido | null, nodo: NodoContenido): void {
    if (padre === null) {
      // Eliminar del nivel raíz
      this.dataSource.data = this.dataSource.data.filter(n => n !== nodo);
  
      // Reindexar nombres de las secciones
      this.dataSource.data.forEach((seccion, index) => {
        seccion.name = `Sección ${index + 1}`;
      });
    } else {
      // Eliminar hijo del padre
      padre.children = padre.children?.filter(n => n !== nodo);
  
      // Reindexar nombres de hijos si deseas también mantener secuencia (opcional)
      padre.children?.forEach((hijo, index) => {
        hijo.name = `${index + 1}`;
      });
    }
  
    this.actualizarData();
    this.actualizarFormularios(); // Actualiza los formularios después de eliminar un nodo
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
        nombreSeccion: [`Sección ${path}`, Validators.required]
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
      if (this.formNodosMap.has(nodo)) {
        const form = this.formNodosMap.get(nodo)!;
        form.patchValue({
          numeroSeccion: path,
          nombreSeccion: `Sección ${path}`
        });
      } else {
        const form = this.fb.group({
          numeroSeccion: [path, Validators.required],
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
}