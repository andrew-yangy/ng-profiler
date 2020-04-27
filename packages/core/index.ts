import { Message, MESSAGE_SOURCE, MessageMethod, MessageType } from "../communication/message.type";
import { findAngularVersion } from "./angular/util/view_utils";
import { createMessage } from "../communication/messager";
import { patchComponentTree, startProfiling, stopProfiling } from "./util/profiling";
import { TreeViewFactory } from "./util/treeView";
import { CanvasFactory } from "./util/canvas";
import { scheduleOutsideOfZone } from "./util/zone";

export interface AngularInfo {
  isIvy: boolean,
  version: string
}

function handleMessage(e: MessageEvent) {
  if (!e.data) {
    return;
  }

  const data: Message = e.data;

  if (!data || data.source !== MESSAGE_SOURCE || data.method !== MessageMethod.Request) {
    return;
  }

  let content: AngularInfo | any;
  const view = TreeViewFactory.bodyLView;
  if (data.type === MessageType.IS_IVY) {
    content = {
      isIvy: !!view,
      version: findAngularVersion(view)
    }
  } else if (data.type === MessageType.TOGGLE_PROFILING) {
    data.content && !!view ? startProfiling() : stopProfiling();
  } else if (data.type === MessageType.COMPONENT_TREE) {
    content = TreeViewFactory.serialisedTreeView;
  } else if (data.type === MessageType.APPLY_CHANGES) {
    TreeViewFactory.applyChanges(data.content);
  } else if (data.type === MessageType.HIGHLIGHT_ELEMENT) {
    scheduleOutsideOfZone(() => {
      if (data.content) {
        CanvasFactory.highlight(TreeViewFactory.treeLViewMap.get(data.content));
      } else {
        CanvasFactory.clear();
      }
    });
  } else if (data.type === MessageType.HIGHLIGHT_VIEW) {
    if (data.content !== undefined) {
      TreeViewFactory.highlightView = data.content;
    }
    content = TreeViewFactory.highlightView;
  } else if (data.type === MessageType.HIGHLIGHT_TREE) {
    if (data.content !== undefined) {
      TreeViewFactory.highlightTree = data.content;
    }
    content = TreeViewFactory.highlightTree;
  }

  postMessage(createMessage(data.type, MessageMethod.Response, content), '*');
}

window.addEventListener('message', handleMessage);

const listener = (type: string) => {
  const origin = history[type];
  return function () {
    if (TreeViewFactory.bodyLView && TreeViewFactory.enabled) {
      setTimeout(() => {
        patchComponentTree((serialisedTreeView) => {
          postMessage(createMessage(MessageType.COMPONENT_TREE, MessageMethod.Response, serialisedTreeView), '*');
        });
      });
    }
    return origin.apply(this, arguments)
  }
};

window.history.pushState = listener('pushState');
window.history.replaceState = listener('replaceState');