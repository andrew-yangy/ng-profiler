class Canvas {
  canvas: HTMLCanvasElement;

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

  drawborder = (rect: DOMRect) => {
    const ctx = this.canvas.getContext("2d");
    ctx.beginPath();
    ctx.rect(rect.x, rect.y, rect.width, rect.height);
    ctx.stroke();
  }
}
export const CanvasFactory = new Canvas();