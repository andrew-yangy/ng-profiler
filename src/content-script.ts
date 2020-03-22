import { Message, MessageMethod, MessageType } from "./communication/message.type";
import { createMessage, observeMessage } from "./communication/messager";
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
  if (request.method !== MessageMethod.Request) return;
  if (request.type === MessageType.IS_IVY) {
    observeMessage<AngularInfo>(
      createMessage(MessageType.IS_IVY, MessageMethod.Request)
    ).subscribe(info => {
      chrome.runtime.sendMessage(createMessage<AngularInfo>(MessageType.IS_IVY, MessageMethod.Response, info))
    });
  } else if (request.type === MessageType.TOGGLE_PROFILING) {
    observeMessage<boolean>(
      createMessage(MessageType.TOGGLE_PROFILING, MessageMethod.Request, request.content)
    )
  }
});
