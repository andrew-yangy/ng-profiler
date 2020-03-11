import { fromEvent, of } from "rxjs";
import { concatMapTo, filter, pluck, take } from "rxjs/operators";
import { Message, MESSAGE_SOURCE, MessageMethod, MessageType } from "./message.type";

export const createMessage = (type: MessageType): Message => ({
  source: MESSAGE_SOURCE,
  method: MessageMethod.Request,
  type
});

export const observeMessage = (message: Message) => {
  return of(window.postMessage(message, '*'))
    .pipe(
      concatMapTo(fromEvent<MessageEvent>(window, 'message')),
      pluck<MessageEvent, Message>('data'),
      filter(m => m.method === MessageMethod.Response),
      filter(m => m.type === message.type),
      take(1),
    )
};
