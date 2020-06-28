import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { filter, pluck } from "rxjs/operators";
import { SerializedTreeViewItem } from "../containers/component-tree/tree-diagram/tree-diagram.component";

@Injectable({
  providedIn: 'root'
})
export class ViewService {
  private selectedNode$ = new BehaviorSubject(null);
  private componentTreeView$ = new BehaviorSubject<SerializedTreeViewItem>(null);
  constructor() { }

  get selectedNode() {
    return this.selectedNode$.asObservable();
  }

  get componentTreeView() {
    return this.componentTreeView$.asObservable();
  }

  get nodeData() {
    return this.selectedNode.pipe(filter(Boolean), pluck('data'))
  }

  selectNode(node) {
    this.selectedNode$.next(node);
  }

  updateTreeView(treeView: SerializedTreeViewItem) {
    this.componentTreeView$.next(treeView);
  }
}
