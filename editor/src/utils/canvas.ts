/**
 * Fills the canvas with a specific color
 * @param ctx
 * @param color color to fill with
 */
export function fillBg(ctx: CanvasRenderingContext2D, color: string = '#27272A') {
  ctx.save();
  // Reset to default transformation
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = '#27272A';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.restore();
};

/**
 * Exports a canvas drawing to downloadable image data URL
 * @param canvas 
 * @returns data URL of the exported image
 */
export function exportToImg(canvas: HTMLCanvasElement): string {
  return canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
};

