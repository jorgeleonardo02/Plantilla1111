
  /* import { Injectable } from '@angular/core';
  import * as pdfMake from 'pdfmake/build/pdfmake';
  import * as pdfFonts from 'pdfmake/build/vfs_fonts';
  import Quill from 'quill';
  
  @Injectable({
    providedIn: 'root'
  })
  export class PdfGeneratorService {
  
    constructor() {
      (pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
    }
  
    generarPDF(delta: any) {
      const fonts = {
        Roboto: {
          normal: 'Roboto-Regular.ttf',
          bold: 'Roboto-Bold.ttf',
          italics: 'Roboto-Italic.ttf',
          bolditalics: 'Roboto-BoldItalic.ttf',
        },
        CourierPrime: {
          normal: 'CourierPrime-Regular.ttf',
          bold: 'CourierPrime-Bold.ttf',
          italics: 'CourierPrime-Italic.ttf',
          bolditalics: 'CourierPrime-BoldItalic.ttf',
        },
        LiberationSerif: {
          normal: 'LiberationSerif-Regular.ttf',
          bold: 'LiberationSerif-Bold.ttf',
          italics: 'LiberationSerif-Italic.ttf',
          bolditalics: 'LiberationSerif-BoldItalic.ttf',
        },
      };

      const pdfContent = this.convertirDeltaAPdfmake(delta);
      const docDefinition = {
        content: pdfContent,
        defaultStyle: { font: 'Roboto' }
      };
      pdfMake.createPdf(docDefinition).download('contenido.pdf');
    }
  
    private convertirDeltaAPdfmake(delta: any) {
      const pdfContent: any[] = [];
      let paragraph: any[] = [];
  
      delta.ops.forEach((op: any, index: number) => {
        if (typeof op.insert === 'string') {
          const text = op.insert;
          const lines = text.split('\n');
          lines.forEach((line: string, idx: number) => {
            if (line.trim() !== '') {
              const textObj: any = { text: line };
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
              pdfContent.push({ text: '', margin: [0, 5] });
            }
          });
        } else if (op.insert && op.insert.image) {
          const imageObj: any = {
            image: op.insert.image,
            width: 200
          };
          const nextOp = delta.ops[index + 1];
          if (nextOp && nextOp.attributes && nextOp.attributes.align) {
            imageObj.alignment = this.convertirAlineacion(nextOp.attributes.align);
          } else {
            imageObj.alignment = 'left';
          }
          pdfContent.push(imageObj);
        }
      });
  
      if (paragraph.length > 0) {
        pdfContent.push({ text: paragraph });
      }
      return pdfContent;
    }
  
    private convertirTamaño(size: string): number {
      switch (size) {
        case 'small': return 10;
        case 'large': return 18;
        case 'huge': return 24;
        default: return 12;
      }
    }
  
    private convertirFuente(font: string) {
      switch (font) {
        case 'serif': return 'LiberationSerif';
        case 'monospace': return 'CourierPrime';
        case 'sans-serif':
        default: return 'Roboto';
      }
    }
  
    private convertirAlineacion(align: string) {
      switch (align) {
        case 'center': return 'center';
        case 'right': return 'right';
        case 'justify': return 'justify';
        default: return 'left';
      }
    }
  }
   */

import { Injectable } from '@angular/core';
import pdfMake, { fonts } from 'pdfmake/build/pdfmake';
import { pdfFonts as vfs } from 'src/app/pdf-fonts';
import htmlToPdfmake from 'html-to-pdfmake';
import html2pdf from 'html2pdf.js';



@Injectable({
  providedIn: 'root'
})
export class PdfGeneratorService {
  editor: any;

  generarPDF(delta: any) {
    const fonts = {
      Roboto: {
        normal: 'Roboto-Regular.ttf',
        bold: 'Roboto-Bold.ttf',
        italics: 'Roboto-Italic.ttf',
        bolditalics: 'Roboto-BoldItalic.ttf',
      },
      CourierPrime: {
        normal: 'CourierPrime-Regular.ttf',
        bold: 'CourierPrime-Bold.ttf',
        italics: 'CourierPrime-Italic.ttf',
        bolditalics: 'CourierPrime-BoldItalic.ttf',
      },
      LiberationSerif: {
        normal: 'LiberationSerif-Regular.ttf',
        bold: 'LiberationSerif-Bold.ttf',
        italics: 'LiberationSerif-Italic.ttf',
        bolditalics: 'LiberationSerif-BoldItalic.ttf',
      },
    };

    const pdfContent = this.convertirDeltaAPdfmake(delta);
    const docDefinition = {
      content: pdfContent,
      defaultStyle: { font: 'Roboto' }
    };

    pdfMake.createPdf(docDefinition, undefined, fonts, vfs).download('contenido.pdf');

  }

