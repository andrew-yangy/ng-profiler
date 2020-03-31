import { Component, OnInit } from '@angular/core';
import { Connection } from "./channel/connection";
import { MessageType } from "../../../communication/message.type";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  componentTreeView = this.connection.subscribeType(MessageType.TOGGLE_PROFILING);
  constructor(private connection: Connection) {}

  ngOnInit() {
    this.connection.subscribeType(MessageType.TOGGLE_PROFILING).subscribe(res => {
      console.log(res);
    })
  }

}
