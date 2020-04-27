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
  const childNodes = target.childNodes;
  for (let i = 0; i < childNodes.length; i++) {
    const childNode = childNodes[i];
    let mpValue = readPatchedLView(childNode);
    if (mpValue) {
      return mpValue;
    } else {
      const mpValueChildren = findLView(childNode);
      if (mpValueChildren) {
        return mpValueChildren;
      }
    }
  }
}