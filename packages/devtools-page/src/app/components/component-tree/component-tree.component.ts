import { Component, Input, OnInit } from '@angular/core';
import { SerializedTreeViewItem } from "../../../../../core/util/treeView";

@Component({
  selector: 'component-tree',
  templateUrl: './component-tree.component.html',
  styleUrls: ['./component-tree.component.css']
})
export class ComponentTreeComponent implements OnInit {
  @Input() componentTree: SerializedTreeViewItem;

  constructor() { }
  ngOnInit() {}
}
