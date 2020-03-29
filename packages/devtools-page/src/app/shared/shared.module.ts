import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeDiagramComponent } from './tree-diagram/tree-diagram.component';
import { MatTabsModule } from "@angular/material/tabs";



@NgModule({
  declarations: [TreeDiagramComponent],
  imports: [
    CommonModule,
    MatTabsModule
  ],
  exports: [
    TreeDiagramComponent,
    MatTabsModule
  ]
})
export class SharedModule { }
