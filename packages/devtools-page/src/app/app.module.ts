import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from "./shared/shared.module";
import { NZ_ICONS } from "ng-zorro-antd";
import { IconDefinition } from '@ant-design/icons-angular';
import { ZoomInOutline, ZoomOutOutline } from '@ant-design/icons-angular/icons';
import { ComponentTreeModule } from "./containers/component-tree/component-tree.module";
const icons: IconDefinition[] = [ ZoomInOutline, ZoomOutOutline ];

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    ComponentTreeModule
  ],
  providers: [{ provide: NZ_ICONS, useValue: icons }],
  bootstrap: [AppComponent]
})
export class AppModule { }
