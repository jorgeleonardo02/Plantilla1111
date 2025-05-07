
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



@Injectable({
  providedIn: 'root'
})
export class PdfGeneratorService {

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
