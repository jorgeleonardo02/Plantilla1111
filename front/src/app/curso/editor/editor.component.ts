/* import { Component } from '@angular/core';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css'
})
export class EditorComponent {

}
 */
/* import { Component, ElementRef, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { QuillEditorComponent } from 'ngx-quill';
import pdfMake from 'pdfmake/build/pdfmake';
import { pdfFonts } from '../../pdf-fonts';  // Importa las fuentes base64
import Quill from 'quill';
import { Seccion } from 'src/app/seccion/seccion';
import { SeccionService } from 'src/app/seccion/seccion.service';
import { CursoService } from '../curso.service';
import { TokenService } from 'src/app/seguridad/service/token.service';
import { UsuarioDto2 } from 'src/app/usuario/usuario-dto2';
import { Curso } from '../curso';
import { catchError, EMPTY, of, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { SubSeccionService } from 'src/app/subseccion/sub-seccion.service';

// Asigna las fuentes personalizadas al sistema vfs de pdfMake
pdfMake.vfs = pdfFonts;

// Registra las fuentes en pdfMake
pdfMake.fonts = {
  Roboto: {
    normal: 'Roboto-Regular.ttf',  // Asegúrate de que coincida con el nombre en pdf-fonts.ts
    bold: 'Roboto-Bold.ttf',  // Fuente en negrita
    italics: 'Roboto-Italic.ttf',  // Fuente en cursiva
    bolditalics: 'Roboto-BoldItalic.ttf'  // Fuente en negrita cursiva (si la tienes)
  },
  CourierPrime: {
    normal: 'CourierPrime-Regular.ttf',
    bold: 'CourierPrime-Bold.ttf',  // Fuente en negrita
    italics: 'CourierPrime-Italic.ttf',  // Fuente en cursiva
    bolditalics: 'CourierPrime-BoldItalic.ttf'  // Fuente en negrita cursiva (si la tienes)
  },
  LiberationSerif: {
    normal: 'LiberationSerif-Regular.ttf',
    bold: 'LiberationSerif-Bold.ttf',  // Fuente en negrita
    italics: 'LiberationSerif-Italic.ttf',  // Fuente en cursiva
    bolditalics: 'LiberationSerif-BoldItalic.ttf'  // Fuente en negrita cursiva (si la tienes)
  
  }
};


@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css'
})
export class EditorComponent implements OnInit, AfterViewInit {
  @ViewChild('contenidoPDF', { static: false }) contenidoPDF!: ElementRef;
  @ViewChild('editor', { static: false }) quillEditorComponent!: QuillEditorComponent;
  htmlContent: any;
  quillInitialized = false;

  readonly modulesQuill = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ font: [] }],
      [{ color: [] }, { background: [] }],
      [{ size: ['small', false, 'large', 'huge'] }],
      [{ align: [] }],
      ['blockquote', 'code-block'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image', 'video'],
      ['clean'],
    ]
  };

  blog = {
    titulo: 'Contenido del Curso',
    descripcion: 'Esta es mi descripción'
  };

  seccionForm: FormGroup; // Formulario principal
  editorForm: FormGroup; 
  cursos: Curso[] = []; // Lista de cursos disponibles
  usuario: UsuarioDto2 | null = null; // Usuario actual
  usuaio: UsuarioDto2;
  myForm: FormGroup;
  cursoForm: FormGroup;
  secciones: Seccion[] = []; // Cambiado a un arreglo
  metas: string[] = []; // Arreglo para almacenar las metas
  nuevaMeta: string = ''; // Variable para el input
  seccion: Seccion;

  constructor(
    private fb: FormBuilder,
    private seccionService: SeccionService,
    private subSeccionService: SubSeccionService,
    private cursoService: CursoService,
    private tokenService: TokenService,
    private router: Router
  ) {
    this.cursoForm = this.fb.group({
      opcionSeleccionada: [null, Validators.required],
      numeroSeccion: [0, Validators.required],
      nombreSeccion: ['', Validators.required],
      numeroSubSeccion: [0, Validators.required],
      nombreSubSeccion: ['', Validators.required],
    });
  
    this.editorForm = this.fb.group({
      titulo: ['', Validators.required],
      editorContent: ['', Validators.required],
    });
   
  }

  agregarMeta(): void {
    if (this.nuevaMeta.trim() !== '') {
      this.metas.push(this.nuevaMeta.trim());
      this.nuevaMeta = ''; // Limpiar el campo de entrada
    }
  }  
 
ngAfterViewInit() {
      const maxRetries = 10; // Máximo número de intentos
      let retryCount = 0;
    
      const checkQuillEditorAvailability = () => {
        if (this.quillEditorComponent && this.quillEditorComponent.quillEditor) {
          this.quillInitialized = true;
          console.log('El ViewChild quillEditor está disponible en AfterViewInit.');
        } else if (retryCount < maxRetries) {
          retryCount++;
          console.warn(`Intento ${retryCount}: El ViewChild quillEditor no está disponible todavía.`);
          setTimeout(checkQuillEditorAvailability, 500); // Reintentar
        } else {
          console.error('El ViewChild quillEditor no se cargó después de varios intentos.');
        }
      };
      checkQuillEditorAvailability();
    }
    ngOnInit(): void {
      this.tokenService
        .usuarioActual()
        .pipe(
          switchMap((usuario: UsuarioDto2 | null) => {
            if (!usuario) {
              console.warn("Usuario no autenticado. Redirigiendo al login...");
              //this.router.navigate(['/login']);
              return EMPTY;
            }
            this.usuario = usuario;
            return this.cursoService.cursosPorIdUsuario(usuario.id);
          }),
          catchError((error) => {
            console.error("Error al cargar usuario o cursos:", error);
            return of([]);
          })
        )
        .subscribe((cursos: Curso[]) => {
          this.cursos = cursos;
        });
    }
  
    crearSeccion(): void {
      if (this.cursoForm.invalid) {
        console.warn("El formulario no es válido");
        return;
      }
  
      const nuevaSeccion: any = {
        numeroSeccion: this.cursoForm.get('numeroSeccion')?.value,//this.secciones.length + 1,
        nombreSeccion: this.cursoForm.get('nombreSeccion')?.value,
        curso: this.cursoForm.get('opcionSeleccionada')?.value
      };
      console.log("nuevaSeccion");
      console.log(nuevaSeccion);

      
      this.seccionService.agregarElemento(nuevaSeccion).subscribe({
        next: (seccion1) => {
          console.log("seccion");
          console.log(seccion1.elemento);

          const htmlContent = this.editorForm.get('editorContent')?.value; // Formato HTML//this.quillEditor.getContents(); // Delta JSON
          const nuevaSubSeccion: any = {
            numeroSubSeccion: this.cursoForm.get('numeroSubSeccion')?.value,
            nombreSubSeccion: this.cursoForm.get('nombreSubSeccion')?.value,
            seccion: seccion1.elemento,
            curso: JSON.stringify(htmlContent), // Delta como JSON en el campo contenido
          };
          console.log("nuevaSubSeccion");
          console.log(nuevaSubSeccion);
          this.subSeccionService.agregarElemento(nuevaSubSeccion).subscribe({
            next: (subSeccion) => {
              console.log("subSeccion");
              console.log(subSeccion);
            },
            error: (err) => {
              console.error("Error al crear la sección:", err);
            },
          });
          this.secciones.push(seccion1);
          this.cursoForm.reset();
        },
        error: (err) => {
          console.error("Error al crear la sección:", err);
        },
      });

      
    } 
    
    PDF(){
      console.log("PDF");
      this.subSeccionService.listarElementos().subscribe(r=>{
        console.log(r);
      })
    }
    
      guardar(): void {
        if (this.editorForm.invalid) {
          console.warn('Formulario inválido');
          return;
        }
        console.log(this.editorForm.value);
        this.generarPDF();
      }
  
    onEditorCreated(quill: Quill): void {
      quill.on('text-change', () => {
        const delta = quill.getContents();
        console.log('Curso Delta:', delta);
      });
    }
  
  editor: Quill;
  Eventos(evento: any) {
      // Obtén el contenido del editor en diferentes formatos
  const htmlContent = this.editorForm.get('editorContent')?.value; // Formato HTML
  //const deltaContent = this.editor.getContents(); // Formato Delta JSON
  //const plainText = this.editor.root.innerText; // Solo texto plano

  console.log('Curso HTML:', htmlContent);
  //console.log('Contenido Delta JSON:', deltaContent);
  //console.log('Texto Plano:', plainText);
    console.log("evento");
    console.log(evento);
    if (evento && evento.html) {
      this.htmlContent = evento.html;
      console.log('this.htmlContent 2222:', this.htmlContent);
    }
  }

  generarPDF() {
    if (!this.quillInitialized || !this.quillEditorComponent) {
      console.error('El editor Quill no se ha inicializado.');
      return;
    }

    const delta = this.quillEditorComponent.quillEditor.getContents();
    const pdfContent = this.convertirDeltaAPdfmake(delta);
    console.log("Contenido convertido a PDFMake:");
    console.log(pdfContent);

    const docDefinition = {
      content: pdfContent,
      defaultStyle: {
        font: 'Roboto'  // Usa 'Roboto' como fuente predeterminada
      }
    };

    // Generar y descargar el PDF
    pdfMake.createPdf(docDefinition).download('contenido.pdf');
  }

    convertirDeltaAPdfmake(delta: any) {
      const pdfContent: any[] = [];
      let paragraph: any[] = [];
    
      delta.ops.forEach((op: any, index: number) => {
        if (typeof op.insert === 'string') {
          // Procesar texto y estilos
          const text = op.insert;
          const lines = text.split('\n');
    
          lines.forEach((line: string, idx: number) => {
            if (line.trim() !== '') {
              const textObj: any = { text: line };
    
              // Aplicar atributos de texto
              if (op.attributes) {
                if (op.attributes.bold) textObj.bold = true;
                if (op.attributes.italic) textObj.italics = true;
                if (op.attributes.underline) textObj.decoration = 'underline';
                if (op.attributes.color) textObj.color = op.attributes.color;
                if (op.attributes.background) textObj.background = op.attributes.background;
                if (op.attributes.size) textObj.fontSize = this.convertirTamaño(op.attributes.size);
                if (op.attributes.font) textObj.font = this.convertirFuente(op.attributes.font);
              }
    
              paragraph.push(textObj);
            }
    
            // Procesar salto de línea o fin del bloque de texto
            if (idx < lines.length - 1 || text.endsWith('\n')) {
              if (paragraph.length > 0) {
                const paragraphBlock: any = { text: paragraph };
                if (op.attributes?.align) {
                  paragraphBlock.alignment = this.convertirAlineacion(op.attributes.align);
                }
                pdfContent.push(paragraphBlock);
                paragraph = [];
              }
    
              // Añadir un espacio vacío para cada salto de línea adicional
              pdfContent.push({ text: '', margin: [0, 5] }); // Ajusta el margen según el espacio deseado entre líneas
            }
          });
        } else if (op.insert && op.insert.image) {
          // Procesar imagen y alineación
          const imageObj: any = {
            image: op.insert.image,
            width: 200 // Ajusta el tamaño según lo necesites
          };
    
          // Verificar si el próximo bloque tiene alineación especificada
          const nextOp = delta.ops[index + 1];
          if (nextOp && nextOp.attributes && nextOp.attributes.align) {
            imageObj.alignment = this.convertirAlineacion(nextOp.attributes.align);
          } else {
            imageObj.alignment = 'left'; // Valor por defecto si no hay alineación especificada
          }
          pdfContent.push(imageObj);
        }
      });
    
      // Agregar el último párrafo en caso de que haya contenido restante
      if (paragraph.length > 0) {
        pdfContent.push({ text: paragraph });
      }
      return pdfContent;
    }
    
          
  convertirTamaño(size: string) {
    switch (size) {
      case 'small':
        return 10;
      case 'large':
        return 18;
      case 'huge':
        return 24;
      default:
        return 12;
    }
  }

  convertirFuente(font: string) {
    switch (font) {
      case 'serif':
        return 'LiberationSerif';  // Hace referencia al nombre registrado en pdfMake.fonts
      case 'monospace':
        return 'CourierPrime';  // Hace referencia al nombre registrado en pdfMake.fonts
      case 'sans-serif':
      default:
        return 'Roboto';  // Hace referencia al nombre registrado en pdfMake.fonts
    }
  }

  convertirAlineacion(align: string) {
    switch (align) {
      case 'center':
        return 'center';
      case 'right':
        return 'right';
      case 'justify':
        return 'justify';
      default:
        return 'left'; 
    }
  }  
}
 */
