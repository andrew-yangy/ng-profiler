import { FLAGS, HOST, LView, LViewFlags } from "../angular/interfaces/view";

export interface TreeViewItem {
  lView: LView;
  children: TreeViewItem[];
  currentViewRefIndex?: number;
  parent?: TreeViewItem;
  dynamicEmbeddedViewsChecked?: boolean;
}

export interface SerializedTreeViewItem {
  name: string;
  children: SerializedTreeViewItem[];
  onPush: boolean;
}

class TreeView {
  serialisedTreeView: SerializedTreeViewItem;

  setView = (treeView: TreeViewItem) => {
    this.serialisedTreeView = this.serialiseTreeViewItem(treeView[0]);
  };

  serialiseTreeViewItem(
    treeViewItem: TreeViewItem
  ): SerializedTreeViewItem {
    return {
      children: treeViewItem.children && treeViewItem.children.map(loopTreeViewItem =>
        this.serialiseTreeViewItem(loopTreeViewItem)
      ),
      name: treeViewItem.lView && treeViewItem.lView[HOST].localName,
      onPush: treeViewItem.lView && (treeViewItem.lView[FLAGS] & LViewFlags.CheckAlways) === 0
    };
  }
}
export const TreeViewFactory = new TreeView();