import { Component, OnInit } from '@angular/core';
import { MessageType } from "../../../../../communication/message.type";
import { Connection } from "../../channel/connection";

@Component({
  selector: 'component-tree',
  templateUrl: './component-tree.component.html',
  styleUrls: ['./component-tree.component.css']
})
export class ComponentTreeComponent implements OnInit {
  componentTreeView = this.connection.subscribeType(MessageType.COMPONENT_TREE);
  constructor(private connection: Connection) { }
  ngOnInit() {
    this.componentTreeView.subscribe(res => {
      console.log(res);
    })
  }
}
