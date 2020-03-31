import { Injectable } from '@angular/core';
import { fromEventPattern, Observable } from "rxjs";
import { filter, pluck } from "rxjs/operators";
import { Message, MessageMethod, MessageType } from "../../../../communication/message.type";
import { SerializedTreeViewItem } from "../shared/tree-diagram/tree-diagram.component";
declare const chrome: any;


@Injectable({
  providedIn: 'root',
})
export class Connection {
  bgConnection;

  constructor() {
    this.connect();
  }

  connect() {
    try {
      const name = chrome.devtools.inspectedWindow.tabId.toString() || 'tab';
      this.bgConnection = chrome.runtime.connect({ name });
      console.log(name, this.bgConnection);
    } catch (e) {
      console.log(e);
    }
  }

  subscribeType(type: MessageType) {
    this.bgConnection.postMessage({
      type,
      method: MessageMethod.Request,
    });
    return fromEventPattern(
      handler => this.bgConnection.onMessage.addListener(handler),
      handler => this.bgConnection.onMessage.removeListener(handler),
      (request) => (request)
    ).pipe(
      filter(request => request.method === MessageMethod.Response),
      filter(request => request.type === type),
      pluck('content'),
      filter(Boolean),
    )
  }
}
