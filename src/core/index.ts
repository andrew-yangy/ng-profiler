import { Message, MESSAGE_SOURCE, MessageMethod, MessageType } from "../communication/message.type";

function handleMessage(e: MessageEvent) {
  if (!e.data) {
    return;
  }

  const data: Message = e.data;

  if (!data || data.source !== MESSAGE_SOURCE || data.method !== MessageMethod.Request) {
    return;
  }

  let content;
  if (data.type === MessageType.IS_IVY) {
    content = true;
  }

  const messageToSend: Message = {
    type: data.type,
    method: MessageMethod.Response,
    content
  };
  postMessage(messageToSend, '*');
}

window.addEventListener('message', handleMessage);