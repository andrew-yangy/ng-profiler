import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentTreeComponent } from "./component-tree.component";
import { TreeDiagramComponent } from "./tree-diagram/tree-diagram.component";
import { SharedModule } from "../../shared/shared.module";
import { ComponentInfoComponent } from "./component-info/component-info.component";

@NgModule({
  declarations: [
    ComponentTreeComponent,
    TreeDiagramComponent,
    ComponentInfoComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    ComponentTreeComponent
  ]
})
export class ComponentTreeModule { }
