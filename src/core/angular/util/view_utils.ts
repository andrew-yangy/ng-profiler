import { LContext, MONKEY_PATCH_KEY_NAME } from "../interfaces/context";
import { CHILD_HEAD, HOST, LView } from "../interfaces/view";
import { isLView } from "../interfaces/type_checks";

export function readPatchedData(target: any): LView|LContext|null {
  return target[MONKEY_PATCH_KEY_NAME] || null;
}

export function readPatchedLView(target: any): LView|null {
  const value = readPatchedData(target);
  if (value) {
    return Array.isArray(value) ? value : (value as LContext).lView;
  }
  return null;
}

export function findAngularVersion(view: LView) {
  try {
    return view[CHILD_HEAD][HOST]['attributes'][0].value;
  } catch (e) {}
}

export function getComponentLViewByIndex(nodeIndex: number, hostView: LView): LView {
  // Could be an LView or an LContainer. If LContainer, unwrap to find LView.
  const slotValue = hostView[nodeIndex];
  const lView = isLView(slotValue) ? slotValue : slotValue[HOST];
  return lView;
}