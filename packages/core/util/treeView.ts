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

export function serialiseTreeViewItem(
  treeViewItem: TreeViewItem
): SerializedTreeViewItem {
  return {
    children: treeViewItem.children && treeViewItem.children.map(loopTreeViewItem =>
      serialiseTreeViewItem(loopTreeViewItem)
    ),
    name: treeViewItem.lView && treeViewItem.lView[HOST].localName,
    onPush: treeViewItem.lView && (treeViewItem.lView[FLAGS] & LViewFlags.CheckAlways) === 0
  };
}