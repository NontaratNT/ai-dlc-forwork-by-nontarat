import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeocodingComponent } from './geocoding.component';
import { FormsModule } from '@angular/forms';
import { 
  DxTextBoxModule, 
  DxButtonModule, 
  DxNumberBoxModule, 
  DxSelectBoxModule 
} from 'devextreme-angular';

@NgModule({
  declarations: [GeocodingComponent],
  imports: [
    CommonModule, 
    FormsModule, 
    DxTextBoxModule, 
    DxButtonModule, 
    DxNumberBoxModule, 
    DxSelectBoxModule
  ],
  exports: [GeocodingComponent]
})
export class GeocodingModule { }
