import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Residenza } from '../../models/residenza.model';

@Component({
  selector: 'app-residenza-edit-dialog',
  templateUrl: './residenza-edit-dialog.component.html',
  styleUrls: ['./residenza-edit-dialog.component.css']
})
export class ResidenzaEditDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ResidenzaEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Residenza
  ) {}

  onNoClick(): void {
    this.dialogRef.close();  
  }

  
}