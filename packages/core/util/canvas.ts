import { Subject } from "rxjs";
import { debounceTime, tap } from "rxjs/operators";
import { COLORS } from "../constants";

class Canvas {
  canvas: HTMLCanvasElement;
  drawingPool: Subject<{name: string, rect: DOMRect}> = new Subject();
  hostMap = new Map<string, number>();

  constructor() {
    this.drawingPool.pipe(
      tap(this.drawborder),
      debounceTime(2000)
    ).subscribe(() => {
      this.clear();
    })
  }
  create = () => {
    if (this.canvas) return ;
    const canvas: HTMLCanvasElement = window.document.createElement('canvas');
    canvas.width = window.screen.availWidth;
    canvas.height = window.screen.availHeight;
    canvas.style.cssText = `
        bottom: 0;
        left: 0;
        pointer-events: none;
        position: fixed;
        right: 0;
        top: 0;
        z-index: 1000000000;
      `;
    const root = window.document.documentElement;
    root.insertBefore(canvas, root.firstChild);
    this.canvas = canvas;
  };

  draw = (name: string, rect: DOMRect) => {
    if (this.hostMap.has(name)) {
      this.hostMap.set(name, this.hostMap.get(name) + 1);
    } else {
      this.hostMap.set(name, 1);
    }
    this.drawingPool.next({name, rect});
  };

  drawborder = ({name, rect}: {name: string, rect: DOMRect}) => {
    if (rect.width === 0 && rect.height === 0) return ;

    const ctx = this.canvas.getContext("2d");
    const renderTime = this.hostMap.get(name);
    ctx.strokeStyle = COLORS[Math.ceil(renderTime/2) - 1];
    ctx.strokeRect(
      rect.x + Math.floor(renderTime / 2),
      rect.y + Math.floor(renderTime / 2),
      rect.width - renderTime,
      rect.height - renderTime
    );
  };

  clear() {
    this.hostMap.clear();
    const ctx = this.canvas.getContext("2d");
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

export const CanvasFactory = new Canvas();