/* // bien
import { Component, ElementRef, ViewChild, AfterViewInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { QuillEditorComponent, QuillModule } from 'ngx-quill';
import pdfMake from 'pdfmake/build/pdfmake';
import { pdfFonts } from '../../pdf-fonts';  
import Quill from 'quill';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NodoContenido } from '../contenido2/contenido2.component';

pdfMake.vfs = pdfFonts;
pdfMake.fonts = {
  Roboto: {
    normal: 'Roboto-Regular.ttf',
    bold: 'Roboto-Bold.ttf',
    italics: 'Roboto-Italic.ttf',
    bolditalics: 'Roboto-BoldItalic.ttf'
  },
  CourierPrime: {
    normal: 'CourierPrime-Regular.ttf',
    bold: 'CourierPrime-Bold.ttf',
    italics: 'CourierPrime-Italic.ttf',
    bolditalics: 'CourierPrime-BoldItalic.ttf'
  },
  LiberationSerif: {
    normal: 'LiberationSerif-Regular.ttf',
    bold: 'LiberationSerif-Bold.ttf',
    italics: 'LiberationSerif-Italic.ttf',
    bolditalics: 'LiberationSerif-BoldItalic.ttf'
  }
};

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [QuillModule, ReactiveFormsModule],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css'
})
export class EditorComponent implements AfterViewInit {
  @ViewChild('contenidoPDF', { static: false }) contenidoPDF!: ElementRef;
  @ViewChild('editor', { static: false }) quillEditorComponent!: QuillEditorComponent;

  htmlContent: any;
  quillInitialized = false;

  editorForm: FormGroup;

  readonly modulesQuill = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ font: [] }],
      [{ color: [] }, { background: [] }],
      [{ size: ['small', false, 'large', 'huge'] }],
      [{ align: [] }],
      ['blockquote', 'code-block'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image', 'video'],
      ['clean'],
    ]
  };

  constructor(private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditorComponent>,// Inyecta el dialogRef para cerrar el diálogo
    @Inject(MAT_DIALOG_DATA) public data: { nodo: NodoContenido }) { // Inyecta los datos del diálogo y data es el nodo
  
    console.log("data");
    console.log(data);
    const nombre = data.nodo.name || '';
  const contenido = data.nodo.contenidoTexto || '';

  this.editorForm = this.fb.group({
    titulo: [nombre, Validators.required],
    editorContent: [contenido, Validators.required],
  });
  }

  

  ngAfterViewInit() {
    const maxRetries = 10;
    let retryCount = 0;
    const checkQuillEditorAvailability = () => {
      if (this.quillEditorComponent?.quillEditor) {
        this.quillInitialized = true;
        console.log('Editor Quill disponible');
      } else if (retryCount < maxRetries) {
        retryCount++;
        setTimeout(checkQuillEditorAvailability, 500);
      } else {
        console.error('Editor Quill no se cargó');
      }
    };
    checkQuillEditorAvailability();
  }

  guardar(): void {
    if (this.editorForm.invalid) {
      console.warn('Formulario inválido');
      return;
    }
    this.dialogRef.close({
      titulo: this.editorForm.value.titulo,
      contenidoHTML: this.editorForm.value.editorContent
    });
    this.generarPDF();
  }

    quillInstance!: Quill;
    onEditorCreated(quill: Quill) {
      this.quillInstance = quill;
    }

  Eventos(evento: any) {
    if (evento?.html) {
      this.htmlContent = evento.html;
      //console.log('HTML actualizado:', this.htmlContent);
    }
  }

  generarPDF() {
    if (!this.quillInitialized || !this.quillEditorComponent) {
      console.error('El editor Quill no se ha inicializado.');
      return;
    }

    const delta = this.quillEditorComponent.quillEditor.getContents();
    const pdfContent = this.convertirDeltaAPdfmake(delta);

    const docDefinition = {
      content: pdfContent,
      defaultStyle: { font: 'Roboto' }
    };

    pdfMake.createPdf(docDefinition).download('contenido.pdf');
  }

  convertirDeltaAPdfmake(delta: any) {
    const pdfContent: any[] = [];
    let paragraph: any[] = [];
  
    delta.ops.forEach((op: any, index: number) => {
      if (typeof op.insert === 'string') {
        // Procesar texto y estilos
        const text = op.insert;
        const lines = text.split('\n');
  
        lines.forEach((line: string, idx: number) => {
          if (line.trim() !== '') {
            const textObj: any = { text: line };
  
            // Aplicar atributos de texto
            if (op.attributes) {
              if (op.attributes.bold) textObj.bold = true;
              if (op.attributes.italic) textObj.italics = true;
              if (op.attributes.underline) textObj.decoration = 'underline';
              if (op.attributes.color) textObj.color = op.attributes.color;
              if (op.attributes.background) textObj.background = op.attributes.background;
              if (op.attributes.size) textObj.fontSize = this.convertirTamaño(op.attributes.size);
              if (op.attributes.font) textObj.font = this.convertirFuente(op.attributes.font);
            }
  
            paragraph.push(textObj);
          }
  
          // Procesar salto de línea o fin del bloque de texto
          if (idx < lines.length - 1 || text.endsWith('\n')) {
            if (paragraph.length > 0) {
              const paragraphBlock: any = { text: paragraph };
              if (op.attributes?.align) {
                paragraphBlock.alignment = this.convertirAlineacion(op.attributes.align);
              }
              pdfContent.push(paragraphBlock);
              paragraph = [];
            }
  
            // Añadir un espacio vacío para cada salto de línea adicional
            pdfContent.push({ text: '', margin: [0, 5] }); // Ajusta el margen según el espacio deseado entre líneas
          }
        });
      } else if (op.insert && op.insert.image) {
        // Procesar imagen y alineación
        const imageObj: any = {
          image: op.insert.image,
          width: 200 // Ajusta el tamaño según lo necesites
        };
  
        // Verificar si el próximo bloque tiene alineación especificada
        const nextOp = delta.ops[index + 1];
        if (nextOp && nextOp.attributes && nextOp.attributes.align) {
          imageObj.alignment = this.convertirAlineacion(nextOp.attributes.align);
        } else {
          imageObj.alignment = 'left'; // Valor por defecto si no hay alineación especificada
        }
        pdfContent.push(imageObj);
      }
    });
  
    // Agregar el último párrafo en caso de que haya contenido restante
    if (paragraph.length > 0) {
      pdfContent.push({ text: paragraph });
    }
    return pdfContent;
  }
  
  convertirTamaño(size: string): number {
    switch (size) {
      case 'small': return 10;
      case 'large': return 18;
      case 'huge': return 24;
      default: return 12;
    }
  }
  
    convertirFuente(font: string) {
      switch (font) {
        case 'serif': return 'LiberationSerif';  // Hace referencia al nombre registrado en pdfMake.fonts
        case 'monospace': return 'CourierPrime';  // Hace referencia al nombre registrado en pdfMake.fonts
        case 'sans-serif':
        default: return 'Roboto';  // Hace referencia al nombre registrado en pdfMake.fonts
      }
    }

    convertirAlineacion(align: string) {
      switch (align) {
        case 'center': return 'center';
        case 'right': return 'right';
        case 'justify': return 'justify';
        default: return 'left'; 
      }
    }  
  
} */


