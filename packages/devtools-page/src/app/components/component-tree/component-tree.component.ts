import { Component, OnInit } from '@angular/core';
import { Message, MessageMethod, MessageType } from "../../../../../communication/message.type";
import { Connection } from "../../channel/connection";
import { debounceTime, tap } from "rxjs/operators";
import { COLORS } from "../../../../../core/constants";
import { Subject } from "rxjs";
import * as d3 from 'd3';

@Component({
  selector: 'component-tree',
  templateUrl: './component-tree.component.html',
  styleUrls: ['./component-tree.component.css']
})
export class ComponentTreeComponent implements OnInit {
  componentTreeView = this.connection.subscribeType(MessageType.COMPONENT_TREE);
  drawingPool: Subject<string> = new Subject();
  nodeMap = new Map();
  constructor(private connection: Connection) { }
  ngOnInit() {
    this.connection.bgConnection.postMessage({
      type: MessageType.COMPONENT_TREE,
      method: MessageMethod.Request,
    });

    this.connection.bgConnection.onMessage.addListener((message: Message<string>) => {
      if (message.method === MessageMethod.Response && message.type === MessageType.UPDATE_TREE) {
        const id = message.content;
        if (this.nodeMap.has(id)) {
          const previous = this.nodeMap.get(id);
          this.nodeMap.set(id, {rect: previous.rect, link: previous.link, time: previous.time + 1});
        } else {
          this.nodeMap.set(id, {rect: d3.select(`#r${id}`), link: d3.select(`#l${id}`), time: 1});
        }
        this.drawingPool.next(id);
      }
    });
    this.drawingPool.pipe(
      tap(this.updateRect),
      debounceTime(2000),
    ).subscribe(() => {
      this.resetRect();
    })
  }

  updateRect = (id: string) => {
    const node = this.nodeMap.get(id);
    const color = COLORS[Math.ceil(node.time / 2) - 1] || COLORS[COLORS.length - 1];
    node.rect.style('fill', () => color);
    node.link
      .attr('stroke', () => color)
      .attr('stroke-opacity', 1)
      .attr('stroke-width', 5);
  };

  resetRect = () => {
    this.nodeMap.forEach(({rect, link}, key, map) => {
      rect.style('fill', (d) => d._children ? 'lightsteelblue' : '#fff');
      link.attr('stroke', '#555')
        .attr('stroke-opacity', 0.6)
        .attr('stroke-width', 1.5);
      map.set(key, {rect, link, time: 1})
    });
  }
}
