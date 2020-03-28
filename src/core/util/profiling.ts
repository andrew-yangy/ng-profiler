import { findLView } from "../angular/render3/context_discovery";
import { getRootView } from "../angular/util/view_traversal_utils";
import { CONTEXT, HOST, LView, RootContext, TVIEW } from "../angular/interfaces/view";
import { getComponentLViewByIndex, readPatchedLView } from "../angular/util/view_utils";
import { RenderFlags } from "../angular/interfaces/definition";
import { CanvasFactory } from "./canvas";
import { scheduleOutsideOfZone } from "./zone";
import { TreeViewItem } from "./treeView";

export const startProfiling = () => {
  const view = findLView();
  const root = getRootView(view);
  const rootComponent = (root[CONTEXT] as RootContext).components[0];
  const rootComponentLView = readPatchedLView(rootComponent);

  CanvasFactory.create();
  const childComponents = rootComponentLView[TVIEW].components;

  const addElement = (treeView: TreeViewItem) => {
    console.log(treeView);
  };
  if (childComponents !== null) {
    attachChildComponents(rootComponentLView, childComponents, addElement);
  }
};

export const stopProfiling = () => {
  console.log('stop');
};

export const attachChildComponents = (hostLView: LView, components: number[], addChildElement) => {
  const children = [];

  const addElement = (treeViewItem) => {
    children.push(treeViewItem);
  };
  for (let i = 0; i < components.length; i++) {
    attachComponent(hostLView, components[i], addElement);
  }
  addChildElement(children);
};

const attachComponent = (hostLView: LView, componentHostIndex: number, addElement) => {
  const componentView = getComponentLViewByIndex(componentHostIndex, hostLView);
  const componentTView = componentView[TVIEW];
  const treeView = {
    lView: componentView,
    currentViewRefIndex: componentHostIndex,
    children: []
  };
  const addChildElement = (res) => {
    treeView.children = res;
  };
  attachTemplate(componentView);
  const childComponents = componentTView.components;
  if (childComponents !== null) {
    attachChildComponents(componentView, childComponents, addChildElement);
  }
  addElement(treeView);
};

export const attachTemplate = (lView: LView) => {
  const tView = lView[TVIEW];
  const originTemplate = tView.template;
  if (!originTemplate) return ;
  tView.template = (...args) => {
    originTemplate(...args);
    if (args[0] === RenderFlags.Update) {
      scheduleOutsideOfZone(() => {
        CanvasFactory.draw(lView[HOST].localName, lView[HOST].getBoundingClientRect());
      })
    }
  }
};