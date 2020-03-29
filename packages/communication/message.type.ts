export const MESSAGE_SOURCE = 'NG_PROFILER';

export interface Message<T = {}> {
  id?: string;
  source?: string;
  type?: MessageType;
  method?: MessageMethod;
  content?: T;
}

export enum MessageMethod {
  Request = 'request',
  Response = 'response'
}

export enum MessageType {
  TOGGLE_PROFILING,
  IS_IVY
}