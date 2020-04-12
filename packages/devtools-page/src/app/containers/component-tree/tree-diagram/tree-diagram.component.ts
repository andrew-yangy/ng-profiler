import { ChangeDetectionStrategy, Component, ElementRef, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { NodeService } from "../../../core/node.service";

export interface SerializedTreeViewItem {
  id: string;
  name: string;
  tagName: string;
  children: SerializedTreeViewItem[];
  parent: string;
  onPush: boolean;
}

@Component({
  selector: 'tree-diagram',
  templateUrl: './tree-diagram.component.html',
  styleUrls: ['./tree-diagram.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TreeDiagramComponent implements OnInit {
  @ViewChild('svgContainer', { static: true }) private svg: ElementRef;
  @Input()
  get treeData() {
    return this._treeData;
  }
  set treeData(tree: SerializedTreeViewItem ) {
    if(!tree) return ;
    if (!this.gLink || !this.gNode) {
      this.init();
    }
    this._treeData = tree;
    this.root = d3.hierarchy(tree);
    this.root.descendants().forEach((d, i) => {
      d.id = d.data.id;
      d.index = i;
      d._children = d.children;
      if (this.preSelected?.index === i ) {
        this.zone.run(() => this.nodeService.selectNode(d));
      }
    });
    this.render(this.root);
  };
  _treeData; gLink; gNode; root; preSelected; rectW = 150; rectH = 30; rect;

  constructor(private nodeService: NodeService, private zone: NgZone) { }

  ngOnInit(): void {
    if (!this.gLink || !this.gNode) {
      this.init();
    }
  }

  init() {
    const svg = d3.select(this.svg.nativeElement);
    this.gLink = svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 1.5);

    this.gNode = svg.append("g")
      .attr("user-select", "none");
  }

  render(source) {
    const margin = {
      top: 20,
      right: 100 + this.rectW,
      bottom: 200,
      left: 100
    };
    const tree = d3.tree().nodeSize([this.rectW + 10, this.rectH + 100]);
    const svg = d3.select(this.svg.nativeElement);
    const diagonal = d3.linkVertical().x(d => d.xl).y(d => d.yl);

    const duration = d3.event && d3.event.altKey ? 2500 : 250;
    const nodes = this.root.descendants().reverse();
    const links = this.root.links();

    // Compute the new tree layout.
    tree(this.root);

    let left = this.root;
    let right = this.root;
    let top = this.root;
    let bottom = this.root;
    this.root.eachBefore(node => {
      if (node.x < left.x) left = node;
      if (node.x > right.x) right = node;
      if (node.y < top.y) top = node;
      if (node.y > bottom.y) bottom = node;
    });

    const width = right.x - left.x + margin.right + margin.left;
    const height = bottom.y - top.y + margin.top + margin.bottom;
    this.root.x0 = 0;
    this.root.y0 = height/2;

    const transition = svg.transition()
      .duration(duration)
      .attr("viewBox", [left.x - margin.left, - margin.top, width, height])
      .tween("resize", () => () => svg.dispatch("toggle"));

    // Update the nodes…
    const node = this.gNode.selectAll("g")
      .data(nodes, d => d.data.id);

    // Enter any new nodes at the parent's previous position.
    const nodeEnter = node.enter().append("g")
      .attr("transform", d => `translate(${source.x0},${source.y0})`)
      .attr("fill-opacity", 0)
      .attr("stroke-opacity", 0)
      .style("cursor", "pointer")
      .on("click", this.clickNode);

    this.rect = nodeEnter.append("rect")
      .attr('id', (d) => 'r' + d.data.id)
      .attr("width", this.rectW)
      .attr("height", this.rectH)
      .attr("stroke", "black")
      .attr("stroke-width", 1)
      .style("fill", (d) => d._children ? "lightsteelblue" : "#fff");

    nodeEnter.append("text")
      .attr("x", this.rectW / 2)
      .attr("y", this.rectH / 2)
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .text((d) => d.data.name);

    // Transition nodes to their new position.
    node.merge(nodeEnter).transition(transition)
      .attr("transform", d => `translate(${d.x},${d.y})`)
      .attr("fill-opacity", 1)
      .attr("stroke-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    node.exit().transition(transition).remove()
      .attr("transform", d => `translate(${source.x},${source.y})`)
      .attr("fill-opacity", 0)
      .attr("stroke-opacity", 0);

    // Update the links…
    const link = this.gLink.selectAll("path")
      .data(links, d => d.target.id);

    // Enter any new links at the parent's previous position.
    const linkEnter = link.enter().append("path")
      .attr('id', (d) => 'l' + d.target.data.id)
      .attr("x", this.rectW / 2)
      .attr("y", this.rectH / 2);

    // Transition links to their new position.
    link.merge(linkEnter).transition(transition)
      .duration(duration)
      .attr("d", d => {
        const source = {
          ...d.source,
          xl: d.source.x + this.rectW / 2,
          yl: d.source.y + this.rectH
        };
        const target = {
          ...d.target,
          xl: d.target.x + this.rectW / 2,
          yl: d.target.y
        };
        return diagonal({source, target});
      });

    // Transition exiting nodes to the parent's new position.
    link.exit().remove()
      .attr("l", () => {
        const o = {x: source.x, y: source.y};
        return diagonal({source: o, target: o});
      });

    // Stash the old positions for transition.
    this.root.eachBefore(d => {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }

  clickNode = (d) => {
    d.children = d.children ? null : d._children;
    this.render(d);
    this.zone.run(() => this.nodeService.selectNode(d));
    this.preSelected?.selected?.style("fill", (d) => d._children ? "lightsteelblue" : "#fff");
    const selected = d3.select(`#r${d.id}`);
    selected.style('fill', () => 'lightgray');
    this.preSelected = {
      index: d.index,
      selected
    };
  };

  zoomIn() {
    const currentHeight = this.svg.nativeElement.clientHeight;
    this.svg.nativeElement.style.height = `${currentHeight * 2}px`;
  }

  zoomOut() {
    const currentHeight = this.svg.nativeElement.clientHeight;
    this.svg.nativeElement.style.height = `${currentHeight / 2}px`;
  }
}
