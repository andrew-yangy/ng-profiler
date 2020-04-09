import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentTreeComponent } from './components/component-tree/component-tree.component';
import { SharedModule } from "./shared/shared.module";
import { ComponentInfoComponent } from './components/component-info/component-info.component';

@NgModule({
  declarations: [
    AppComponent,
    ComponentTreeComponent,
    ComponentInfoComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
