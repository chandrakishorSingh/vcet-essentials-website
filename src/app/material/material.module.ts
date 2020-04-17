import {NgModule} from '@angular/core';

import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatListModule} from '@angular/material/list';
import {BottomSheetComponent} from './bottom-sheet/bottom-sheet.component';
import {ModalComponent} from './modal/modal.component';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSelectModule} from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';
import {MatTreeModule} from '@angular/material/tree';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { GenericModalComponent } from './generic-modal/generic-modal.component';
import {MatExpansionModule} from '@angular/material/expansion';

@NgModule({
  declarations: [
    BottomSheetComponent,
    ModalComponent,
    GenericModalComponent
  ],
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSnackBarModule,
    MatBottomSheetModule,
    MatListModule,
    MatGridListModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatTooltipModule,
    MatSelectModule,
    MatIconModule,
    MatCheckboxModule,
    MatExpansionModule
  ],
  exports: [
    MatToolbarModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSnackBarModule,
    MatBottomSheetModule,
    MatListModule,
    MatGridListModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatTooltipModule,
    MatSelectModule,
    MatIconModule,
    MatCheckboxModule,
    MatExpansionModule
  ]
})
export class AngularMaterialModule {}
