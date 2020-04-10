import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeDiagramComponent } from './tree-diagram/tree-diagram.component';
import { SplitPaneComponent } from "./split-pane/split-pane.component";
import { NzTabsModule } from "ng-zorro-antd/tabs";
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzLayoutModule } from "ng-zorro-antd/layout";
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

const ZORRO_MODULES = [
  NzTabsModule,
  NzDescriptionsModule,
  NzSwitchModule,
  NzFormModule,
  NzLayoutModule,
  NzInputNumberModule,
  NzButtonModule,
  NzIconModule
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
    ...ZORRO_MODULES
  ],
  exports: [
    ...CUSTOM_COMPONENTS,
    ...ZORRO_MODULES
  ]
})
export class SharedModule { }
