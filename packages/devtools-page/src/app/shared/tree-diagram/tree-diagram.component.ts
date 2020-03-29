import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'tree-diagram',
  templateUrl: './tree-diagram.component.html',
  styleUrls: ['./tree-diagram.component.css']
})
export class TreeDiagramComponent implements AfterViewInit {
  @ViewChild('svgContainer', { static: true }) private svg: ElementRef;
  @Input() treeData;
  gLink; gNode; root; rectW = 100; rectH = 30;
  constructor() { }

  ngAfterViewInit(): void {
    this.root = d3.hierarchy(this.treeData);

    this.root.descendants().forEach((d, i) => {
      d.id = i;
      d._children = d.children;
    });
    const svg = d3.select(this.svg.nativeElement);
    this.gLink = svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5);

    this.gNode = svg.append("g")
      .attr("cursor", "pointer")
      .attr("pointer-events", "all");
    this.render(this.root);
  }

  render(source) {
    const margin = {
      top: 20,
      right: 0,
      bottom: 20,
      left: 120
    };
    const tree = d3.tree().nodeSize([120, 60]);
    const svg = d3.select(this.svg.nativeElement);
    const diagonal = d3.linkHorizontal().x(d => d.x + this.rectW / 2).y(d => d.y + this.rectH / 2);

    const duration = d3.event && d3.event.altKey ? 2500 : 250;
    const nodes = this.root.descendants().reverse();
    const links = this.root.links();

    // Compute the new tree layout.
    tree(this.root);

    let left = this.root;
    let right = this.root;
    this.root.eachBefore(node => {
      if (node.x < left.x) left = node;
      if (node.x > right.x) right = node;
    });
    const width = 960 - margin.right - margin.left;
    const height = 800 - margin.top - margin.bottom;
    this.root.x0 = 0;
    this.root.y0 = height / 2;
    const transition = svg.transition()
      .duration(duration)
      .attr("viewBox", [left.x - margin.left, - margin.top, width, height])
      .tween("resize", () => () => svg.dispatch("toggle"));

    // Update the nodes…
    const node = this.gNode.selectAll("g")
      .data(nodes, d => d.id);

    // Enter any new nodes at the parent's previous position.
    const nodeEnter = node.enter().append("g")
      .attr("transform", d => `translate(${source.x0},${source.y0})`)
      .attr("fill-opacity", 0)
      .attr("stroke-opacity", 0)
      .on("click", d => {
        d.children = d.children ? null : d._children;
        this.render(d);
      });

    nodeEnter.append("rect")
      .attr("width", this.rectW)
      .attr("height", this.rectH)
      .attr("stroke", "black")
      .attr("stroke-width", 1)
      .style("fill", (d) => {
        return d._children ? "lightsteelblue" : "#fff";
      });

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
      .attr("x", this.rectW / 2)
      .attr("y", this.rectH / 2)
      .attr("d", d => {
        const o = {x: source.x0, y: source.y0};
        return diagonal({source: o, target: o});
      });

    // Transition links to their new position.
    link.merge(linkEnter).transition(transition)
      .attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition(transition).remove()
      .attr("d", d => {
        const o = {x: source.x, y: source.y};
        return diagonal({source: o, target: o});
      });

    // Stash the old positions for transition.
    this.root.eachBefore(d => {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }
}
