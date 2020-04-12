export const MESSAGE_SOURCE = 'NG_PROFILER';

export interface Message<T = any> {
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
  TOGGLE_PROFILING = 'TOGGLE_PROFILING',
  IS_IVY = 'IS_IVY',
  COMPONENT_TREE = 'COMPONENT_TREE',
  UPDATE_TREE = 'UPDATE_TREE',
  APPLY_CHANGES = 'APPLY_CHANGES',
  HIGHLIGHT_ELEMENT = 'HIGHLIGHT_ELEMENT'
}