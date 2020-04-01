import { Injectable, NgZone } from '@angular/core';
import { from } from "rxjs";
import { Message, MessageMethod, MessageType } from "../../../../communication/message.type";

declare const chrome: any;


@Injectable({
  providedIn: 'root',
})
export class Connection {
  bgConnection;

  constructor(private zone: NgZone) {
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
    return from(new Promise((resolve) => {
      this.bgConnection.onMessage.addListener((message: Message) => {
        if (message.method === MessageMethod.Response && message.type === type) {
          resolve(message.content)
        }
      })
    }));
  }
}
