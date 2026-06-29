export function drawPill(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  w: number, h: number,
  fill: string,
  borderWidth: string,
  borderColor: string,
) {
  const r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  if (borderWidth !== '0' && borderColor !== 'transparent') {
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = parseFloat(borderWidth);
    ctx.stroke();
  }
}
