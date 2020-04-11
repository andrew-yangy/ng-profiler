import { fromEvent, Observable, of } from "rxjs";
import { concatMapTo, filter, pluck, take } from "rxjs/operators";
import { Message, MESSAGE_SOURCE, MessageMethod, MessageType } from "./message.type";

export const createMessage = <T>(type: MessageType, method: MessageMethod, content?: T,): Message<T> => ({
  source: MESSAGE_SOURCE,
  method,
  type,
  content
});

export const observeMessage = <T>(message: Message): Observable<T> => {
  return of(window.postMessage(message, '*'))
    .pipe(
      concatMapTo(fromEvent<MessageEvent>(window, 'message')),
      pluck<MessageEvent, Message<T>>('data'),
      filter(m => m.method === MessageMethod.Response),
      filter(m => m.type === message.type),
      take(1),
      pluck<Message<T>, T>('content')
    )
};

export const observeResponse = <T>(type: MessageType): Observable<T> => {
  return fromEvent<MessageEvent>(window, 'message')
    .pipe(
      pluck<MessageEvent, Message<T>>('data'),
      filter(m => m.method === MessageMethod.Response),
      filter(m => m.type === type),
      pluck<Message<T>, T>('content')
    )
};
