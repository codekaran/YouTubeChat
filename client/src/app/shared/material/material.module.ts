import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  MatButtonModule, 
  MatCardModule,
  MatDialog,
  MatDialogModule,
  MatIconModule, 
  MatFormFieldModule,
  MAT_DIALOG_DATA,
  MatInputModule,
  MatListModule,
  MatSidenavModule, 
  MatToolbarModule, 
} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule, 
    MatCardModule,
    MatDialogModule,
    MatIconModule, 
    MatFormFieldModule,
    MatInputModule, 
    MatListModule,
    MatSidenavModule, 
    MatToolbarModule, 
  ],
  exports: [
    MatButtonModule, 
    MatCardModule,
    MatDialogModule,
    MatIconModule, 
    MatFormFieldModule,
    MatInputModule, 
    MatListModule,
    MatSidenavModule, 
    MatToolbarModule, 
  ],
  declarations: [],
  providers: [
    MatDialog,
  ]
})
export class MaterialModule { }
