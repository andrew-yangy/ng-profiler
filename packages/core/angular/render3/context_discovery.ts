import { LView } from "../interfaces/view";
import { readPatchedLView } from "../util/view_utils";

export function isComponentInstance(instance: any): boolean {
  return instance && instance.constructor && instance.constructor.ɵcmp;
}

export function isDirectiveInstance(instance: any): boolean {
  return instance && instance.constructor && instance.constructor.ɵdir;
}

export function isProvidereInstance(instance: any): boolean {
  return instance && instance.constructor && instance.constructor.ɵprov;
}

export function findLView(target: HTMLElement | ChildNode | Node): LView|null {
  if (!target || !target.childNodes) {
    return;
  }

  let queue: (HTMLElement | ChildNode)[];
  queue.push(target);

  while (queue.length > 0) {
    const currentNode = queue.shift();
    if (currentNode != target) {
      let mpValue = readPatchedLView(currentNode);
      if (mpValue) {
        return mpValue;
      }
    }

    if (!!currentNode.childNodes && currentNode.childNodes.length > 0) {
      const childNodes = currentNode.childNodes;
      for (let i = 0; i < childNodes.length; i++) {
        queue.push(childNodes[i]);
      }
    }
  }

  return null;
}