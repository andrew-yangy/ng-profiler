import { Message, MessageMethod, MessageType } from "./communication/message.type";
import { createMessage, observeMessage, observeRequest } from "./communication/messager";
import { AngularInfo } from "./core";
import { filter } from "rxjs/operators";

const scriptInjection = new Set<string>();

const inject = (fn: (element: HTMLScriptElement) => void) => {
  const script = document.createElement('script') as HTMLScriptElement;
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
  chrome.storage.local.get('ngProfilerEnabled', (content) => {
    handler[MessageType.TOGGLE_PROFILING]({content});
  });
};

injectScript('core.bundle.js', onInjectedScriptLoaded);

chrome.runtime.onMessage.addListener( (request: Message) => {
  if (request.method !== MessageMethod.Request) return;
  handler[request.type](request);
});

observeRequest<string>(MessageType.COMPONENT_TREE).subscribe(tree => {
  chrome.runtime.sendMessage(createMessage(MessageType.COMPONENT_TREE, MessageMethod.Response, tree))
});

observeRequest<string>(MessageType.UPDATE_TREE).pipe(filter(id => !!id)).subscribe(componentId => {
  chrome.runtime.sendMessage(createMessage<string>(MessageType.UPDATE_TREE, MessageMethod.Response, componentId))
});

const handler = {
  [MessageType.IS_IVY]: () => {
    observeMessage<AngularInfo>(
      createMessage(MessageType.IS_IVY, MessageMethod.Request)
    ).subscribe(info => {
      chrome.runtime.sendMessage(createMessage<AngularInfo>(MessageType.IS_IVY, MessageMethod.Response, info))
    });
  },
  [MessageType.TOGGLE_PROFILING]: (request) => {
    observeMessage<boolean>(
      createMessage(MessageType.TOGGLE_PROFILING, MessageMethod.Request, request.content)
    )
  },
  [MessageType.COMPONENT_TREE]: () => {
    observeMessage<boolean>(
      createMessage(MessageType.COMPONENT_TREE, MessageMethod.Request)
    ).subscribe(tree => {
      chrome.runtime.sendMessage(createMessage(MessageType.COMPONENT_TREE, MessageMethod.Response, tree))
    });
  },
  [MessageType.APPLY_CHANGES]: (request) => {
    observeMessage<boolean>(
      createMessage(MessageType.APPLY_CHANGES, MessageMethod.Request, request.content)
    )
  },
};
