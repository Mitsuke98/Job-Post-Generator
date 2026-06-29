import { drawPill } from './drawPill';
import { CITY_PRESENCE } from '../constants';
import type { JobFormData, Template, LayoutType } from '../types';

export async function drawCard(
  canvas: HTMLCanvasElement,
  data: JobFormData,
  template: Template,
  whiteLogo: HTMLImageElement | null,
  layout: LayoutType = 'centered',
) {
  if (layout === 'split') return drawSplitLayout(canvas, data, whiteLogo);
  if (layout === 'bold')  return drawBoldLayout(canvas, data, whiteLogo);
  return drawCenteredLayout(canvas, data, template, whiteLogo);
}

// ─── CENTERED LAYOUT (original) ───────────────────────────────────────────────

async function drawCenteredLayout(
  canvas: HTMLCanvasElement,
  data: JobFormData,
  template: Template,
  whiteLogo: HTMLImageElement | null,
) {
  const W = 1080;
  const H = 1080;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  await document.fonts.ready;

  // Background
  if (template.type === 'image' && template.imagePath) {
    await new Promise<void>((resolve) => {
      const bgImg = new Image();
      bgImg.onload = () => {
        const scale = Math.max(W / bgImg.width, H / bgImg.height);
        const sw = bgImg.width * scale;
        const sh = bgImg.height * scale;
        const sx = (W - sw) / 2;
        const sy = (H - sh) / 2;
        ctx.drawImage(bgImg, sx, sy, sw, sh);
        ctx.fillStyle = 'rgba(30, 27, 84, 0.55)';
        ctx.fillRect(0, 0, W, H);
        resolve();
      };
      bgImg.src = template.imagePath!;
    });
  } else {
    if (template.pattern === 'gradient') {
      const grad = ctx.createRadialGradient(540, 460, 0, 540, 460, 700);
      grad.addColorStop(0, '#3d38a0');
      grad.addColorStop(1, '#0f0d33');
      ctx.fillStyle = grad;
    } else {
      ctx.fillStyle = '#1e1b54';
    }
    ctx.fillRect(0, 0, W, H);

    if (template.pattern === 'dots') {
      ctx.fillStyle = 'rgba(255,255,255,0.07)';
      for (let x = 18; x < W; x += 36) {
        for (let y = 18; y < H; y += 36) {
          ctx.beginPath();
          ctx.arc(x, y, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    if (template.pattern === 'lines') {
      ctx.strokeStyle = 'rgba(255,255,255,0.055)';
      ctx.lineWidth = 1.5;
      for (let i = -H; i < W + H; i += 44) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + H, H);
        ctx.stroke();
      }
    }
  }

  const PAD = 80;

  // Logo (top-left)
  if (whiteLogo) {
    const maxW = 200, maxH = 80;
    const scale = Math.min(maxW / whiteLogo.width, maxH / whiteLogo.height, 1);
    ctx.drawImage(whiteLogo, PAD, 68, whiteLogo.width * scale, whiteLogo.height * scale);
  }

  // "We're Hiring" badge (top-right)
  const badgeText = "🔥  We're Hiring";
  ctx.font = '600 18px Poppins, sans-serif';
  const badgeTextW = ctx.measureText(badgeText).width;
  const badgePadX = 22;
  const badgeH = 44;
  const badgeW = badgeTextW + badgePadX * 2;
  const badgeX = W - PAD - badgeW;
  const badgeY = 68;
  drawPill(ctx, badgeX, badgeY, badgeW, badgeH, 'rgba(255,255,255,0.13)', '1.5', 'rgba(255,255,255,0.2)');
  ctx.fillStyle = '#ffffff';
  ctx.font = '600 18px Poppins, sans-serif';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.fillText(badgeText, badgeX + badgePadX, badgeY + badgeH / 2);

  // Job Title (center)
  const title = data.jobTitle || 'Job Title';
  const titleSize = title.length > 30 ? 52 : title.length > 22 ? 62 : 72;
  ctx.font = `800 ${titleSize}px Poppins, sans-serif`;
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(title, W / 2, 480);

  // Description
  const desc = data.jobDesc || '';
  ctx.font = '400 22px Poppins, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const descLines = wrapText(ctx, desc, 720);
  descLines.forEach((line, i) => {
    ctx.fillText(line, W / 2, 570 + i * 34);
  });
  const descBottom = 570 + descLines.length * 34;

  // Pills
  const pillItems = buildPillItems(data);
  ctx.font = '500 18px Poppins, sans-serif';
  const pillH = 44;
  const pillPadX = 20;
  const pillGap = 12;
  const pillWidths = pillItems.map((p) => ctx.measureText(`${p.icon}  ${p.text}`).width + pillPadX * 2);
  const totalPillW = pillWidths.reduce((a, b) => a + b, 0) + pillGap * (pillItems.length - 1);
  let pillX = (W - totalPillW) / 2;
  const pillY = descBottom + 24;

  pillItems.forEach((p, i) => {
    const pw = pillWidths[i];
    drawPill(ctx, pillX, pillY, pw, pillH, 'rgba(255,255,255,0.10)', '1', 'rgba(255,255,255,0.13)');
    ctx.fillStyle = 'rgba(255,255,255,0.88)';
    ctx.font = '500 18px Poppins, sans-serif';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    ctx.fillText(`${p.icon}  ${p.text}`, pillX + pillPadX, pillY + pillH / 2);
    pillX += pw + pillGap;
  });

  // Company name + city (bottom-left)
  ctx.font = '700 30px Poppins, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(data.companyName || 'Company Name', PAD, H - 68 - 20);
  ctx.font = '400 18px Poppins, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.42)';
  ctx.fillText(CITY_PRESENCE, PAD, H - 68 + 14);

  // CTA button (bottom-right)
  const ctaLabel = `${data.ctaText || 'Apply Now'} →`;
  ctx.font = '700 20px Poppins, sans-serif';
  const ctaTextW = ctx.measureText(ctaLabel).width;
  const ctaPadX = 36;
  const ctaH = 56;
  const ctaW = ctaTextW + ctaPadX * 2;
  const ctaX = W - PAD - ctaW;
  const ctaY = H - 68 - ctaH + 10;
  drawPill(ctx, ctaX, ctaY, ctaW, ctaH, '#ffffff', '0', 'transparent');
  ctx.fillStyle = '#1e1b54';
  ctx.font = '700 20px Poppins, sans-serif';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.fillText(ctaLabel, ctaX + ctaPadX, ctaY + ctaH / 2);
}

// ─── SPLIT PANEL LAYOUT ────────────────────────────────────────────────────────

async function drawSplitLayout(
  canvas: HTMLCanvasElement,
  data: JobFormData,
  whiteLogo: HTMLImageElement | null,
) {
  const W = 1080;
  const H = 1080;
  const SPLIT = 400;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  await document.fonts.ready;

  // Left panel background
  ctx.fillStyle = '#1e1b54';
  ctx.fillRect(0, 0, SPLIT, H);
  // Dot pattern on left panel
  ctx.fillStyle = 'rgba(255,255,255,0.07)';
  for (let x = 18; x < SPLIT; x += 36) {
    for (let y = 18; y < H; y += 36) {
      ctx.beginPath();
      ctx.arc(x, y, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Right panel background
  ctx.fillStyle = '#16144a';
  ctx.fillRect(SPLIT, 0, W - SPLIT, H);

  // Vertical divider
  ctx.strokeStyle = 'rgba(255,255,255,0.1)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(SPLIT, 0);
  ctx.lineTo(SPLIT, H);
  ctx.stroke();

  // ── LEFT PANEL ─────────────────────────────────────────────

  // Logo
  if (whiteLogo) {
    const maxW = 200, maxH = 80;
    const scale = Math.min(maxW / whiteLogo.width, maxH / whiteLogo.height, 1);
    ctx.drawImage(whiteLogo, 56, 68, whiteLogo.width * scale, whiteLogo.height * scale);
  }

  // Thin separator below logo
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(56, 110);
  ctx.lineTo(56 + 260, 110);
  ctx.stroke();

  // Company name (bottom)
  ctx.font = '700 30px Poppins, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(data.companyName || 'Company Name', 56, H - 120);

  // City presence (wraps if long)
  ctx.font = '400 18px Poppins, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.38)';
  const cityLines = wrapText(ctx, CITY_PRESENCE, 280);
  cityLines.forEach((line, i) => {
    ctx.fillText(line, 56, H - 84 + i * 22);
  });

  // ── RIGHT PANEL ────────────────────────────────────────────

  const RX = 448; // right panel content start x
  const RR = 1024; // right panel content end x (1080 - 56)

  // Badge (top-right of right panel)
  const badgeText = "🔥  We're Hiring";
  ctx.font = '700 20px Poppins, sans-serif';
  const badgeTextW = ctx.measureText(badgeText).width;
  const badgePadX = 24;
  const badgeH = 44;
  const badgeW = badgeTextW + badgePadX * 2;
  const badgeX = W - 56 - badgeW;
  const badgeY = 52;
  drawPill(ctx, badgeX, badgeY, badgeW, badgeH, 'rgba(255,255,255,0.12)', '1', 'rgba(255,255,255,0.22)');
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 20px Poppins, sans-serif';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.fillText(badgeText, badgeX + badgePadX, badgeY + badgeH / 2);

  // "OPEN ROLE" label
  ctx.font = '500 16px Poppins, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.letterSpacing = '2px';
  ctx.fillText('OPEN ROLE', RX, 130);
  ctx.letterSpacing = '0px';

  // Job title lines (word-wrapped, up to 3 lines at fixed y positions)
  const title = data.jobTitle || 'Job Title';
  const titleSize = title.length > 30 ? 52 : title.length > 22 ? 62 : 72;
  ctx.font = `800 ${titleSize}px Poppins, sans-serif`;
  ctx.textAlign = 'left';
  const titleLines = wrapText(ctx, title, RR - RX);
  const titleYs = [210, 290, 370];
  titleLines.slice(0, 3).forEach((line, i) => {
    ctx.fillStyle = i === 2 ? 'rgba(255,255,255,0.25)' : '#ffffff';
    ctx.textBaseline = 'middle';
    ctx.fillText(line, RX, titleYs[i]);
  });

  // Horizontal divider
  ctx.strokeStyle = 'rgba(255,255,255,0.1)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(RX, 400);
  ctx.lineTo(RR, 400);
  ctx.stroke();

  // Description
  ctx.font = '400 22px Poppins, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  const descLines = wrapText(ctx, data.jobDesc || '', 560);
  descLines.forEach((line, i) => {
    ctx.fillText(line, RX, 440 + i * 28);
  });
  const descBottom = 440 + descLines.length * 28;

  // Pills (stacked vertically)
  const pillItems = buildPillItems(data);
  const pillH = 44;
  const pillPadX = 24;
  const pillGap = 12;
  ctx.font = '500 20px Poppins, sans-serif';
  let curPillY = descBottom + 24;

  pillItems.forEach((p) => {
    const pillLabel = `${p.icon}  ${p.text}`;
    const tw = ctx.measureText(pillLabel).width;
    const pw = tw + pillPadX * 2;
    drawPill(ctx, RX, curPillY, pw, pillH, 'rgba(255,255,255,0.09)', '1', 'rgba(255,255,255,0.12)');
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.font = '500 20px Poppins, sans-serif';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    ctx.fillText(pillLabel, RX + pillPadX, curPillY + pillH / 2);
    curPillY += pillH + pillGap;
  });

  // Apply Now button (full right-panel width)
  const ctaLabel = `${data.ctaText || 'Apply Now'} →`;
  const btnX = RX;
  const btnY = H - 100;
  const btnW = RR - RX;
  const btnH = 56;
  drawPill(ctx, btnX, btnY, btnW, btnH, '#ffffff', '0', 'transparent');
  ctx.fillStyle = '#1e1b54';
  ctx.font = '700 22px Poppins, sans-serif';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.fillText(ctaLabel, btnX + btnW / 2, btnY + btnH / 2);
}

// ─── BOLD LEFT LAYOUT ──────────────────────────────────────────────────────────

async function drawBoldLayout(
  canvas: HTMLCanvasElement,
  data: JobFormData,
  whiteLogo: HTMLImageElement | null,
) {
  const W = 1080;
  const H = 1080;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  await document.fonts.ready;

  // Background
  ctx.fillStyle = '#1e1b54';
  ctx.fillRect(0, 0, W, H);

  // Diagonal lines (45°, 40px spacing)
  ctx.strokeStyle = 'rgba(255,255,255,0.04)';
  ctx.lineWidth = 1;
  for (let i = -H; i < W + H; i += 40) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + H, H);
    ctx.stroke();
  }

  // Ghost "01" number (right edge, partially clipped)
  ctx.font = '800 320px Poppins, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.03)';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  ctx.fillText('01', 1100, 600);

  // Decorative concentric circles (right side)
  const cx = 920;
  const cy = 460;

  ctx.beginPath();
  ctx.arc(cx, cy, 160, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, 110, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255,255,255,0.07)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, 56, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.04)';
  ctx.fill();

  // ── TOP BAR ────────────────────────────────────────────────

  if (whiteLogo) {
    const maxW = 200, maxH = 80;
    const scale = Math.min(maxW / whiteLogo.width, maxH / whiteLogo.height, 1);
    ctx.drawImage(whiteLogo, 80, 68, whiteLogo.width * scale, whiteLogo.height * scale);
  }

  // Badge (top-right)
  const badgeText = "🔥  We're Hiring";
  ctx.font = '700 20px Poppins, sans-serif';
  const badgeTextW = ctx.measureText(badgeText).width;
  const badgePadX = 24;
  const badgeH = 44;
  const badgeW = badgeTextW + badgePadX * 2;
  const badgeX = W - 80 - badgeW;
  const badgeY = 60;
  drawPill(ctx, badgeX, badgeY, badgeW, badgeH, 'rgba(255,255,255,0.12)', '1', 'rgba(255,255,255,0.2)');
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 20px Poppins, sans-serif';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.fillText(badgeText, badgeX + badgePadX, badgeY + badgeH / 2);

  // ── LEFT ACCENT BAR ────────────────────────────────────────

  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  fillRoundRect(ctx, 80, 160, 4, 220, 2);

  // ── JOB TITLE (left-aligned at x=104) ─────────────────────

  const title = data.jobTitle || 'Job Title';
  const titleSize = title.length > 30 ? 52 : title.length > 22 ? 62 : 72;
  ctx.font = `800 ${titleSize}px Poppins, sans-serif`;
  ctx.textAlign = 'left';
  const titleLines = wrapText(ctx, title, 560);
  const titleYs = [230, 310, 390];
  let lastTitleY = 230;
  titleLines.slice(0, 3).forEach((line, i) => {
    ctx.fillStyle = i === 2 ? 'rgba(255,255,255,0.25)' : '#ffffff';
    ctx.textBaseline = 'middle';
    ctx.fillText(line, 104, titleYs[i]);
    lastTitleY = titleYs[i];
  });

  // ── DESCRIPTION ────────────────────────────────────────────

  const descStartY = Math.max(420, lastTitleY + 50);
  ctx.font = '400 22px Poppins, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  const descLines = wrapText(ctx, data.jobDesc || '', 560);
  descLines.forEach((line, i) => {
    ctx.fillText(line, 104, descStartY + i * 30);
  });
  const descBottom = descStartY + descLines.length * 30;

  // ── PILLS (horizontal, left-aligned, wrapping at 700px) ────

  const pillItems = buildPillItems(data);
  const pillH = 44;
  const pillPadX = 20;
  const pillGap = 14;
  ctx.font = '500 18px Poppins, sans-serif';

  let curX = 104;
  let curY = descBottom + 28;
  const maxRowW = 700;

  pillItems.forEach((p) => {
    const pillLabel = `${p.icon}  ${p.text}`;
    const tw = ctx.measureText(pillLabel).width;
    const pw = tw + pillPadX * 2;
    if (curX > 104 && curX + pw > 104 + maxRowW) {
      curX = 104;
      curY += pillH + pillGap;
    }
    drawPill(ctx, curX, curY, pw, pillH, 'rgba(255,255,255,0.10)', '1', 'rgba(255,255,255,0.13)');
    ctx.fillStyle = 'rgba(255,255,255,0.88)';
    ctx.font = '500 18px Poppins, sans-serif';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    ctx.fillText(pillLabel, curX + pillPadX, curY + pillH / 2);
    curX += pw + pillGap;
  });

  // ── BOTTOM ROW ─────────────────────────────────────────────

  // Company name + city (left)
  ctx.font = '700 30px Poppins, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(data.companyName || 'Company Name', 80, H - 68 - 20);
  ctx.font = '400 18px Poppins, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.42)';
  ctx.fillText(CITY_PRESENCE, 80, H - 68 + 14);

  // Apply Now button (right)
  const ctaLabel = `${data.ctaText || 'Apply Now'} →`;
  ctx.font = '700 20px Poppins, sans-serif';
  const ctaTextW = ctx.measureText(ctaLabel).width;
  const ctaPadX = 36;
  const ctaH = 56;
  const ctaW = ctaTextW + ctaPadX * 2;
  const ctaX = W - 80 - ctaW;
  const ctaY = H - 100;
  drawPill(ctx, ctaX, ctaY, ctaW, ctaH, '#ffffff', '0', 'transparent');
  ctx.fillStyle = '#1e1b54';
  ctx.font = '700 20px Poppins, sans-serif';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.fillText(ctaLabel, ctaX + ctaPadX, ctaY + ctaH / 2);
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function buildPillItems(data: JobFormData) {
  return [
    { icon: '📍', text: data.location },
    { icon: '💼', text: data.empType },
    { icon: '⏱',  text: data.experience },
    ...(data.salary ? [{ icon: '💰', text: data.salary }] : []),
  ];
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function fillRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.arcTo(x + w, y, x + w, y + radius, radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.arcTo(x + w, y + h, x + w - radius, y + h, radius);
  ctx.lineTo(x + radius, y + h);
  ctx.arcTo(x, y + h, x, y + h - radius, radius);
  ctx.lineTo(x, y + radius);
  ctx.arcTo(x, y, x + radius, y, radius);
  ctx.closePath();
  ctx.fill();
}