//----------------------------------------------------------------------------------------------------------

import { Component, OnInit, ViewChild, AfterViewInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { QuillEditorComponent, QuillModule } from 'ngx-quill';
import Quill from 'quill';
import { PdfGeneratorService } from 'src/app/core/services/pdf-generator.service';
import { NodoContenido } from '../contenido2/contenido2.component';


@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    QuillModule
  ],
  standalone: true,
  styleUrls: ['./editor.component.css'],
})
export class EditorComponent implements OnInit {

  editorForm!: FormGroup;
  @ViewChild('quillEditor', { static: false }) quillEditorComponent!: QuillEditorComponent;  
  private quillInstance!: Quill;
  htmlContent: any;
  readonly modulesQuill = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ font: [] }],
      [{ color: [] }, { background: [] }],
      [{ size: ['small', false, 'large', 'huge'] }],
      [{ align: [] }],
      ['blockquote', 'code-block'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image', 'video'],
      ['clean'],
    ]
  };
  blog = {
    titulo: 'Contenido del Curso',
    descripcion: 'Esta es mi descripción'
  };
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { nodo: NodoContenido },
    private pdfService: PdfGeneratorService
  ) {}
  ngOnInit(): void {
    console.log("data");
    console.log(this.data);
    const nombre = this.data.nodo.name || '';
    const contenido = this.data.nodo.contenidoTexto || '';
    this.editorForm = this.fb.group({
      titulo: [nombre, Validators.required],
      editorContent: [contenido, Validators.required],
    });
  }
  guardar(): void {
    if (this.editorForm.invalid) {
      console.warn('Formulario inválido');
      return;
    }
    this.dialogRef.close({
      titulo: this.editorForm.value.titulo,
      contenidoHTML: this.editorForm.value.editorContent
    });
    // Si quieres generar PDF automáticamente al guardar, descomenta esto:
    this.generarPDF();
  }
  onEditorCreated(quill: Quill) {
    this.quillInstance = quill;
  }
  Eventos(evento: any) {
    if (evento?.html) {
      this.htmlContent = evento.html;
      //console.log('HTML actualizado:', this.htmlContent);
    }
  }
  generarPDF(): void {
    if (this.quillInstance) {
      const delta = this.quillInstance.getContents();
      console.log('Delta:', delta);
      // Si lo estás transformando a HTML:
      const html = this.quillInstance.root.innerHTML;
      console.log('HTML generado:', html); 
      this.pdfService.generarPDF(delta);
    }
  }
  /* generarPDF(): void {
    if (this.quillInstance) {
      const html = this.quillInstance.root.innerHTML;
      this.pdfService.generarPDFdesdeHTML(html); // Usa esta nueva función
    }
  } */
}
