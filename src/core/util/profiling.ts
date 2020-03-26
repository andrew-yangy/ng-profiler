import { findLView } from "../angular/render3/context_discovery";
import { getRootView } from "../angular/util/view_traversal_utils";
import { CONTEXT, LView, RootContext, TView, TVIEW } from "../angular/interfaces/view";
import { getComponentLViewByIndex, readPatchedLView } from "../angular/util/view_utils";
import { RenderFlags } from "../angular/interfaces/definition";

export const startProfiling = () => {
  const view = findLView();
  const root = getRootView(view);
  const rootComponent = (root[CONTEXT] as RootContext).components[0];
  const rootComponentLView = readPatchedLView(rootComponent);

  const childComponents = rootComponentLView[TVIEW].components;
  if (childComponents !== null) {
    attachChildComponents(rootComponentLView, childComponents);
  }
};

export const stopProfiling = () => {
  console.log('stop');
};

export const attachChildComponents = (hostLView: LView, components: number[]) => {
  for (let i = 0; i < components.length; i++) {
    attachComponent(hostLView, components[i]);
  }
};

const attachComponent = (hostLView: LView, componentHostIndex: number) => {
  const componentView = getComponentLViewByIndex(componentHostIndex, hostLView);
  const componentTView = componentView[TVIEW];
  attachTemplate(componentTView);
  const childComponents = componentTView.components;
  if (childComponents !== null) {
    attachChildComponents(componentView, childComponents);
  }
};

export const attachTemplate = (tView: TView) => {
  const originTemplate = tView.template;
  if (!originTemplate) return ;
  tView.template = (...args) => {
    originTemplate(...args);
    if (args[0] === RenderFlags.Update) {
      console.log(args, tView.type, 'change');
    }
  }
};