import { Message, MESSAGE_SOURCE, MessageMethod, MessageType } from "../communication/message.type";
import { findLView } from "./render3/context_discovery";
import { findAngularVersion } from "./util/view_utils";

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

  let content: AngularInfo;
  if (data.type === MessageType.IS_IVY) {
    const view = findLView();
    content = {
      isIvy: !!view,
      version: findAngularVersion(view)
    }
  }

  const messageToSend: Message = {
    type: data.type,
    method: MessageMethod.Response,
    content
  };
  postMessage(messageToSend, '*');
}

window.addEventListener('message', handleMessage);