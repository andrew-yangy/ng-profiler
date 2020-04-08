import { Subject } from "rxjs";
import { debounceTime, tap } from "rxjs/operators";
import { COLORS, DRAWER_THRESHOLD, NG_PROFILER_ID, UPDATE_DEBOUNCE_TIME } from "../constants";
import { HOST, LView } from "../angular/interfaces/view";

class Canvas {
  canvas: HTMLCanvasElement;
  drawingPool: Subject<{uuid: string, rect: DOMRect}> = new Subject();
  hostMap = new Map<string, number>();

  constructor() {
    this.drawingPool.pipe(
      tap(this.drawborder),
      debounceTime(UPDATE_DEBOUNCE_TIME)
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

  draw = (uuid: string, rect: DOMRect) => {
    if (this.hostMap.has(uuid)) {
      this.hostMap.set(uuid, this.hostMap.get(uuid) + 1);
    } else {
      this.hostMap.set(uuid, 1);
    }
    if (this.hostMap.get(uuid) < DRAWER_THRESHOLD) {
      this.drawingPool.next({uuid, rect});
    }
  };

  drawborder = ({uuid, rect}: {uuid: string, rect: DOMRect}) => {
    if (rect.width === 0 && rect.height === 0) return ;

    const ctx = this.canvas.getContext("2d");
    const renderTime = this.hostMap.get(uuid);
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