import {Message, MESSAGE_SOURCE, MessageType} from "./communication/message.type";
import { createMessage, observeMessage } from "./communication/messager";

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
    isAngularApp();
  }
});

function isAngularApp() {
  observeMessage(createMessage(MessageType.IS_IVY)).subscribe(res => console.log(res));
}