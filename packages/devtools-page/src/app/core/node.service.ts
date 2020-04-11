import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { filter, pluck } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class NodeService {
  private selected$ = new BehaviorSubject(null);
  constructor() { }

  get selectedNode() {
    return this.selected$.asObservable();
  }

  get nodeData() {
    return this.selectedNode.pipe(filter(Boolean), pluck('data'))
  }

  selectNode(node) {
    this.selected$.next(node);
  }
}
