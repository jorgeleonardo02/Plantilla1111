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

  /* onEditorCreated(quill: Quill) {
    if (this.quillEditorComponent) {
      this.quillEditorComponent.quillEditor = quill;
      this.quillInitialized = true;
      console.log('El editor Quill se ha inicializado correctamente en onEditorCreated.', quill);
    } else {
      console.error('El ViewChild quillEditor no está disponible en onEditorCreated.');
    }
  } */
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
      console.log(delta);
      console.log("delta");
      delta.ops.forEach((op: any) => {
        if (typeof op.insert === 'string') {
          const text = op.insert;
          const lines = text.split('\n');
          lines.forEach((line: string, index: number) => {
            if (line.trim() !== '') {
              const textObj: any = { text: line };
    
              // Aplica los atributos de estilo si existen
              if (op.attributes) {
                if (op.attributes.bold) {
                  textObj.bold = true;
                }
                if (op.attributes.italic) {
                  textObj.italics = true;
                }
                if (op.attributes.underline) {
                  textObj.decoration = 'underline';
                }
                if (op.attributes.color) {
                  textObj.color = op.attributes.color;
                }
                if (op.attributes.background) {
                  textObj.background = op.attributes.background;
                }
                if (op.attributes.size) {
                  textObj.fontSize = this.convertirTamaño(op.attributes.size);
                }
                if (op.attributes.font) {
                  textObj.font = this.convertirFuente(op.attributes.font);
                }
                if (op.attributes.align) {
                  textObj.alignment = this.convertirAlineacion(op.attributes.align);
                }
              }
              // Agrega el texto al párrafo actual
              paragraph.push(textObj);
            }
            // Si es la última línea del texto o hay un salto de línea
            if (index < lines.length - 1 || text.endsWith('\n')) {
               //Agrega el párrafo al contenido PDF si tiene texto
              if (paragraph.length > 0) {
                pdfContent.push({ text: paragraph });
                paragraph = []; // Reinicia el párrafo
              }
            }
          });
        } else if (op.insert && op.insert.image) {
          pdfContent.push({
            image: op.insert.image,
            width: 200
          });
        }
      });
    
       //Agrega el último párrafo si queda algo pendiente
      if (paragraph.length > 0) {
        pdfContent.push({ text: paragraph });
      }
      return pdfContent;
    }  */

      convertirDeltaAPdfmake(delta: any) {
        const pdfContent: any[] = [];
        let paragraph: any[] = [];
        
        delta.ops.forEach((op: any) => {
          if (typeof op.insert === 'string') {
            const text = op.insert;
            const lines = text.split('\n');
      
            lines.forEach((line: string, index: number) => {
              if (line.trim() !== '') {
                const textObj: any = { text: line };
      
                // Aplica los atributos de estilo si existen
                if (op.attributes) {
                  if (op.attributes.bold) textObj.bold = true;
                  if (op.attributes.italic) textObj.italics = true;
                  if (op.attributes.underline) textObj.decoration = 'underline';
                  if (op.attributes.color) textObj.color = op.attributes.color;
                  if (op.attributes.background) textObj.background = op.attributes.background;
                  if (op.attributes.size) textObj.fontSize = this.convertirTamaño(op.attributes.size);
                  if (op.attributes.font) textObj.font = this.convertirFuente(op.attributes.font);
                }
      
                // Agrega el texto al párrafo actual
                paragraph.push(textObj);
              }
      
              // Si es la última línea del texto o un salto de línea explícito
              if (index < lines.length - 1 || text.endsWith('\n')) {
                // Inserta el párrafo al contenido PDF solo si tiene texto
                if (paragraph.length > 0) {
                  // Aplica alineación al párrafo si está presente en los atributos
                  const paragraphBlock: any = { text: paragraph };
                  if (op.attributes?.align) {
                    paragraphBlock.alignment = this.convertirAlineacion(op.attributes.align);
                  }
      
                  pdfContent.push(paragraphBlock);
                  paragraph = []; // Reinicia el párrafo
                }
              }
            });
          } else if (op.insert && op.insert.image) {
            pdfContent.push({
              image: op.insert.image,
              width: 200
            });
          }
        });
      
        // Agrega el último párrafo si queda algo pendiente
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


