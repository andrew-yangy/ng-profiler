import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeDiagramComponent } from './tree-diagram/tree-diagram.component';
import { MatTabsModule } from "@angular/material/tabs";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { SplitPaneComponent } from "./split-pane/split-pane.component";

const MATERIAL_MODULES = [
  MatTabsModule,
  MatButtonModule,
  MatIconModule
];

const CUSTOM_COMPONENTS = [
  TreeDiagramComponent,
  SplitPaneComponent
];

@NgModule({
  declarations: [
    ...CUSTOM_COMPONENTS
  ],
  imports: [
    CommonModule,
    ...MATERIAL_MODULES
  ],
  exports: [
    ...CUSTOM_COMPONENTS,
    ...MATERIAL_MODULES
  ]
})
export class SharedModule { }
