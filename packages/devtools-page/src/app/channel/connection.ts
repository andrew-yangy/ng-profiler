import { Injectable, NgZone } from '@angular/core';

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
}
