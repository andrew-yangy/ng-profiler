import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerformanceComponent } from './performance.component';
import { SharedModule } from "@devtools-page/shared/shared.module";



@NgModule({
  declarations: [PerformanceComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [PerformanceComponent]
})
export class PerformanceModule { }