  // se justifica pero no muestra los numeros
  /* private convertirDeltaAPdfmake(delta: any) {
    const pdfContent: any[] = [];
    let paragraph: any[] = [];

    delta.ops.forEach((op: any, index: number) => {
      if (typeof op.insert === 'string') {
        const text = op.insert;
        const lines = text.split('\n');
        lines.forEach((line: string, idx: number) => {
          if (line.trim() !== '') {
            const textObj: any = { text: line };
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
            pdfContent.push({ text: '', margin: [0, 5] });
          }
        });
      } else if (op.insert && op.insert.image) {
        const imageObj: any = {
          image: op.insert.image,
          width: 200
        };
        const nextOp = delta.ops[index + 1];
        if (nextOp?.attributes?.align) {
          imageObj.alignment = this.convertirAlineacion(nextOp.attributes.align);
        } else {
          imageObj.alignment = 'left';
        }
        pdfContent.push(imageObj);
      }
    });

    if (paragraph.length > 0) {
      pdfContent.push({ text: paragraph });
    }
    return pdfContent;
  } */
// muestra los numeros pero no estan justidicado y alineado
/* convertirDeltaAPdfmake(delta: any): any[] {
  const contenido: any[] = [];
  let paragraph: any[] = [];
  let listBuffer: any[] = [];
  let currentListType: 'ul' | 'ol' | null = null;
  const flushParagraph = () => {
    if (paragraph.length) {
      contenido.push({ text: paragraph, margin: [0, 5] });
      paragraph = [];
    }
  };
  const flushList = () => {
    if (listBuffer.length && currentListType) {
      contenido.push({ [currentListType]: listBuffer, margin: [0, 5] });
      listBuffer = [];
      currentListType = null;
    }
  };
  delta.ops.forEach((op: any, index: number) => {
    if (typeof op.insert === 'string' && op.insert === '\n' && op.attributes?.list) {
      const prevOp = delta.ops[index - 1];
      if (prevOp && typeof prevOp.insert === 'string') {
        const textObj: any = { text: prevOp.insert.trim() };
        if (prevOp.attributes) {
          if (prevOp.attributes.bold) textObj.bold = true;
          if (prevOp.attributes.italic) textObj.italics = true;
          if (prevOp.attributes.underline) textObj.decoration = 'underline';
          if (prevOp.attributes.color) textObj.color = prevOp.attributes.color;
          if (prevOp.attributes.background) textObj.background = prevOp.attributes.background;
          if (prevOp.attributes.size) textObj.fontSize = this.convertirTamaño(prevOp.attributes.size);
          if (prevOp.attributes.font) textObj.font = this.convertirFuente(prevOp.attributes.font);
        }
        const listType = op.attributes.list === 'ordered' ? 'ol' : 'ul';
        if (currentListType !== listType) {
          flushList();
          currentListType = listType;
        }
        listBuffer.push(textObj);
        paragraph = [];
      }
      return;
    }
    if (typeof op.insert === 'string' && op.insert === '\n') {
      flushParagraph();
      flushList();
      return;
    }
    if (typeof op.insert === 'string') {
      const textObj: any = { text: op.insert };
      if (op.attributes) {
        if (op.attributes.bold) textObj.bold = true;
        if (op.attributes.italic) textObj.italics = true;
        if (op.attributes.underline) textObj.decoration = 'underline';
        if (op.attributes.color) textObj.color = op.attributes.color;
        if (op.attributes.background) textObj.background = op.attributes.background;
        if (op.attributes.size) textObj.fontSize = this.convertirTamaño(op.attributes.size);
        if (op.attributes.font) textObj.font = this.convertirFuente(op.attributes.font);
        if (op.attributes.align) {
          flushParagraph();
          flushList();
          contenido.push({
            text: [textObj],
            alignment: op.attributes.align,
            margin: [0, 5],
          });
          return;
        }
      }
      paragraph.push(textObj);
    }
    if (op.insert.image) {
      flushParagraph();
      flushList();
      contenido.push({
        image: op.insert.image,
        width: 400,
        alignment: 'center',
        margin: [0, 10],
      });
    }
  });
  flushParagraph();
  flushList();
  return contenido;
} */

// si ok ok faltan los numeros o viñetas en la lista
private convertirDeltaAPdfmake(delta: any): any[] {
  console.log('Delta recibido:', delta);
  const contenido: any[] = [];
  let paragraph: any[] = [];

  let listItems: any[] = [];
  let currentListType: 'ordered' | 'bullet' | null = null;

  const flushParagraph = (align?: string) => {
    if (paragraph.length) {
      const paragraphBlock: any = { text: paragraph, margin: [0, 5] };
      if (align) {
        paragraphBlock.alignment = this.convertirAlineacion(align);
      }
      console.log('Agregando párrafo:', paragraphBlock);
      contenido.push(paragraphBlock);
      paragraph = [];
    }
  };

  const flushList = () => {
    if (listItems.length === 0) return;

    const listBlock = currentListType === 'ordered'
      ? { ol: listItems, margin: [0, 5] }
      : { ul: listItems, margin: [0, 5] };

    contenido.push(listBlock);
    listItems = [];
    currentListType = null;
  };

  delta.ops.forEach((op: any) => {
    console.log('Procesando op:', op);
    // Manejo de listas
    if (typeof op.insert === 'string' && op.attributes?.list) {
      flushParagraph(); // Cerramos cualquier párrafo abierto

      const listType = op.attributes.list === 'ordered' ? 'ordered' : 'bullet';

      // Si cambia el tipo de lista, cerramos la anterior
      if (currentListType && currentListType !== listType) {
        flushList();
      }

      currentListType = listType;

      const textInline: any = [];

      // Aplica atributos si los hay
      const textoPlano = op.insert.trim();
      const textPart: any = { text: textoPlano };

      if (op.attributes.bold) textPart.bold = true;
      if (op.attributes.italic) textPart.italics = true;
      if (op.attributes.underline) textPart.decoration = 'underline';
      if (op.attributes.color) textPart.color = op.attributes.color;
      if (op.attributes.background) textPart.background = op.attributes.background;
      if (op.attributes.size) textPart.fontSize = this.convertirTamaño(op.attributes.size);
      if (op.attributes.font) textPart.font = this.convertirFuente(op.attributes.font);

      textInline.push(textPart);
      listItems.push(textInline);
      return;
    }

    // Salto de línea
    if (typeof op.insert === 'string' && op.insert === '\n') {
      flushParagraph(op.attributes?.align);
      flushList();
      return;
    }

    // Texto normal
    if (typeof op.insert === 'string') {
      const textObj: any = { text: op.insert };

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
      return;
    }

    // Imágenes
    if (op.insert.image) {
      flushParagraph();
      flushList();

      contenido.push({
        image: op.insert.image,
        width: 400,
        alignment: 'center',
        margin: [0, 10],
      });
    }
  });

  flushParagraph();
  flushList();

  console.log('Contenido final PDFMake:', contenido);
  return contenido;
}

// funcion 


/************************** */
// esta esta muy cesca a solucionar todo solo que pone todos los numeros en 1
/* private convertirDeltaAPdfmake(delta: any): any[] {
  const pdfContent: any[] = [];
  let buffer: any[] = [];
  let listItems: any[] = [];
  let currentListType: 'ordered' | 'bullet' | null = null;

  const flushParagraph = () => {
    if (buffer.length > 0) {
      pdfContent.push({ text: [...buffer], margin: [0, 5] });
      console.log('🟦 Párrafo añadido:', [...buffer]);
      buffer = [];
    }
  };

  const flushList = () => {
    if (listItems.length > 0) {
      pdfContent.push({
        ul: currentListType === 'bullet' ? listItems : undefined,
        ol: currentListType === 'ordered' ? listItems : undefined,
        margin: [0, 5]
      });
      console.log(`🟧 Lista añadida (${currentListType}):`, listItems);
      listItems = [];
      currentListType = null;
    }
  };

  console.log('🟢 DELTA RECIBIDO:', JSON.stringify(delta, null, 2));

  delta.ops.forEach((op: any, i: number) => {
    const isNewline = op.insert === '\n';

    if (!isNewline && typeof op.insert === 'string') {
      const fragment: any = { text: op.insert };
      if (op.attributes) {
        if (op.attributes.bold) fragment.bold = true;
        if (op.attributes.italic) fragment.italics = true;
        if (op.attributes.underline) fragment.decoration = 'underline';
        if (op.attributes.color) fragment.color = op.attributes.color;
        if (op.attributes.background) fragment.background = op.attributes.background;
        if (op.attributes.size) fragment.fontSize = this.convertirTamaño(op.attributes.size);
        if (op.attributes.font) fragment.font = this.convertirFuente(op.attributes.font);
      }
      buffer.push(fragment);
    }

    if (isNewline) {
      const listType = op.attributes?.list;

      if (listType) {
        // Si cambia de tipo de lista, cerrar la anterior
        if (currentListType && currentListType !== listType) {
          flushList();
        }

        currentListType = listType;
        listItems.push({ text: [...buffer] });
        console.log('✅ Ítem de lista:', { tipo: listType, contenido: [...buffer] });
      } else {
        // No es lista, es un párrafo normal
        if (buffer.length > 0) {
          const paragraphBlock: any = { text: [...buffer], margin: [0, 5] };
          if (op.attributes?.align) {
            paragraphBlock.alignment = this.convertirAlineacion(op.attributes.align);
          }
          pdfContent.push(paragraphBlock);
          console.log('🟩 Párrafo finalizado:', paragraphBlock);
        }
      }

      buffer = [];

      // Si el siguiente op no tiene lista, cerrar lista actual
      const nextOp = delta.ops[i + 1];
      if (!nextOp || !nextOp.attributes?.list) {
        flushList();
      }
    }

    // Imágenes
    if (op.insert && op.insert.image) {
      flushParagraph();
      flushList();

      const imageObj: any = {
        image: op.insert.image,
        width: 200
      };

      if (op.attributes?.align) {
        imageObj.alignment = this.convertirAlineacion(op.attributes.align);
      } else {
        imageObj.alignment = 'left';
      }

      pdfContent.push(imageObj);
      console.log('🖼 Imagen añadida:', imageObj);
    }
  });

  // Procesar lo que queda
  if (buffer.length > 0) {
    if (currentListType) {
      listItems.push({ text: [...buffer] });
      console.log('✅ Ítem final de lista:', [...buffer]);
    } else {
      pdfContent.push({ text: [...buffer], margin: [0, 5] });
      console.log('🟦 Párrafo final añadido:', [...buffer]);
    }
  }

  flushList();
  flushParagraph();

  console.log('📄 Contenido final PDF:', pdfContent);
  return pdfContent;
} */








private convertirTamañoPorHeader(header: number): number {
  switch (header) {
    case 1: return 20;  // Título principal
    case 2: return 16;  // Subtítulo
    case 3: return 14;  // Título menor
    default: return 12; // Texto normal
  }
}
  generatePDF1(delta: any) {     
    for (let i = 0; i < delta.ops.length; i++) {
      const op = delta.ops[i];
      if (op.insert === '\n' && op.attributes && op.attributes.list) {
        const prevText = delta.ops[i - 1]?.insert || '';
        console.log('Tipo de lista:', op.attributes.list);
        console.log('Texto:', prevText);
      }
    }
  }
  private convertirTamaño(size: string): number {
    switch (size) {
      case 'small': return 10;
      case 'large': return 18;
      case 'huge': return 24;
      default: return 12;
    }
  }
  private convertirFuente(font: string) {
    switch (font) {
      case 'serif': return 'LiberationSerif';
      case 'monospace': return 'CourierPrime';
      case 'sans-serif':
      default: return 'Roboto';
    }
  }
  private convertirAlineacion(align: string) {
    switch (align) {
      case 'center': return 'center';
      case 'right': return 'right';
      case 'justify': return 'justify';
      default: return 'left';
    }
  }
}
