import { Component, Input, OnInit } from '@angular/core';
import { SerializedTreeViewItem } from "../../shared/tree-diagram/tree-diagram.component";

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
