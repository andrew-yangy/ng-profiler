import { LView } from "../angular/interfaces/view";

export interface TreeViewItem {
  lView: LView;
  children: TreeViewItem[];
  currentViewRefIndex?: number;
  parent?: TreeViewItem;
  dynamicEmbeddedViewsChecked?: boolean;
}