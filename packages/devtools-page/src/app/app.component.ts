import { Component, NgZone, OnInit } from '@angular/core';
import { Message, MessageMethod, MessageType } from "@communication/message.type";
import { Connection } from "@devtools-page/channel/connection";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  highlightView: boolean;
  highlightTree: boolean;

  constructor(private connection: Connection, private zone: NgZone) {}

  ngOnInit() {
    // TODO: clean this shit
    this.connection.bgConnection.onMessage.addListener((message: Message<boolean>) => {
      if (message.method === MessageMethod.Response) {
        console.log(message);
        if (message.type === MessageType.HIGHLIGHT_VIEW) {
          this.zone.run(() => {this.highlightView = message.content});
        }
        if (message.type === MessageType.HIGHLIGHT_TREE) {
          this.zone.run(() => {this.highlightTree = message.content});
        }
      }
    })
  }

  updateHighlightView(content) {
    this.connection.bgConnection.postMessage({
      type: MessageType.HIGHLIGHT_VIEW,
      method: MessageMethod.Request,
      content
    });
  }

  updateHighlightTree(content) {
    this.connection.bgConnection.postMessage({
      type: MessageType.HIGHLIGHT_TREE,
      method: MessageMethod.Request,
      content
    });
  }
}
