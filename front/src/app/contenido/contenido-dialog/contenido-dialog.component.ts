import { Component, Inject, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-contenido-dialog',
  standalone: true,
  templateUrl: './contenido-dialog.component.html',
  styleUrls: ['./contenido-dialog.component.css']
})
export class ContenidoDialogComponent {

  constructor(
    @Optional() public dialogRef: MatDialogRef<ContenidoDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
    
  ) {}

  closeDialog() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }
}
