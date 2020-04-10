import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeDiagramComponent } from './tree-diagram/tree-diagram.component';
import { MatTabsModule } from "@angular/material/tabs";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { SplitPaneComponent } from "./split-pane/split-pane.component";
import { MatInputModule } from "@angular/material/input";
import { MatTreeModule } from "@angular/material/tree";
import { MatExpansionModule } from "@angular/material/expansion";
import { NzTabsModule } from "ng-zorro-antd/tabs";
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzLayoutModule } from "ng-zorro-antd/layout";
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';

const MATERIAL_MODULES = [
  MatTabsModule,
  MatButtonModule,
  MatIconModule,
  MatInputModule,
  MatTreeModule,
  MatExpansionModule
];

const ZORRO_MODULES = [
  NzTabsModule,
  NzDescriptionsModule,
  NzSwitchModule,
  NzFormModule,
  NzLayoutModule,
  NzInputNumberModule
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
    ...MATERIAL_MODULES,
    ...ZORRO_MODULES
  ],
  exports: [
    ...CUSTOM_COMPONENTS,
    ...MATERIAL_MODULES,
    ...ZORRO_MODULES
  ]
})
export class SharedModule { }
