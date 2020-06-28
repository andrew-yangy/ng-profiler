import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SplitPaneComponent } from "./split-pane/split-pane.component";
import { NzTabsModule } from "ng-zorro-antd/tabs";
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzLayoutModule } from "ng-zorro-antd/layout";
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NzCheckboxModule } from "ng-zorro-antd/checkbox";
import { NzTableModule } from "ng-zorro-antd";

const ZORRO_MODULES = [
  NzTabsModule,
  NzDescriptionsModule,
  NzSwitchModule,
  NzFormModule,
  NzLayoutModule,
  NzInputNumberModule,
  NzButtonModule,
  NzIconModule,
  NzCheckboxModule,
  NzTableModule
];

const CUSTOM_COMPONENTS = [
  SplitPaneComponent
];

@NgModule({
  declarations: [
    ...CUSTOM_COMPONENTS
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ...ZORRO_MODULES
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    ...CUSTOM_COMPONENTS,
    ...ZORRO_MODULES
  ]
})
export class SharedModule { }
