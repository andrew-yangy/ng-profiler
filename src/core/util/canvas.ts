import { Subject } from "rxjs";
import { debounceTime, tap } from "rxjs/operators";

class Canvas {
  canvas: HTMLCanvasElement;
  drawingPool: Subject<DOMRect> = new Subject();

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
        xx-background-color: red;
        xx-opacity: 0.5;
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

  draw = (rect: DOMRect) => {
    this.drawingPool.next(rect);
  };

  drawborder = (rect: DOMRect) => {
    const ctx = this.canvas.getContext("2d");
    ctx.beginPath();
    ctx.rect(rect.x, rect.y, rect.width, rect.height);
    ctx.stroke();
  };

  clear() {
    const ctx = this.canvas.getContext("2d");
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
export const CanvasFactory = new Canvas();