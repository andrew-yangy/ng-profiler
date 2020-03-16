import { fromEvent, Observable, of } from "rxjs";
import { concatMapTo, filter, pluck, take } from "rxjs/operators";
import { Message, MESSAGE_SOURCE, MessageMethod, MessageType } from "./message.type";

export const createRequestMessage = (type: MessageType): Message => ({
  source: MESSAGE_SOURCE,
  method: MessageMethod.Request,
  type
});

export const createResponseMessage = <T>(type: MessageType, content: T): Message<T> => ({
  source: MESSAGE_SOURCE,
  method: MessageMethod.Response,
  type,
  content
});

export const observeMessage = <T>(message: Message): Observable<Message<T>> => {
  return of(window.postMessage(message, '*'))
    .pipe(
      concatMapTo(fromEvent<MessageEvent>(window, 'message')),
      pluck<MessageEvent, Message<T>>('data'),
      filter(m => m.method === MessageMethod.Response),
      filter(m => m.type === message.type),
      take(1),
    )
};
