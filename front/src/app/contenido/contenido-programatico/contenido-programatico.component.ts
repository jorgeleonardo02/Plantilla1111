import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { QuillEditorComponent } from 'ngx-quill';
import pdfMake from 'pdfmake/build/pdfmake';
import { pdfFonts } from '../../pdf-fonts';  // Importa las fuentes base64
import Quill from 'quill';

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
export class ContenidoProgramaticoComponent implements AfterViewInit {
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

  constructor() {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.checkQuillEditorAvailability();
    }, 500); // Asegúrate de que el editor está completamente cargado
  }

  checkQuillEditorAvailability() {
    if (this.quillEditorComponent && this.quillEditorComponent.quillEditor) {
      this.quillInitialized = true;
      console.log('El ViewChild quillEditor está disponible en AfterViewInit.');
    } else {
      console.error('El ViewChild quillEditor no está disponible en AfterViewInit. Verificando nuevamente...');
      setTimeout(() => this.checkQuillEditorAvailability(), 500); // Reintentar
    }
  }

    onEditorCreated(quill: Quill) {
      if (this.quillEditorComponent) {
        this.quillEditorComponent.quillEditor = quill;
        this.quillInitialized = true;
        console.log('El editor Quill se ha inicializado correctamente en onEditorCreated.', quill);
  
        // Agrega un listener para cambios en el editor
        quill.on('text-change', () => {
          const delta = quill.getContents();
          console.log('Contenido Delta:', delta); // Monitorea el contenido Delta para ver los atributos
        });
      } else {
        console.error('El ViewChild quillEditor no está disponible en onEditorCreated.');
      }
    }

  guardar(forma: NgForm) {
    if (forma.valid) {
      console.log(forma.value);
      this.generarPDF();
    } else {
      console.warn('Formulario inválido');
    }
  }

  Eventos(evento: any) {
    if (evento && evento.html) {
      this.htmlContent = evento.html;
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
  
  /* convertirDeltaAPdfmake(delta: any) {
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

          if (idx < lines.length - 1 || text.endsWith('\n')) {
            if (paragraph.length > 0) {
              const paragraphBlock: any = { text: paragraph };
              if (op.attributes?.align) {
                paragraphBlock.alignment = this.convertirAlineacion(op.attributes.align);
              }
              pdfContent.push(paragraphBlock);
              paragraph = [];
            }
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
  } */

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




