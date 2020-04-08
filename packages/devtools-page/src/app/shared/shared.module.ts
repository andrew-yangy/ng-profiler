import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeDiagramComponent } from './tree-diagram/tree-diagram.component';
import { MatTabsModule } from "@angular/material/tabs";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";



@NgModule({
  declarations: [TreeDiagramComponent],
  imports: [
    CommonModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule
  ],
  exports: [
    TreeDiagramComponent,
    MatTabsModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class SharedModule { }
