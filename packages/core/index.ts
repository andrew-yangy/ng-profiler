import { Message, MESSAGE_SOURCE, MessageMethod, MessageType } from "../communication/message.type";
import { findLView } from "./angular/render3/context_discovery";
import { findAngularVersion } from "./angular/util/view_utils";
import { createMessage } from "../communication/messager";
import { startProfiling, stopProfiling } from "./util/profiling";

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

  let content: AngularInfo | string;
  if (data.type === MessageType.IS_IVY) {
    const view = findLView();
    content = {
      isIvy: !!view,
      version: findAngularVersion(view)
    }
  } else if (data.type === MessageType.TOGGLE_PROFILING) {
    data.content ? startProfiling() : stopProfiling();
  }

  postMessage(createMessage(data.type, MessageMethod.Response, content), '*');
}

window.addEventListener('message', handleMessage);