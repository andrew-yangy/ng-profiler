import { Component, NgZone, OnInit } from '@angular/core';
import { Message, MessageMethod, MessageType } from "@communication/message.type";
import { Connection } from "@devtools-page/channel/connection";
import { ViewProfile } from "@core/util/treeView";
import { ViewService } from "@devtools-page/core/view.service";
import { SerializedTreeViewItem } from "@devtools-page/containers/component-tree/tree-diagram/tree-diagram.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  highlightView: boolean;
  highlightTree: boolean;

  constructor(private connection: Connection, public viewService: ViewService, private zone: NgZone) {}

  ngOnInit() {
    this.connection.bgConnection.postMessage({
      type: MessageType.COMPONENT_TREE,
      method: MessageMethod.Request,
    });
    // TODO: clean this shit
    this.connection.bgConnection.onMessage.addListener((message: Message<boolean | ViewProfile | SerializedTreeViewItem | string>) => {
      if (message.method === MessageMethod.Request) {
        if (message.type === MessageType.TOGGLE_PROFILING) {
          if (message.content) {
            this.connection.bgConnection.postMessage({
              type: MessageType.COMPONENT_TREE,
              method: MessageMethod.Request,
            });
          } else {
            this.viewService.updateTreeView(null);
          }
        }
      } else if (message.method === MessageMethod.Response) {
        if (message.type === MessageType.HIGHLIGHT_VIEW) {
          this.zone.run(() => {this.highlightView = <boolean>message.content});
        }
        if (message.type === MessageType.HIGHLIGHT_TREE) {
          this.zone.run(() => {this.highlightTree = <boolean>message.content});
        }
        if (message.type === MessageType.COMPONENT_TREE) {
          console.log(message.content);
          this.zone.run(() => {this.viewService.updateTreeView(<SerializedTreeViewItem>message.content);});
        }
        if (message.type === MessageType.UPDATE_TREE) {
          const id = <string>message.content;
          this.viewService.updateTreeId(id);
        }

        if (message.type === MessageType.VIEW_PROFILES) {
          // this.profile.addProfile(message.content as ViewProfile);
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
