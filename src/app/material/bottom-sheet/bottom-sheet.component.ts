import {Component} from '@angular/core';
import {MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {POST_TYPE} from '../../types/types';

@Component({
  selector: 'app-bottom-sheet',
  templateUrl: './bottom-sheet.component.html'
})
export class BottomSheetComponent {

  constructor(private bottomSheetRef: MatBottomSheetRef) {}

  onClick(postType: POST_TYPE) {
    this.bottomSheetRef.dismiss({ postType });
  }
}
