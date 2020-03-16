import { Message, MessageType } from "./communication/message.type";
import { createRequestMessage, createResponseMessage, observeMessage } from "./communication/messager";
import { pluck } from "rxjs/operators";
import { AngularInfo } from "./core";

const scriptInjection = new Set<string>();

const inject = (fn: (element: HTMLScriptElement) => void) => {
  const script = document.createElement('script');
  fn(script);
  document.documentElement.appendChild(script);
  script.parentNode.removeChild(script);
};

const injectScript = (path: string, onLoadHandler?: () => void) => {
  if (scriptInjection.has(path)) {
    return;
  }

  inject(script => {
    script.src = chrome.extension.getURL(path);
    if (onLoadHandler) {
      script.onload = onLoadHandler;
    }
  });

  scriptInjection.add(path);
};

const onInjectedScriptLoaded = () => {
  console.log('loaded');
  // chrome.storage.local.get('ngTraceEnabled', ({ngTraceEnabled}) => {
  //     promisedPostMessage.postMessage(ContentScriptEvents.TOGGLE_TRACING, {enabled: ngTraceEnabled});
  // });
};

injectScript('core.bundle.js', onInjectedScriptLoaded);

chrome.runtime.onMessage.addListener( (request: Message) => {
  if (request.type === MessageType.IS_IVY) {
    observeMessage<AngularInfo>(createRequestMessage(MessageType.IS_IVY))
      .pipe(pluck('content'))
      .subscribe(info => {
        chrome.runtime.sendMessage(createResponseMessage<AngularInfo>(MessageType.IS_IVY, info))
      });
  }
});
