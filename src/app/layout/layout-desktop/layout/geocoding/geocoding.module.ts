import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeocodingComponent } from './geocoding.component';
import { FormsModule } from '@angular/forms';
import { DxTextBoxModule, DxButtonModule, DxNumberBoxModule, DxSelectBoxModule, DxTextAreaModule } from 'devextreme-angular';

@NgModule({
  declarations: [GeocodingComponent],
  imports: [
    CommonModule,
    FormsModule,
    DxTextBoxModule,
    DxButtonModule,
    DxNumberBoxModule,
    DxSelectBoxModule,
    DxTextAreaModule
],
  exports: [GeocodingComponent]
})
export class GeocodingModule { }
