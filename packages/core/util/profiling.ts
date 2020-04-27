import { getRootView } from "../angular/util/view_traversal_utils";
import { CONTEXT, RootContext } from "../angular/interfaces/view";
import { readPatchedLView } from "../angular/util/view_utils";
import { CanvasFactory } from "./canvas";
import { SerializedTreeViewItem, TreeViewFactory } from "./treeView";

export const startProfiling = () => {
  CanvasFactory.create();

  TreeViewFactory.enable();

  patchComponentTree();
};

export const stopProfiling = () => {
  TreeViewFactory.disable();
};

export const patchComponentTree = (generateSerialisedTreeView?: (serialisedTreeView: SerializedTreeViewItem) => void) => {
  const view = TreeViewFactory.bodyLView;
  const root = getRootView(view);
  const rootComponent = (root[CONTEXT] as RootContext).components[0];
  const rootComponentLView = readPatchedLView(rootComponent);
  TreeViewFactory.attachComponent(rootComponentLView, (treeView) => {
    TreeViewFactory.setView(treeView);
    generateSerialisedTreeView && generateSerialisedTreeView(TreeViewFactory.serialisedTreeView);
  });
};
