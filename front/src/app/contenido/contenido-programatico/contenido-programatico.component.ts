import { Component, ElementRef, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { QuillEditorComponent } from 'ngx-quill';
import pdfMake from 'pdfmake/build/pdfmake';
import { pdfFonts } from '../../pdf-fonts';  // Importa las fuentes base64
import Quill from 'quill';
import { Seccion } from 'src/app/seccion/seccion';
import { SeccionService } from 'src/app/seccion/seccion.service';
import { ContenidoService } from '../contenido.service';
import { TokenService } from 'src/app/seguridad/service/token.service';
import { UsuarioDto2 } from 'src/app/usuario/usuario-dto2';
import { ContenidoUsuarioService } from 'src/app/contenido-usuario/contenido-usuario.service';
import { Contenido } from '../contenido';
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
  selector: 'app-contenido-programatico',
  templateUrl: './contenido-programatico.component.html',
  styleUrls: ['./contenido-programatico.component.css']
})
export class ContenidoProgramaticoComponent implements OnInit, AfterViewInit {
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
    titulo: 'Cualquier cosa',
    descripcion: 'Esta es mi descripción'
  };

  seccionForm: FormGroup; // Formulario principal
  editorForm: FormGroup; 
  contenidos: Contenido[] = []; // Lista de contenidos disponibles
  usuario: UsuarioDto2 | null = null; // Usuario actual
  usuaio: UsuarioDto2;
    //contenidos: Contenido[]=[];
    myForm: FormGroup;
    contenidoForm: FormGroup;
    //seccionForm: FormGroup;
    secciones: Seccion[] = []; // Cambiado a un arreglo

    seccion: Seccion;
  constructor(
    private fb: FormBuilder,
    private seccionService: SeccionService,
    private subSeccionService: SubSeccionService,
    private contenidoService: ContenidoService,
    private tokenService: TokenService,
    private router: Router
  ) {
    this.contenidoForm = this.fb.group({
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
            return this.contenidoService.contenidosPorIdUsuario(usuario.id);
          }),
          catchError((error) => {
            console.error("Error al cargar usuario o contenidos:", error);
            return of([]);
          })
        )
        .subscribe((contenidos: Contenido[]) => {
          this.contenidos = contenidos;
        });
    }
  
    crearSeccion(): void {
      if (this.contenidoForm.invalid) {
        console.warn("El formulario no es válido");
        return;
      }
  
      const nuevaSeccion: any = {
        numeroSeccion: this.contenidoForm.get('numeroSeccion')?.value,//this.secciones.length + 1,
        nombreSeccion: this.contenidoForm.get('nombreSeccion')?.value,
        contenido: this.contenidoForm.get('opcionSeleccionada')?.value
      };
      console.log("nuevaSeccion");
      console.log(nuevaSeccion);

      
      this.seccionService.agregarElemento(nuevaSeccion).subscribe({
        next: (seccion1) => {
          console.log("seccion");
          console.log(seccion1.elemento);

          const htmlContent = this.editorForm.get('editorContent')?.value; // Formato HTML//this.quillEditor.getContents(); // Delta JSON
          const nuevaSubSeccion: any = {
            numeroSubSeccion: this.contenidoForm.get('numeroSubSeccion')?.value,
            nombreSubSeccion: this.contenidoForm.get('nombreSubSeccion')?.value,
            seccion: seccion1.elemento,
            contenido: JSON.stringify(htmlContent), // Delta como JSON en el campo contenido
          };
          console.log("nuevaSubSeccion");
          console.log(nuevaSubSeccion);
          this.subSeccionService.agregarElemento(nuevaSubSeccion).subscribe({
            next: (subSeccion) => {
              console.log("subSeccion");
              console.log(subSeccion);
              //this.secciones.push(seccion);
              //this.contenidoForm.reset();
            },
            error: (err) => {
              console.error("Error al crear la sección:", err);
            },
          });


          this.secciones.push(seccion1);
          this.contenidoForm.reset();
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
        console.log('Contenido Delta:', delta);
      });
    }
  
  editor: Quill;
  Eventos(evento: any) {
      // Obtén el contenido del editor en diferentes formatos
  const htmlContent = this.editorForm.get('editorContent')?.value; // Formato HTML
  //const deltaContent = this.editor.getContents(); // Formato Delta JSON
  //const plainText = this.editor.root.innerText; // Solo texto plano

  console.log('Contenido HTML:', htmlContent);
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

/******************************************************* */
/* 2 */
/* import { Component, ElementRef, ViewChild, Inject, Optional, OnInit, AfterViewInit } from '@angular/core'; // Asegúrate de importar @Optional
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QuillEditorComponent } from 'ngx-quill';
import pdfMake from 'pdfmake/build/pdfmake';
import { pdfFonts } from '../../pdf-fonts';
import { Seccion } from 'src/app/seccion/seccion';
import { ContenidoService } from '../contenido.service';
import { Subseccion } from 'src/app/subseccion/subseccion';
import { ContenidoDialogComponent } from '../contenido-dialog/contenido-dialog.component';

// Asigna las fuentes personalizadas al sistema vfs de pdfMake
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
  selector: 'app-contenido-programatico',
  templateUrl: './contenido-programatico.component.html',
  styleUrls: ['./contenido-programatico.component.css']
})
export class ContenidoProgramaticoComponent implements OnInit, AfterViewInit {
  @ViewChild('contenidoPDF', { static: false }) contenidoPDF!: ElementRef;
  @ViewChild('editor', { static: false }) quillEditorComponent!: QuillEditorComponent;
  quillInitialized = false;
  
  formulario: FormGroup;
  seccionesEliminar = new Array<Seccion>();
  funcionalidad = 'Agregar contenido';
  htmlContent: string = '';

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

  constructor(
    @Optional() public referenciaVentanaModal: MatDialogRef<ContenidoProgramaticoComponent>, // Marca la inyección como opcional
    @Inject(MAT_DIALOG_DATA) @Optional() public idContenido: number,
    private contenidoService: ContenidoService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.formulario = this.formBuilder.group({
      secciones: this.formBuilder.array([])
    });
  }

  ngOnInit(): void {
    this.crearFormulario();
    if (this.idContenido) {
      this.cargarInformacionFormulario();
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.checkQuillEditorAvailability();
    }, 500);
  }

  checkQuillEditorAvailability() {
    if (this.quillEditorComponent && this.quillEditorComponent.quillEditor) {
      this.quillInitialized = true;
    } else {
      console.error('Editor Quill no disponible.');
      setTimeout(() => this.checkQuillEditorAvailability(), 500);
    }
  }

  crearFormulario(): void {
    this.formulario = this.formBuilder.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      secciones: this.formBuilder.array([])
    });
  }

  get obtenerSecciones() {
    return this.formulario.get('secciones') as FormArray;
  }

  crearSeccion(): FormGroup {
    return this.formBuilder.group({
      id: [''],
      nombreSeccion: ['', Validators.required],
      subsecciones: this.formBuilder.array([])
    });
  }

  crearSubSeccion(): FormGroup {
    return this.formBuilder.group({
      id: [''],
      nombreSubSeccion: ['', Validators.required],
      contenidoTexto: ['', Validators.required]
    });
  }

  agregarSeccion(): void {
    this.obtenerSecciones.push(this.crearSeccion());
  }

  agregarSubSeccion(seccionIndex: number): void {
    const subsecciones = this.obtenerSecciones.at(seccionIndex).get('subsecciones') as FormArray;
    subsecciones.push(this.crearSubSeccion());
  }

  cargarInformacionFormulario(): void {
    if (this.idContenido) {
      this.contenidoService.obtenerElementoPorID(this.idContenido).subscribe((resultado) => {
        this.formulario.patchValue(resultado);
        resultado.secciones.forEach((seccion: Seccion) => {
          const seccionFormGroup = this.crearSeccion();
          seccionFormGroup.patchValue(seccion);
          const subsecciones = seccionFormGroup.get('subsecciones') as FormArray;

          seccion.listaSubSeccion.forEach((subseccion: Subseccion) => {
            const subSeccionFormGroup = this.crearSubSeccion();
            subSeccionFormGroup.patchValue(subseccion);
            subsecciones.push(subSeccionFormGroup);
          });

          this.obtenerSecciones.push(seccionFormGroup);
        });
      });
    }
  }

  quitarSeccion(index: number): void {
    this.seccionesEliminar.push(this.obtenerSecciones.at(index).value);
    this.obtenerSecciones.removeAt(index);
  }

  quitarSubSeccion(seccionIndex: number, subSeccionIndex: number): void {
    const subsecciones = this.obtenerSecciones.at(seccionIndex).get('subsecciones') as FormArray;
    subsecciones.removeAt(subSeccionIndex);
  }

  guardar() {
    if (this.formulario.valid) {
      const contenido = this.formulario.value;
      contenido.seccionesEliminar = this.seccionesEliminar;
  
      this.contenidoService.agregarElemento(contenido).subscribe((respuesta) => {
        this.snackBar.open('Contenido guardado exitosamente', 'Cerrar', { duration: 2000 });
        if (this.referenciaVentanaModal) { // Verifica si la referencia está definida antes de usarla
          this.referenciaVentanaModal.close(respuesta);
        }
      });
    } else {
      this.snackBar.open('Debe completar todos los campos.', 'Cerrar', { duration: 2000 });
    }
  }
  
  generarPDF() {
    if (!this.quillInitialized || !this.quillEditorComponent) {
      console.error('Editor Quill no inicializado.');
      return;
    }

    const delta = this.quillEditorComponent.quillEditor.getContents();
    const pdfContent = this.convertirDeltaAPdfmake(delta);

    const docDefinition = {
      content: pdfContent,
      defaultStyle: {
        font: 'Roboto'
      }
    };

    pdfMake.createPdf(docDefinition).download('contenido.pdf');
  }

  convertirDeltaAPdfmake(delta: any) {
    const pdfContent: any[] = [];
    delta.ops.forEach((op: any) => {
      if (typeof op.insert === 'string') {
        const textObj: any = { text: op.insert.trim() };
        if (op.attributes) {
          if (op.attributes.bold) textObj.bold = true;
          if (op.attributes.italic) textObj.italics = true;
          if (op.attributes.color) textObj.color = op.attributes.color;
        }
        pdfContent.push(textObj);
      } else if (op.insert && op.insert.image) {
        pdfContent.push({
          image: op.insert.image,
          width: 200
        });
      }
    });
    return pdfContent;
  }

  get secciones(): FormArray {
    return this.formulario.get('secciones') as FormArray;
  }
  
  getSubsecciones(seccion: AbstractControl): FormArray {
    return seccion.get('subsecciones') as FormArray;
  }

  Eventos(event: any): void {
    // Maneja el cambio de contenido en Quill
  }

  onEditorCreated(editor: any): void {
    // Configura el editor al ser creado
  }

  cancelarOperacion(): void {
    // Lógica para cancelar la operación
  }

  openDialog() {
    this.dialog.open(ContenidoDialogComponent, {
      data: {}
    });
  }
} */


/* 3 */
/* import { Component, ElementRef, ViewChild, Inject, Optional, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QuillEditorComponent } from 'ngx-quill';
import pdfMake from 'pdfmake/build/pdfmake';
import { pdfFonts } from '../../pdf-fonts';
import { Seccion } from 'src/app/seccion/seccion';
import { ContenidoService } from '../contenido.service';
import { Subseccion } from 'src/app/subseccion/subseccion';
// Asignar fuentes personalizadas al sistema de pdfMake
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
  selector: 'app-contenido-programatico',
  templateUrl: './contenido-programatico.component.html',
  styleUrls: ['./contenido-programatico.component.css']
})
export class ContenidoProgramaticoComponent implements OnInit, AfterViewInit {
  @ViewChild('contenidoPDF', { static: false }) contenidoPDF!: ElementRef;
  @ViewChild('editor', { static: false }) quillEditorComponent!: QuillEditorComponent;
  quillInitialized = false;
  formulario: FormGroup;
  seccionesEliminar: Seccion[] = [];
  funcionalidad = 'Agregar contenido';
  htmlContent = '';
  public seccion: any;
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
  currentPage = 0;
  itemsPerPage = 5; // Número de secciones por página
  totalSecciones = 0;
  constructor(
    @Optional() public referenciaVentanaModal: MatDialogRef<ContenidoProgramaticoComponent>,
    @Inject(MAT_DIALOG_DATA) @Optional() public idContenido: number,
    private contenidoService: ContenidoService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.formulario = this.formBuilder.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      secciones: this.formBuilder.array([])
    });
  }
  ngOnInit(): void {
    this.formulario = this.formBuilder.group({
      titulo: ['', Validators.required],
      secciones: this.formBuilder.array([]) // FormArray vacío para las secciones
    });
  }
   obtenerSecciones(): FormArray {
    return this.formulario.get('secciones') as FormArray;
  }
    agregarSeccion(): void {
      const secciones = this.obtenerSecciones();
      secciones.push(this.formBuilder.group({
        nombreSeccion: [''],
        subsecciones: this.formBuilder.array([])
      }));
    }
    agregarSubSeccion(seccionIndex: number): void {
      const subsecciones = this.obtenerSubsecciones(seccionIndex);
      subsecciones.push(this.formBuilder.group({
        nombreSubseccion: [''],
        contenidoSubSeccion: ['']
      }));
    }
  ngAfterViewInit() {
    this.checkQuillEditorAvailability();
  }
  checkQuillEditorAvailability() {
    if (this.quillEditorComponent) {
      if (this.quillEditorComponent.quillEditor) {
        this.quillInitialized = true;
      } else {
        setTimeout(() => this.checkQuillEditorAvailability(), 500);
      }
    } else {
      setTimeout(() => this.checkQuillEditorAvailability(), 500);
    }
  }
  crearFormulario(): void {
    this.formulario = this.formBuilder.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      secciones: this.formBuilder.array([])
    });
  }
  crearSeccion(): FormGroup {
    return this.formBuilder.group({
      id: [''],
      nombreSeccion: ['', Validators.required],
      subsecciones: this.formBuilder.array([])
    });
  }
  crearSubseccion(subseccion: Subseccion | null = null): FormGroup {
    return this.formBuilder.group({
      id: [subseccion?.id || null],
      numeroSubSeccion: [subseccion?.numeroSubSeccion || 0, Validators.required],
      nombreSubseccion: [subseccion?.nombreSubseccion || '', Validators.required],
      contenidoSubSeccion: [subseccion?.contenidoSubSeccion || '', Validators.required]
    });
  }
  cargarInformacionFormulario(): void {
    if (this.idContenido) {
      this.contenidoService.obtenerElementoPorID(this.idContenido).subscribe((resultado) => {
        this.formulario.patchValue(resultado);
        resultado.secciones.forEach((seccion: Seccion) => {
          const seccionFormGroup = this.crearSeccion();
          seccionFormGroup.patchValue(seccion);
          const subsecciones = seccionFormGroup.get('subsecciones') as FormArray;
          seccion.listaSubSeccion.forEach((subseccion: Subseccion) => {
            const subSeccionFormGroup = this.crearSubseccion();
            subSeccionFormGroup.patchValue(subseccion);
            subsecciones.push(subSeccionFormGroup);
          });
          //this.obtenerSecciones.push(seccionFormGroup);
          this.obtenerSecciones().push(seccionFormGroup);
        });
        this.totalSecciones = resultado.secciones.length;
      });
    }
  }
  obtenerSubsecciones(seccionIndex: number): FormArray {
    return this.obtenerSecciones().at(seccionIndex).get('subsecciones') as FormArray;
  }
    quitarSeccion(index: number): void {
      this.obtenerSecciones().removeAt(index);
    }
    quitarSubSeccion(seccionIndex: number, subseccionIndex: number): void {
      this.obtenerSubsecciones(seccionIndex).removeAt(subseccionIndex);
    }
  guardar() {
    if (this.formulario.valid) {
      const contenido = this.formulario.value;
      contenido.seccionesEliminar = this.seccionesEliminar;
      this.contenidoService.agregarElemento(contenido).subscribe((respuesta) => {
        this.snackBar.open('Contenido guardado exitosamente', 'Cerrar', { duration: 2000 });
        if (this.referenciaVentanaModal) {
          this.referenciaVentanaModal.close(respuesta);
        }
      });
    } else {
      this.snackBar.open('Debe completar todos los campos.', 'Cerrar', { duration: 2000 });
    }
  }
  generarPDF() {
    if (!this.quillInitialized || !this.quillEditorComponent) {
      console.error('Editor Quill no inicializado.');
      return;
    }
    const delta = this.quillEditorComponent.quillEditor.getContents();
    const pdfContent = this.convertirDeltaAPdfmake(delta);
    const docDefinition = {
      content: pdfContent,
      defaultStyle: {
        font: 'Roboto'
      }
    };
    pdfMake.createPdf(docDefinition).download('contenido.pdf');
  }
  convertirDeltaAPdfmake(delta: any) {
    const pdfContent: any[] = [];
    delta.ops.forEach((op: any) => {
      if (typeof op.insert === 'string') {
        const textObj: any = { text: op.insert.trim() };
        if (op.attributes) {
          if (op.attributes.bold) textObj.bold = true;
          if (op.attributes.italic) textObj.italics = true;
          if (op.attributes.underline) textObj.underline = true;
          if (op.attributes.font) textObj.font = op.attributes.font;
        }
        pdfContent.push(textObj);
      } else if (op.insert.image) {
        pdfContent.push({ image: op.insert.image, width: 500 });
      }
    });
    return pdfContent;
  }
  get seccionesPaginadas(): FormArray {
    const startIndex = this.currentPage * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const secciones = this.formulario.get('secciones') as FormArray;
    return new FormArray(secciones.controls.slice(startIndex, endIndex));
  }
  public Eventos(event: any): void {
    // Tu lógica aquí
  }
get totalPaginas(): number {
  const secciones = this.formulario?.get('secciones')?.value;
  if (secciones && Array.isArray(secciones)) {
    return Math.ceil(secciones.length / this.itemsPerPage);
  }
  return 0; // Devuelve 0 o un valor predeterminado si `secciones` es nulo o no es un array
}
public paginaAnterior(): void {
  if (this.currentPage > 0) {
    this.currentPage--;
  }
}
public paginaSiguiente(): void {
  if (this.currentPage < this.totalPaginas - 1) {
    this.currentPage++;
  }
}
public onEditorCreated(event: any): void {
  console.log('Editor creado:', event);
}
}
 */
/* 4 */
/* import { Component, ElementRef, ViewChild, Inject, Optional, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QuillEditorComponent } from 'ngx-quill';
import pdfMake from 'pdfmake/build/pdfmake';
import { pdfFonts } from '../../pdf-fonts';
import { Seccion } from 'src/app/seccion/seccion';
import { ContenidoService } from '../contenido.service';
import { SubSeccion } from 'src/app/subseccion/sub-seccion';
import { SeccionService } from 'src/app/seccion/seccion.service';

///////////////////////////////////

// Asignar fuentes personalizadas al sistema de pdfMake
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
  selector: 'app-contenido-programatico',
  templateUrl: './contenido-programatico.component.html',
  styleUrls: ['./contenido-programatico.component.css']
}) */
/*export class ContenidoProgramaticoComponent implements OnInit, AfterViewInit {
   @ViewChild('contenidoPDF', { static: false }) contenidoPDF!: ElementRef;
  @ViewChild('editor', { static: false }) quillEditorComponent!: QuillEditorComponent;
  quillInitialized = false;
  formulario: FormGroup;
  seccionesEliminar: Seccion[] = [];
  funcionalidad = 'Agregar contenido';
  htmlContent = '';
  public seccion: any;
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

  itemsPorPagina= 5;
  paginaActual: number = 0;

  currentPage = 0;
  totalSecciones = 0;
  itemsPerPageSections = 5;
  currentSectionPage = 0;
  currentSubPages: number[] = [0, 0, 0];
  itemsPerPageSubsections = 5;

  constructor(
    @Optional() public referenciaVentanaModal: MatDialogRef<ContenidoProgramaticoComponent>,
    @Inject(MAT_DIALOG_DATA) @Optional() public idContenido: number,
    private contenidoService: ContenidoService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.formulario = this.formBuilder.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      secciones: this.formBuilder.array([]) // FormArray vacío para las secciones
    });
  }

  ngOnInit(): void {
    this.formulario = this.formBuilder.group({
      titulo: ['', Validators.required],
      secciones: this.formBuilder.array([]) // FormArray vacío para las secciones
    });
  }

  obtenerSecciones(): FormArray {
    return this.formulario.get('secciones') as FormArray;
  }

  

  agregarSeccion(): void {
    const secciones = this.obtenerSecciones();
    secciones.push(this.formBuilder.group({
      nombreSeccion: [''],
      subsecciones: this.formBuilder.array([]) // Inicializa el FormArray de subsecciones
    }));
  }

  agregarSubSeccion(seccionIndex: number): void {
    const subsecciones = this.obtenerSubsecciones(seccionIndex);
    subsecciones.push(this.formBuilder.group({
      nombreSubseccion: [''],
      contenidoSubSeccion: ['']
    }));
  }

  ngAfterViewInit() {
    this.checkQuillEditorAvailability();
  }

  checkQuillEditorAvailability() {
    if (this.quillEditorComponent) {
      if (this.quillEditorComponent.quillEditor) {
        this.quillInitialized = true;
      } else {
        setTimeout(() => this.checkQuillEditorAvailability(), 500);
      }
    } else {
      setTimeout(() => this.checkQuillEditorAvailability(), 500);
    }
  }

  cargarInformacionFormulario(): void {
    if (this.idContenido) {
      this.contenidoService.obtenerElementoPorID(this.idContenido).subscribe((resultado) => {
        this.formulario.patchValue(resultado);
        resultado.secciones.forEach((seccion: Seccion) => {
          const seccionFormGroup = this.crearSeccion();
          seccionFormGroup.patchValue(seccion);
          const subsecciones = seccionFormGroup.get('subsecciones') as FormArray;
          seccion.listaSubSeccion.forEach((subseccion: Subseccion) => {
            const subSeccionFormGroup = this.crearSubseccion();
            subSeccionFormGroup.patchValue(subseccion);
            subsecciones.push(subSeccionFormGroup);
          });
          this.obtenerSecciones().push(seccionFormGroup);
        });
        this.totalSecciones = resultado.secciones.length;
      });
    }
  }

  obtenerSubsecciones(seccionIndex: number): FormArray {
    return (this.obtenerSecciones().at(seccionIndex) as FormGroup).get('subsecciones') as FormArray;
  }

  obtenerSubseccionesPaginated(index: number): AbstractControl[] {
    const currentPage = this.currentSubPages[index] || 0;
    const startIndex = currentPage * this.itemsPerPageSubsections;
    return this.obtenerSubsecciones(index).controls.slice(startIndex, startIndex + this.itemsPerPageSubsections);
  }

  generarPDF() {
    if (!this.quillInitialized || !this.quillEditorComponent) {
      console.error('Editor Quill no inicializado.');
      return;
    }
    const delta = this.quillEditorComponent.quillEditor.getContents();
    const pdfContent = this.convertirDeltaAPdfmake(delta);
    const docDefinition = {
      content: pdfContent,
      defaultStyle: {
        font: 'Roboto'
      }
    };
    pdfMake.createPdf(docDefinition).download('contenido.pdf');
  }

  convertirDeltaAPdfmake(delta: any) {
    const pdfContent: any[] = [];
    delta.ops.forEach((op: any) => {
      if (typeof op.insert === 'string') {
        const textObj: any = { text: op.insert.trim() };
        if (op.attributes) {
          if (op.attributes.bold) textObj.bold = true;
          if (op.attributes.italic) textObj.italics = true;
          if (op.attributes.underline) textObj.underline = true;
          if (op.attributes.font) textObj.font = op.attributes.font;
        }
        pdfContent.push(textObj);
      } else if (op.insert.image) {
        pdfContent.push({ image: op.insert.image, width: 500 });
      }
    });
    return pdfContent;
  }

  paginaAnteriorSubsecciones(index: number): void {
    if ((this.currentSubPages[index] || 0) > 0) {
      this.currentSubPages[index]--;
    }
  }

  paginaSiguienteSubsecciones(index: number): void {
    const totalPages = Math.ceil(this.obtenerSubsecciones(index).length / this.itemsPerPageSubsections);
    if ((this.currentSubPages[index] || 0) < totalPages - 1) {
      this.currentSubPages[index]++;
    }
  }

  totalPaginasSubsecciones(index: number): number {
    return Math.ceil(this.obtenerSubsecciones(index).length / this.itemsPerPageSubsections);
  }

  quitarSeccion(index: number): void {
    const secciones = this.obtenerSecciones();
    secciones.removeAt(index);
  }

  quitarSubseccion(seccionIndex: number, subseccionIndex: number): void {
    const subsecciones = this.obtenerSubsecciones(seccionIndex);
    subsecciones.removeAt(subseccionIndex);
  }

  crearSeccion(): FormGroup {
    return this.formBuilder.group({
      nombreSeccion: ['', Validators.required],
      subsecciones: this.formBuilder.array([]) // Inicializa el FormArray de subsecciones
    });
  }

  crearSubseccion(): FormGroup {
    return this.formBuilder.group({
      nombreSubseccion: ['', Validators.required],
      contenidoSubSeccion: ['', Validators.required]
    });
  }
  onEditorCreated(event: any) {
    // Lógica para manejar el evento cuando el editor ha sido creado.
    console.log('Editor creado:', event);
  }
  Eventos(event: any) {
    console.log('Evento cambiado:', event);
    // Aquí puedes agregar la lógica necesaria para manejar el evento
  }
  
    paginaAnteriorSecciones(): void {
      if (this.paginaActual > 0) {
        this.paginaActual--;
      }
    }

    obtenerSeccionesPaginated(): FormGroup[] {
      const seccionesControl = this.formulario.get('secciones');
      if (!seccionesControl) {
        return []; // Devuelve un arreglo vacío si el control no existe
      }
    
      const startIndex = this.paginaActual * this.itemsPorPagina;
      const endIndex = startIndex + this.itemsPorPagina;
      return seccionesControl.value.slice(startIndex, endIndex);
    }
    
    paginaSiguienteSecciones(): void {
      const seccionesControl = this.formulario.get('secciones');
      if (!seccionesControl) {
        return; // No hagas nada si el control no existe
      }
    
      const totalSecciones = seccionesControl.value.length;
      if ((this.paginaActual + 1) * this.itemsPorPagina < totalSecciones) {
        this.paginaActual++;
      }
    } */

    /////////////////////////////////////////////////////////////////////////
   /*  export class ContenidoProgramaticoComponent implements OnInit {
    ngOnInit(): void {
     
    }
    sections = [
  {
    numeroSeccion: 1,
    nombreSeccion: 'Sección 1',
    listaSubSeccion: [
      {
        numeroSubSeccion: 1,
        get nombreSubSeccion() {
          return `Subsección ${this.numeroSeccion}.${this.numeroSubSeccion}`;
        },
        contenidoTexto: 'Contenido de la subsección 1.1',
        numeroSeccion: 1 // Se incluye para que nombreSubSeccion pueda referenciarlo
      },
      {
        numeroSubSeccion: 2,
        get nombreSubSeccion() {
          return `Subsección ${this.numeroSeccion}.${this.numeroSubSeccion}`;
        },
        contenidoTexto: 'Contenido de la subsección 1.2',
        numeroSeccion: 1
      }
    ]
  },
  {
    numeroSeccion: 2,
    nombreSeccion: 'Sección 2',
    listaSubSeccion: [
      {
        numeroSubSeccion: 1,
        get nombreSubSeccion() {
          return `Subsección ${this.numeroSeccion}.${this.numeroSubSeccion}`;
        },
        contenidoTexto: 'Contenido de la subsección 2.1',
        numeroSeccion: 2
      },
      {
        numeroSubSeccion: 2,
        get nombreSubSeccion() {
          return `Subsección ${this.numeroSeccion}.${this.numeroSubSeccion}`;
        },
        contenidoTexto: 'Contenido de la subsección 2.2',
        numeroSeccion: 2
      }
    ]
  }
];
    sectionIndex = 0;
    subSectionIndex = 0;
  
    // Obtener la sección actual
    get currentSection() {
      return this.sections[this.sectionIndex];
    }
  
    // Obtener la subsección actual dentro de la sección
    get currentSubSection() {
      return this.currentSection?.listaSubSeccion[this.subSectionIndex];
    }
  
    // Navegar a la siguiente subsección
    nextSubSection() {
      if (this.subSectionIndex < this.currentSection.listaSubSeccion.length - 1) {
        this.subSectionIndex++;
      }
    }
  
    // Navegar a la subsección anterior
    previousSubSection() {
      if (this.subSectionIndex > 0) {
        this.subSectionIndex--;
      }
    }
  
    // Navegar a la siguiente sección
    nextSection() {
      if (this.sectionIndex < this.sections.length - 1) {
        this.sectionIndex++;
        this.subSectionIndex = 0; // Reiniciar índice de subsección al cambiar de sección
      }
    }
  
    // Navegar a la sección anterior
    previousSection() {
      if (this.sectionIndex > 0) {
        this.sectionIndex--;
        this.subSectionIndex = 0; // Reiniciar índice de subsección al cambiar de sección
      }
    } */
    //////////////////////////////////////////////////////////////////////////////// 
    
//5
/* import { Component, ElementRef, ViewChild, Inject, Optional, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QuillEditorComponent } from 'ngx-quill';
import pdfMake from 'pdfmake/build/pdfmake';
import { pdfFonts } from '../../pdf-fonts';
import { Seccion } from 'src/app/seccion/seccion';
import { ContenidoService } from '../contenido.service';
import { Subseccion } from 'src/app/subseccion/subseccion';

// Asignar fuentes personalizadas al sistema de pdfMake
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
  selector: 'app-contenido-programatico',
  templateUrl: './contenido-programatico.component.html',
  styleUrls: ['./contenido-programatico.component.css']
})
export class ContenidoProgramaticoComponent implements OnInit, AfterViewInit {
  @ViewChild('contenidoPDF', { static: false }) contenidoPDF!: ElementRef;
  @ViewChild('editor', { static: false }) quillEditorComponent!: QuillEditorComponent;
  quillInitialized = false;
  formulario: FormGroup;
  seccionesEliminar: Seccion[] = [];
  secciones: Seccion[] = [];
  htmlContent = '';
  itemsPorPagina = 5;
  paginaActual = 0;
  itemsPerPageSubsections = 5;
  currentSubPages: number[] = [0];

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
      ['clean']
    ]
  };

  constructor(
    @Optional() public referenciaVentanaModal: MatDialogRef<ContenidoProgramaticoComponent>,
    @Inject(MAT_DIALOG_DATA) @Optional() public idContenido: number,
    private contenidoService: ContenidoService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.formulario = this.formBuilder.group({
      titulo: ['', Validators.required],
      secciones: this.formBuilder.array([])
    });
  }

  ngOnInit(): void {
    if (this.idContenido) {
      this.cargarInformacionFormulario();
    }
  }

  private cargarInformacionFormulario(): void {
    // Supón que `contenidoService.obtenerContenidoPorId` devuelve la información del contenido por su `idContenido`.
    this.contenidoService.obtenerElementoPorID(this.idContenido).subscribe(
      (contenido) => {
        // Aquí se llena el formulario con la información recibida
        this.formulario.patchValue({
          titulo: contenido.titulo
        });
  
        const seccionesFormArray = this.obtenerSecciones();
        contenido.listaSeccion.forEach((seccion: Seccion) => {
          const seccionFormGroup = this.formBuilder.group({
            nombreSeccion: [seccion.nombreSeccion, Validators.required],
            subsecciones: this.formBuilder.array([])
          });
  
          const subseccionesFormArray = seccionFormGroup.get('subsecciones') as FormArray;
          seccion.listaSubSeccion.forEach((subseccion: Subseccion) => {
            subseccionesFormArray.push(this.formBuilder.group({
              nombreSubseccion: [subseccion.nombreSubseccion, Validators.required],
            }));
          });
  
          seccionesFormArray.push(seccionFormGroup);
        });
      },
      (error) => {
        this.snackBar.open('Error al cargar el contenido', 'Cerrar', {
          duration: 3000,
        });
        console.error('Error al cargar la información:', error);
      }
    );
  }
  

  ngAfterViewInit(): void {
    this.checkQuillEditorAvailability();
  }

  obtenerSecciones(): FormArray {
    return this.formulario.get('secciones') as FormArray;
  }

  agregarSeccion(): void {
    const secciones = this.obtenerSecciones();
    secciones.push(this.formBuilder.group({
      nombreSeccion: ['', Validators.required],
      subsecciones: this.formBuilder.array([])
    }));
    this.currentSubPages.push(0); // Aseguramos que haya una página de subsección para cada nueva sección
  }

  agregarSubSeccion(seccionIndex: number): void {
    const subsecciones = this.obtenerSubsecciones(seccionIndex);
    subsecciones.push(this.formBuilder.group({
      nombreSubseccion: ['', Validators.required],
      contenidoSubSeccion: ['']
    }));
  }

  obtenerSubsecciones(seccionIndex: number): FormArray {
    return (this.obtenerSecciones().at(seccionIndex) as FormGroup).get('subsecciones') as FormArray;
  }

  checkQuillEditorAvailability(): void {
    if (this.quillEditorComponent && this.quillEditorComponent.quillEditor) {
      this.quillInitialized = true;
    } else {
      setTimeout(() => this.checkQuillEditorAvailability(), 500);
    }
  }

  generarPDF(): void {
    if (!this.quillInitialized || !this.quillEditorComponent) {
      console.error('Editor Quill no inicializado.');
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

  convertirDeltaAPdfmake(delta: any): any[] {
    const pdfContent: any[] = [];
    delta.ops.forEach((op: any) => {
      if (typeof op.insert === 'string') {
        const textObj: any = { text: op.insert.trim() };
        if (op.attributes) {
          if (op.attributes.bold) textObj.bold = true;
          if (op.attributes.italic) textObj.italics = true;
          if (op.attributes.underline) textObj.underline = true;
          if (op.attributes.font) textObj.font = op.attributes.font;
        }
        pdfContent.push(textObj);
      } else if (op.insert.image) {
        pdfContent.push({ image: op.insert.image, width: 500 });
      }
    });
    return pdfContent;
  }

  quitarSeccion(index: number): void {
    const secciones = this.obtenerSecciones();
    secciones.removeAt(index);
    this.currentSubPages.splice(index, 1);
  }

  quitarSubseccion(seccionIndex: number, subseccionIndex: number): void {
    const subsecciones = this.obtenerSubsecciones(seccionIndex);
    subsecciones.removeAt(subseccionIndex);
  }

  paginaAnteriorSecciones(): void {
    if (this.paginaActual > 0) {
      this.paginaActual--;
    }
  }

  paginaSiguienteSecciones(): void {
    const totalSecciones = this.obtenerSecciones().length;
    if ((this.paginaActual + 1) * this.itemsPorPagina < totalSecciones) {
      this.paginaActual++;
    }
  }

  paginaAnteriorSubsecciones(seccionIndex: number): void {
    if (this.currentSubPages[seccionIndex] > 0) {
      this.currentSubPages[seccionIndex]--;
    }
  }

  paginaSiguienteSubsecciones(seccionIndex: number): void {
    const totalPages = Math.ceil(this.obtenerSubsecciones(seccionIndex).length / this.itemsPerPageSubsections);
    if (this.currentSubPages[seccionIndex] < totalPages - 1) {
      this.currentSubPages[seccionIndex]++;
    }
  }

  //paginaActual = 0;
  totalPaginas = 1;

  // Aquí se controla la paginación de las secciones y subsecciones
  obtenerSeccionesPaginated() {
    const seccionesPorPagina = 3; // Por ejemplo, 3 secciones por página
    const inicio = this.paginaActual * seccionesPorPagina;
    const fin = inicio + seccionesPorPagina;
    return this.secciones.slice(inicio, fin); // 'secciones' es tu arreglo de secciones
  }

  obtenerSubseccionesPaginated(seccionIndex: number) {
    const subseccionesPorPagina = 3; // 3 subsecciones por página
    const subsecciones = this.secciones[seccionIndex].listaSubSeccion;
    const inicio = this.paginaActual * subseccionesPorPagina;
    const fin = inicio + subseccionesPorPagina;
    return subsecciones.slice(inicio, fin);
  }

  anteriorPagina() {
    if (this.paginaActual > 0) {
      this.paginaActual--;
    }
  }

  siguientePagina() {
    if (this.paginaActual < this.totalPaginas - 1) {
      this.paginaActual++;
    }
  }
}
 */
//6
/* export class ContenidoProgramaticoComponent implements OnInit {
  contenidoForm: FormGroup;
  sectionIndex = 0;
  subSectionIndex = 0;
  constructor(private fb: FormBuilder) { }
  ngOnInit(): void {
    // Inicializar el formulario reactivo
    this.contenidoForm = this.fb.group({
      sections: this.fb.array([this.createSection()])
    });
  }
  // Crear una sección
  createSection(): FormGroup {
    return this.fb.group({
      nombreSeccion: ['', Validators.required],
      listaSubSeccion: this.fb.array([this.createSubSection()])
    });
  }
  // Crear una subsección
  createSubSection(): FormGroup {
    return this.fb.group({
      nombreSubSeccion: ['', Validators.required],
      contenidoTexto: ['', Validators.required]
    });
  }
  // Acceso al array de secciones
  get sections(): FormArray {
    return this.contenidoForm.get('sections') as FormArray;
  }
  // Acceso a la lista de subsecciones de una sección
  getSubsections(index: number): FormArray {
    return this.sections.at(index).get('listaSubSeccion') as FormArray;
  }
  // Navegar a la siguiente subsección
  nextSubSection() {
    if (this.subSectionIndex < this.getSubsections(this.sectionIndex).length - 1) {
      this.subSectionIndex++;
    }
  }
  // Navegar a la subsección anterior
  previousSubSection() {
    if (this.subSectionIndex > 0) {
      this.subSectionIndex--;
    }
  }
  // Navegar a la siguiente sección
  nextSection() {
    if (this.sectionIndex < this.sections.length - 1) {
      this.sectionIndex++;
      this.subSectionIndex = 0; // Reiniciar índice de subsección al cambiar de sección
    }
  }
  // Navegar a la sección anterior
  previousSection() {
    if (this.sectionIndex > 0) {
      this.sectionIndex--;
      this.subSectionIndex = 0; // Reiniciar índice de subsección al cambiar de sección
    }
  }
  // Método para agregar una nueva sección
  addSection() {
    this.sections.push(this.createSection());
  }
  // Método para agregar una nueva subsección a la sección actual
  addSubsection() {
    this.getSubsections(this.sectionIndex).push(this.createSubSection());
  }
  // Enviar los datos al backend (ejemplo)
  onSubmit() {
    console.log(this.contenidoForm.value);
    // Aquí podrías hacer una llamada HTTP para guardar el contenido
  }
} */
  

//7
  /* export class ContenidoProgramaticoComponent implements OnInit {

    seccionForm: FormGroup;
    secciones: Seccion[] = []; // Cambiado a un arreglo
  
    constructor(private fb: FormBuilder,
                private seccionService: SeccionService 
    ) {
      this.seccionForm = this.fb.group({
        //id: [''],
        numeroSeccion: [''],
        nombreSeccion: [''],
        listaSubSeccion: this.fb.array([])
      });
    }
  
    ngOnInit(): void {}
  
    get listaSubSeccion(): FormArray {
      return this.seccionForm.get('listaSubSeccion') as FormArray;
    }
  
    agregarSubseccion() {
      const subseccionGroup = this.fb.group({
        //id: [''],
        numeroSubSeccion: this.listaSubSeccion.length + 1, // Índice automático
        nombreSubSeccion: ['']
      });
      this.listaSubSeccion.push(subseccionGroup);
    }
  
    seccion1:Seccion;
    agregarSeccion() {
      const nuevaSeccion: Seccion = this.seccionForm.value;
      nuevaSeccion.numeroSeccion = this.secciones.length + 1;
      this.secciones.push(nuevaSeccion);
      console.log(nuevaSeccion);
      this.seccion1 =nuevaSeccion;
      this.seccion1.listaSubSeccion=[];
      console.log(this.seccion1);
      this.seccionService.agregarElemento(this.seccion1).subscribe(seccion => {
        console.log(seccion);
      });
    }
  } */