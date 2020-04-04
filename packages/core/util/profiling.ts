import { findLView } from "../angular/render3/context_discovery";
import { getRootView } from "../angular/util/view_traversal_utils";
import { CONTEXT, RootContext } from "../angular/interfaces/view";
import { readPatchedLView } from "../angular/util/view_utils";
import { CanvasFactory } from "./canvas";
import { TreeViewFactory } from "./treeView";

export const startProfiling = () => {
  const view = findLView();
  const root = getRootView(view);
  const rootComponent = (root[CONTEXT] as RootContext).components[0];
  const rootComponentLView = readPatchedLView(rootComponent);

  CanvasFactory.create();

  TreeViewFactory.attachComponent(rootComponentLView, TreeViewFactory.setView)
  console.log(rootComponentLView);
};

export const stopProfiling = () => {
  console.log('stop');
};
