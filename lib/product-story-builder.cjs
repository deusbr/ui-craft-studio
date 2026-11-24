'use strict';

const { escapeHtml } = require('./screen-archetypes.cjs');

function buildConceptFallbackSvg(isAudio) {
  if (isAudio) {
    return `<svg viewBox="0 0 400 400" aria-hidden="true" class="fallback-svg"><path d="M83 220V165a117 117 0 0 1 234 0v55" fill="none" stroke="currentColor" stroke-width="14" stroke-linecap="round"/><path d="M63 203q0-17 18-17h25q20 0 20 20v83q0 20-20 20H81q-18 0-18-18z" fill="var(--ps-surface,var(--surface))" stroke="var(--ps-accent,var(--accent))" stroke-width="8"/><path d="M274 206q0-20 20-20h25q18 0 18 17v88q0 18-18 18h-25q-20 0-20-20z" fill="var(--ps-surface,var(--surface))" stroke="var(--ps-accent,var(--accent))" stroke-width="8"/><path d="M137 191l12 20m102-20-12 20" fill="none" stroke="currentColor" stroke-width="14" stroke-linecap="round"/></svg>`;
  }
  return `<svg viewBox="0 0 400 400" aria-hidden="true" class="fallback-svg"><path d="M200 46 331 122v156l-131 76L69 278V122z" fill="var(--ps-surface,var(--surface))" stroke="var(--ps-accent,var(--accent))" stroke-width="4"/><path d="M69 122 200 198l131-76M200 198v156" fill="none" stroke="currentColor" stroke-width="3" opacity=".72"/><circle cx="200" cy="198" r="34" fill="var(--ps-accent,var(--accent))" opacity=".8"/></svg>`;
}

function buildAudioStoryPrototypeHtml({ appName, brief, direction, creativeDirection, safeModelUrl }) {
  const palette = direction.palette || {};
  const typography = direction.typography || {};
  const safeName = escapeHtml(appName);
  const safeConcept = escapeHtml(creativeDirection.concept || brief);
  const fontLink = typography.googleFontsQuery
    ? `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=${escapeHtml(typography.googleFontsQuery)}&display=swap">`
    : `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap">`;

  const paletteVars = `--ps-paper:${palette.bg || '#111311'};--ps-surface:${palette.surface || '#191C19'};--ps-surface-2:${palette.surfaceAlt || '#222622'};--ps-ink:${palette.text || '#F4F0E8'};--ps-muted:${palette.muted || '#C8C0B6'};--ps-accent:${palette.accent || '#D88B5A'};--ps-glow:${palette.accent || '#D88B5A'};--ps-accent-ink:${palette.accentText || '#161412'};--ps-line:${palette.border || '#303530'};`;

  const finishes = [
    { id: 'ebano-cobre', label: 'Ébano & Cobre', metal: '#c98a60', shell: '#1b1a18', swatch: '#2a241f', ring: '#d89a6e', price: 'R$ 2.190' },
    { id: 'titanio-bruto', label: 'Titânio Bruto', metal: '#b9bdb8', shell: '#282b2e', swatch: '#9fa4a0', ring: '#d7dad5', price: 'R$ 2.190' },
    { id: 'musgo-fosco', label: 'Musgo Fosco', metal: '#8fa084', shell: '#1d241d', swatch: '#4f624d', ring: '#aec0a2', price: 'R$ 2.290' },
    { id: 'areia-acetinada', label: 'Areia Acetinada', metal: '#cbbba4', shell: '#37332d', swatch: '#baa992', ring: '#e4d6c0', price: 'R$ 2.290' }
  ];

  const hotspots = [
    { id: 'arco', label: '01 · Arco contínuo', view: 'front', title: 'Arco monobloco balanceado', detail: 'Haste interna em liga leve com faixa perfurada que distribui a pressão sem pontos rígidos no topo.' },
    { id: 'driver', label: '02 · Driver planar', view: 'exploded', title: 'Câmara acústica em camadas', detail: 'Diafragma planar conceitual de 45 mm com anel de cobre e câmara selada para baixa distorção.' },
    { id: 'coroa', label: '03 · Coroa tátil', view: 'detail', title: 'Controle físico sem olhar', detail: 'Coroa giratória serrilhada para volume e botões táteis dedicados para reprodução e isolamento.' },
    { id: 'almofada', label: '04 · Almofada modular', view: 'side', title: 'Acoplamento substituível', detail: 'Almofadas magnéticas em espuma viscoelástica com troca rápida entre acabamento fosco e tecido respirável.' }
  ];

  const layers = [
    { code: 'L01', name: 'Concha externa usinada', spec: 'Alumínio anodizado · 1,8 mm', desc: 'Casco rígido com acabamento microjateado para reduzir ressonâncias indesejadas.' },
    { code: 'L02', name: 'Anel acústico de cobre', spec: 'Bobina & guia de fluxo', desc: 'Elemento estrutural que estabiliza o conjunto magnético e alinha a saída de ar traseira.' },
    { code: 'L03', name: 'Transdutor planar 45 mm', spec: 'Conceito demonstrativo · 20 Hz–20 kHz', desc: 'Membrana fina tensionada para resposta rápida em transientes e médios definidos.' },
    { code: 'L04', name: 'Almofada circumaural', spec: 'Espuma viscoelástica · encaixe magnético', desc: 'Vedação passiva uniforme ao redor da orelha, pensada para longas sessões sem fadiga.' }
  ];

  const eqProfiles = [
    { id: 'reference', name: 'Referência de Estúdio', sub: 'Equilíbrio neutro · 20 Hz – 20 kHz', bass: '0.0 dB', mid: '0.0 dB', air: '+0.5 dB', path: 'M 24 128 C 90 128, 150 126, 220 126 C 295 126, 365 124, 435 121 C 495 119, 540 123, 576 130', area: 'M 24 128 C 90 128, 150 126, 220 126 C 295 126, 365 124, 435 121 C 495 119, 540 123, 576 130 L 576 210 L 24 210 Z', freq: 220, gain: 0 },
    { id: 'immersion', name: 'Imersão Noturna', sub: 'Sub-graves quentes · agudos suaves', bass: '+4.5 dB', mid: '-0.5 dB', air: '+1.5 dB', path: 'M 24 88 C 85 88, 130 105, 200 126 C 275 142, 355 135, 430 124 C 490 116, 540 128, 576 142', area: 'M 24 88 C 85 88, 130 105, 200 126 C 275 142, 355 135, 430 124 C 490 116, 540 128, 576 142 L 576 210 L 24 210 Z', freq: 145, gain: 4.5 },
    { id: 'clarity', name: 'Voz & Detalhe', sub: 'Presença vocal · recorte espacial', bass: '-1.5 dB', mid: '+3.0 dB', air: '+3.5 dB', path: 'M 24 142 C 90 140, 165 134, 240 116 C 315 98, 390 95, 455 102 C 510 108, 548 118, 576 126', area: 'M 24 142 C 90 140, 165 134, 240 116 C 315 98, 390 95, 455 102 C 510 108, 548 118, 576 126 L 576 210 L 24 210 Z', freq: 330, gain: 3.0 }
  ];

  const modelStageHtml = safeModelUrl
    ? `<model-viewer src="${escapeHtml(safeModelUrl)}" alt="Modelo 3D de ${safeName}" camera-controls auto-rotate rotation-per-second="8deg" shadow-intensity="1" exposure="1.05"></model-viewer>`
    : `<canvas id="product3d" aria-label="Modelo 3D interativo de ${safeName}. Arraste para girar e use os controles abaixo."></canvas>
       <div class="asset-placeholder" id="webgl-fallback" hidden role="img" aria-label="Espaço reservado para o modelo 3D real do produto">
         ${buildConceptFallbackSvg(true)}
         <p>MODELO DO PRODUTO<br><strong>Adicionar arquivo GLB aprovado</strong></p>
       </div>`;

  return `<!doctype html>
<html lang="pt-BR" data-experience="product-story">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <meta name="color-scheme" content="dark">
  <meta name="supported-color-schemes" content="dark">
  <meta name="theme-color" content="${palette.bg || '#111311'}">
  <title>${safeName} — Série 02 · Escuta como Arquitetura</title>
  ${fontLink}
  <style>
    :root{${paletteVars}--ps-display:${typography.display || '"Instrument Serif",Georgia,serif'};--ps-body:${typography.body || '"Plus Jakarta Sans",system-ui,sans-serif'};--ps-mono:${typography.mono || '"JetBrains Mono",ui-monospace,monospace'};color-scheme:only dark}
    *{box-sizing:border-box}
    html{scroll-behavior:smooth;background:var(--ps-paper)}
    body{margin:0;background:var(--ps-paper);color:var(--ps-ink);font:15px/1.6 var(--ps-body);-webkit-font-smoothing:antialiased;overflow-x:hidden}
    button,a,input{font:inherit;color:inherit}
    a{text-decoration:none}
    button{cursor:pointer}
    button:focus-visible,a:focus-visible{outline:2px solid var(--ps-accent);outline-offset:3px}
    .wrap{width:min(1260px,calc(100% - 48px));margin-inline:auto}
    .mono{font-family:var(--ps-mono);font-variant-numeric:tabular-nums}
    .eyebrow{display:inline-flex;align-items:center;gap:10px;font:500 11px/1.3 var(--ps-mono);letter-spacing:.16em;text-transform:uppercase;color:var(--ps-accent)}
    .eyebrow::before{content:"";width:28px;height:1px;background:var(--ps-accent)}
    .sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}

    .topbar{position:sticky;top:0;z-index:30;backdrop-filter:blur(14px);background:color-mix(in srgb,var(--ps-paper) 86%,transparent);border-bottom:1px solid var(--ps-line)}
    .topbar-inner{height:70px;display:flex;align-items:center;justify-content:space-between;gap:16px}
    .brand{display:flex;align-items:baseline;gap:10px;font:600 19px var(--ps-mono);letter-spacing:.14em;text-transform:uppercase;color:var(--ps-ink)}
    .brand small{font-size:10px;letter-spacing:.14em;color:var(--ps-muted);font-weight:500}
    .navlinks{display:flex;align-items:center;gap:28px;font-size:13px;color:var(--ps-muted)}
    .navlinks a:hover{color:var(--ps-ink)}
    .bag-btn{min-height:44px;padding:0 16px;border-radius:999px;border:1px solid var(--ps-line);background:var(--ps-surface);color:var(--ps-ink);display:inline-flex;align-items:center;gap:10px;font-size:12px;font-weight:600;transition:border-color .2s,background .2s}
    .bag-btn:hover{border-color:var(--ps-accent)}
    .bag-count{min-width:22px;height:22px;padding:0 6px;border-radius:999px;background:var(--ps-accent);color:var(--ps-accent-ink);display:grid;place-items:center;font:600 11px var(--ps-mono)}

    .hero{padding:44px 0 64px;display:grid;grid-template-columns:minmax(310px,.92fr) minmax(380px,1.08fr);gap:clamp(24px,4vw,64px);align-items:center;min-height:calc(100svh - 70px)}
    .hero-copy{min-width:0}
    .hero h1{font:400 clamp(54px,6.8vw,106px)/.93 var(--ps-display);letter-spacing:-.035em;margin:18px 0 22px;color:var(--ps-ink)}
    .hero h1 em{font-style:italic;color:var(--ps-accent)}
    .hero-deck{max-width:44ch;color:var(--ps-muted);font-size:15.5px;line-height:1.68;margin:0 0 24px}
    .price-row{display:flex;flex-wrap:wrap;align-items:baseline;gap:10px 14px;margin-bottom:20px}
    .price-now{font:600 26px var(--ps-mono);letter-spacing:-.03em;white-space:nowrap;flex-shrink:0;color:var(--ps-ink)}
    .price-note{font:12px var(--ps-mono);color:var(--ps-muted)}
    .cta-row{display:flex;flex-wrap:wrap;gap:12px;margin-bottom:26px}
    .btn-primary{min-height:48px;padding:0 24px;border:0;border-radius:999px;background:var(--ps-accent);color:var(--ps-accent-ink);font-weight:700;font-size:13px;letter-spacing:.03em;display:inline-flex;align-items:center;gap:10px;transition:transform .2s,filter .2s}
    .btn-primary:hover{transform:translateY(-1px);filter:brightness(1.06)}
    .btn-ghost{min-height:48px;padding:0 20px;border:1px solid var(--ps-line);border-radius:999px;background:transparent;color:var(--ps-ink);font-size:13px;font-weight:500;display:inline-flex;align-items:center;gap:8px;transition:border-color .2s}
    .btn-ghost:hover{border-color:var(--ps-ink)}

    .finish-inline{display:flex;flex-wrap:wrap;align-items:center;gap:12px;padding-top:18px;border-top:1px solid var(--ps-line)}
    .finish-label{font:500 11px var(--ps-mono);letter-spacing:.12em;text-transform:uppercase;color:var(--ps-muted)}
    .swatches{display:flex;gap:10px;align-items:center}
    .swatch{width:34px;height:34px;border-radius:50%;border:2px solid var(--ps-line);background:var(--swatch);box-shadow:inset 0 0 0 3px var(--ps-paper);transition:transform .18s,border-color .18s}
    .swatch[aria-pressed="true"]{border-color:var(--ps-ink);transform:scale(1.08)}
    .finish-name{font:500 13px var(--ps-body);color:var(--ps-ink)}

    .stage-shell{min-width:0;display:flex;flex-direction:column;gap:12px}
    .stage-box{position:relative;height:min(64vh,590px);min-height:390px;border-radius:28px;border:1px solid var(--ps-line);background:radial-gradient(ellipse at 50% 42%,color-mix(in srgb,var(--ps-glow) 18%,var(--ps-surface)) 0%,var(--ps-surface) 48%,var(--ps-paper) 100%);overflow:hidden;box-shadow:0 32px 72px -34px rgba(0,0,0,.75)}
    .stage-box::after{content:"";position:absolute;inset:14px;border-radius:20px;border:1px solid color-mix(in srgb,var(--ps-ink) 6%,transparent);pointer-events:none}
    .stage-meta{position:absolute;top:16px;left:18px;right:18px;display:flex;justify-content:space-between;align-items:center;gap:10px;pointer-events:none;z-index:3}
    .stage-pill{font:500 10px/1.2 var(--ps-mono);letter-spacing:.12em;text-transform:uppercase;padding:7px 11px;border-radius:999px;background:color-mix(in srgb,var(--ps-paper) 78%,transparent);border:1px solid var(--ps-line);color:var(--ps-muted);backdrop-filter:blur(8px)}
    .stage-pill strong{color:var(--ps-ink);font-weight:600}
    #product3d,model-viewer{width:100%;height:100%;display:block;touch-action:none}
    .asset-placeholder{position:absolute;inset:0;display:grid;place-items:center;padding:28px;text-align:center}
    .asset-placeholder[hidden]{display:none}
    .fallback-svg{width:min(72%,290px);height:auto;color:var(--ps-ink)}
    .asset-placeholder p{margin:12px 0 0;font:11px/1.6 var(--ps-mono);color:var(--ps-muted);letter-spacing:.08em}
    .asset-placeholder strong{color:var(--ps-ink)}

    .hotspot-card{background:var(--ps-surface);border:1px solid var(--ps-line);border-radius:16px;padding:13px 16px;display:flex;justify-content:space-between;align-items:center;gap:14px}
    .hotspot-card b{display:block;font:600 13px var(--ps-body);color:var(--ps-ink);margin-bottom:2px}
    .hotspot-card span{display:block;font-size:12.5px;color:var(--ps-muted);line-height:1.45}
    .hotspot-badge{flex:none;font:600 10px var(--ps-mono);letter-spacing:.12em;text-transform:uppercase;color:var(--ps-accent);border:1px solid color-mix(in srgb,var(--ps-accent) 45%,transparent);padding:5px 9px;border-radius:999px}

    .stage-toolbar{display:flex;flex-wrap:wrap;justify-content:space-between;gap:8px}
    .seg-group{display:flex;flex-wrap:wrap;gap:6px}
    .ctrl-btn{min-height:44px;padding:0 14px;border-radius:999px;border:1px solid var(--ps-line);background:var(--ps-surface);color:var(--ps-muted);font:500 12px var(--ps-mono);display:inline-flex;align-items:center;gap:7px;transition:border-color .18s,color .18s,background .18s}
    .ctrl-btn:hover{border-color:var(--ps-muted);color:var(--ps-ink)}
    .ctrl-btn[aria-pressed="true"]{background:var(--ps-accent);border-color:var(--ps-accent);color:var(--ps-accent-ink);font-weight:700}
    .ctrl-btn:disabled{opacity:.48;cursor:not-allowed}

    .proof-strip{border-top:1px solid var(--ps-line);border-bottom:1px solid var(--ps-line);background:var(--ps-surface);padding:18px 0}
    .proof-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px}
    .proof-item{border-right:1px solid var(--ps-line);padding-right:16px}
    .proof-item:last-child{border-right:0}
    .proof-item strong{display:block;font:600 13px var(--ps-mono);color:var(--ps-ink)}
    .proof-item span{display:block;font-size:12px;color:var(--ps-muted);margin-top:2px}

    .section{padding:clamp(64px,8vw,112px) 0;border-bottom:1px solid var(--ps-line)}
    .section-head{display:grid;grid-template-columns:minmax(260px,.95fr) minmax(260px,1fr);gap:clamp(20px,5vw,64px);align-items:end;margin-bottom:44px}
    .section-head h2{font:400 clamp(36px,4.5vw,62px)/.98 var(--ps-display);letter-spacing:-.03em;margin:12px 0 0;color:var(--ps-ink)}
    .section-head p{margin:0;color:var(--ps-muted);max-width:52ch}

    .explode-grid{display:grid;grid-template-columns:1.1fr .9fr;gap:28px;align-items:start}
    .layer-stack{display:grid;gap:12px}
    .layer-item{text-align:left;width:100%;padding:18px 20px;border-radius:16px;border:1px solid var(--ps-line);background:var(--ps-surface);color:var(--ps-ink);display:grid;grid-template-columns:52px 1fr auto;gap:14px;align-items:center;transition:border-color .2s,background .2s}
    .layer-item:hover,.layer-item[aria-pressed="true"]{border-color:var(--ps-accent);background:var(--ps-surface-2)}
    .layer-code{font:600 12px var(--ps-mono);color:var(--ps-accent)}
    .layer-item strong{display:block;font-size:15px;margin-bottom:2px;color:var(--ps-ink)}
    .layer-item small{display:block;color:var(--ps-muted);font-size:12.5px}
    .layer-detail-panel{border:1px solid var(--ps-line);border-radius:20px;background:var(--ps-surface);padding:28px}
    .layer-detail-panel h3{font:400 32px/1.05 var(--ps-display);margin:10px 0 12px;color:var(--ps-ink)}
    .layer-detail-panel p{color:var(--ps-muted);margin:0 0 22px}
    .hotspot-pills{display:flex;flex-wrap:wrap;gap:8px;margin-top:18px}

    .acoustic-grid{display:grid;grid-template-columns:1.15fr .85fr;gap:28px;align-items:stretch}
    .chart-card,.eq-side{border:1px solid var(--ps-line);border-radius:22px;background:var(--ps-surface);padding:24px}
    .chart-top{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:12px;margin-bottom:16px}
    .eq-tabs{display:flex;flex-wrap:wrap;gap:8px}
    .eq-svg{width:100%;height:auto;display:block}
    .eq-curve{transition:d .35s ease}
    .eq-metrics{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:18px;padding-top:16px;border-top:1px solid var(--ps-line)}
    .eq-metric span{display:block;font:11px var(--ps-mono);color:var(--ps-muted);text-transform:uppercase}
    .eq-metric strong{display:block;font:600 20px var(--ps-mono);color:var(--ps-ink);margin-top:4px}
    .sample-box{display:flex;flex-direction:column;justify-content:space-between;gap:20px;height:100%}
    .bars{height:84px;display:flex;align-items:flex-end;gap:6px;padding:14px;border-radius:14px;background:var(--ps-paper);border:1px solid var(--ps-line)}
    .bar{flex:1;min-width:0;border-radius:4px 4px 0 0;background:color-mix(in srgb,var(--ps-accent) 68%,var(--ps-ink));height:22%;transition:height .16s ease}
    .sample-note{font:11px/1.55 var(--ps-mono);color:var(--ps-muted);border-top:1px solid var(--ps-line);padding-top:14px}

    .editorial-chapters{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}
    .ed-card{border:1px solid var(--ps-line);border-radius:18px;background:var(--ps-surface);padding:24px;display:flex;flex-direction:column;justify-content:space-between;gap:18px}
    .ed-card h3{font:400 28px/1.08 var(--ps-display);margin:8px 0 10px;color:var(--ps-ink)}
    .ed-card p{margin:0;color:var(--ps-muted);font-size:14px}
    .ed-foot{font:11px var(--ps-mono);color:var(--ps-muted);border-top:1px solid var(--ps-line);padding-top:12px;display:flex;justify-content:space-between}

    .config-box{border:1px solid var(--ps-line);border-radius:26px;background:var(--ps-surface);padding:clamp(24px,4vw,44px);display:grid;grid-template-columns:1fr auto;gap:28px;align-items:center}
    .config-options{display:flex;flex-wrap:wrap;gap:12px;margin-top:20px}
    .pad-btn{min-height:44px;padding:0 16px;border-radius:12px;border:1px solid var(--ps-line);background:var(--ps-paper);color:var(--ps-muted);font-size:13px}
    .pad-btn[aria-pressed="true"]{border-color:var(--ps-accent);color:var(--ps-ink);background:var(--ps-surface-2)}

    .specs-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1px;background:var(--ps-line);border:1px solid var(--ps-line);border-radius:18px;overflow:hidden;margin-top:32px}
    .spec-cell{background:var(--ps-paper);padding:22px}
    .spec-cell dt{font:500 11px var(--ps-mono);letter-spacing:.14em;text-transform:uppercase;color:var(--ps-muted);margin-bottom:6px}
    .spec-cell dd{margin:0;font-size:14.5px;color:var(--ps-ink)}

    .foot{padding:28px 0 42px;display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px;font:12px var(--ps-mono);color:var(--ps-muted)}

    .drawer-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.62);z-index:60;display:none;justify-content:flex-end}
    .drawer-backdrop.open{display:flex}
    .drawer{width:min(420px,100%);height:100%;background:var(--ps-surface);border-left:1px solid var(--ps-line);padding:24px;display:flex;flex-direction:column;justify-content:space-between;gap:16px}
    .drawer-head{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--ps-line);padding-bottom:14px}
    .drawer-list{flex:1;overflow:auto;display:grid;gap:12px;align-content:start}
    .cart-item{border:1px solid var(--ps-line);border-radius:14px;padding:14px;background:var(--ps-paper);display:flex;justify-content:space-between;gap:12px;align-items:center}
    .qty-row{display:flex;align-items:center;gap:8px}
    .qty-btn{width:36px;height:36px;border-radius:999px;border:1px solid var(--ps-line);background:var(--ps-surface);color:var(--ps-ink)}
    .notice{position:fixed;bottom:20px;left:50%;transform:translate(-50%,14px);opacity:0;visibility:hidden;z-index:80;background:var(--ps-surface-2);color:var(--ps-ink);border:1px solid var(--ps-accent);box-shadow:0 12px 32px rgba(0,0,0,.45);padding:12px 18px;border-radius:999px;font:500 12.5px var(--ps-body);pointer-events:none;transition:opacity .22s,transform .22s,visibility .22s}
    .notice.on{opacity:1;visibility:visible;transform:translate(-50%,0)}

    html.ps-anim .reveal{opacity:0;transform:translateY(18px);transition:opacity .55s ease,transform .55s cubic-bezier(.2,.7,.2,1)}
    html.ps-anim .reveal.in{opacity:1;transform:none}

    @media(max-width:980px){
      .hero,.section-head,.explode-grid,.acoustic-grid,.config-box{grid-template-columns:1fr}
      .stage-box{height:400px;min-height:360px}
      .editorial-chapters,.specs-grid,.proof-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
      .proof-item:nth-child(2){border-right:0}
    }
    @media(max-width:680px){
      .wrap{width:min(100% - 32px,560px)}
      .navlinks{display:none}
      .hero{padding:20px 0 42px;gap:22px}
      .stage-shell{order:-1}
      .stage-box{height:340px;min-height:320px;border-radius:22px}
      .stage-meta{top:12px;left:12px;right:12px;flex-wrap:wrap}
      .stage-pill{font-size:9px;padding:5px 9px}
      .hotspot-card{position:static;margin-top:10px;padding:12px 14px;flex-direction:column;align-items:flex-start;gap:6px;border-radius:16px}
      .hero h1{font-size:clamp(46px,14vw,64px)}
      .editorial-chapters,.specs-grid,.proof-grid{grid-template-columns:1fr}
      .proof-item{border-right:0;border-bottom:1px solid var(--ps-line);padding:0 0 12px}
      .proof-item:last-child{border-bottom:0;padding-bottom:0}
      .layer-item{grid-template-columns:44px 1fr}
      .layer-item .mono{grid-column:2}
    }
    @media(prefers-reduced-motion:reduce){
      html{scroll-behavior:auto}
      *,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}
      html.ps-anim .reveal{opacity:1;transform:none}
    }
  </style>
  ${safeModelUrl ? '<script type="module" src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"></script>' : '<script type="importmap">{"imports":{"three":"https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js","three/addons/":"https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/"}}</script>'}
</head>
<body>
  <header class="topbar">
    <div class="wrap topbar-inner">
      <a class="brand" href="#top">${safeName} <small>SÉRIE 02</small></a>
      <nav class="navlinks" aria-label="Navegação principal">
        <a href="#construcao">Construção</a>
        <a href="#escuta">Escuta</a>
        <a href="#uso">Uso diário</a>
        <a href="#escolha">Acabamentos</a>
      </nav>
      <button class="bag-btn" id="open-bag" type="button" aria-haspopup="dialog" aria-controls="bag-drawer">
        <span>Sacola</span>
        <span class="bag-count" id="bag-count">0</span>
      </button>
    </div>
  </header>

  <main id="top">
    <section class="wrap hero" aria-labelledby="hero-title">
      <div class="hero-copy">
        <span class="eyebrow">Edição Studio · Over-ear planar</span>
        <h1 id="hero-title">O som<br>ganha <em>forma.</em></h1>
        <p class="hero-deck">${safeConcept}. Gire o modelo 3D em tempo real, abra a vista explodida para inspecionar as camadas internas e compare curvas de escuta antes de configurar o seu par.</p>
        <div class="price-row">
          <span class="price-now" id="active-price">${finishes[0].price}</span>
          <span class="price-note">Conceito demonstrativo · 12x sem juros simulado</span>
        </div>
        <div class="cta-row">
          <button class="btn-primary" id="hero-add" type="button">Adicionar à sacola</button>
          <a class="btn-ghost" href="#construcao">Inspecionar engenharia</a>
        </div>
        <div class="finish-inline">
          <span class="finish-label">Acabamento</span>
          <div class="swatches" role="group" aria-label="Selecionar acabamento">
            ${finishes.map((f, idx) => `<button class="swatch" type="button" data-finish="${f.id}" aria-label="${f.label}" aria-pressed="${idx === 0}" style="--swatch:${f.swatch}"></button>`).join('')}
          </div>
          <span class="finish-name" id="finish-name">${finishes[0].label}</span>
        </div>
      </div>

      <div class="stage-shell">
        <div class="stage-box" id="stage-box">
          <div class="stage-meta">
            <span class="stage-pill"><strong>ARRASTE</strong> · GIRE E APROXIME</span>
            <span class="stage-pill">${safeModelUrl ? 'MODELO GLB' : 'CONCEITO 3D · PRONTO P/ GLB'}</span>
          </div>
          ${modelStageHtml}
        </div>

        <div class="hotspot-card" id="hotspot-card" aria-live="polite">
          <div>
            <b id="hotspot-title">${hotspots[0].title}</b>
            <span id="hotspot-detail">${hotspots[0].detail}</span>
          </div>
          <span class="hotspot-badge" id="hotspot-badge">Vista 3D</span>
        </div>

        <div class="stage-toolbar" role="toolbar" aria-label="Controles do modelo 3D">
          <div class="seg-group">
            <button class="ctrl-btn" type="button" data-view="studio" aria-pressed="true">Estúdio</button>
            <button class="ctrl-btn" type="button" data-view="front" aria-pressed="false">Frente</button>
            <button class="ctrl-btn" type="button" data-view="side" aria-pressed="false">Lateral</button>
            <button class="ctrl-btn" type="button" data-view="detail" aria-pressed="false">Detalhe</button>
            <button class="ctrl-btn" type="button" data-view="exploded" aria-pressed="false" id="explode-btn">Explodida</button>
          </div>
          <button class="ctrl-btn" type="button" id="spin-btn" aria-pressed="false">Girar 360°</button>
        </div>
      </div>
    </section>

    <div class="proof-strip">
      <div class="wrap proof-grid">
        <div class="proof-item"><strong>45 mm Planar</strong><span>Arquitetura de transdutor conceitual</span></div>
        <div class="proof-item"><strong>4 Camadas</strong><span>Vista explodida interativa em 3D</span></div>
        <div class="proof-item"><strong>3 Perfis EQ</strong><span>Curva de resposta visual e amostra</span></div>
        <div class="proof-item"><strong>Modular</strong><span>Almofadas e arco de troca rápida</span></div>
      </div>
    </div>

    <section class="wrap section reveal" id="construcao" aria-labelledby="construcao-title">
      <div class="section-head">
        <div>
          <span class="eyebrow">02 / Construção & Vista Explodida</span>
          <h2 id="construcao-title">Cada peça visível.<br>Nada colado às escondidas.</h2>
        </div>
        <p>Selecione qualquer componente abaixo para focar a câmera e abrir as camadas internas do fone no visualizador 3D acima.</p>
      </div>
      <div class="explode-grid">
        <div class="layer-stack" role="list">
          ${layers.map((layer, idx) => `<button class="layer-item" type="button" data-layer="${idx}" aria-pressed="${idx === 0}"><span class="layer-code">${layer.code}</span><span><strong>${layer.name}</strong><small>${layer.spec}</small></span><span class="mono">Inspecionar →</span></button>`).join('')}
        </div>
        <aside class="layer-detail-panel" aria-live="polite">
          <span class="eyebrow" id="layer-badge">${layers[0].code} · Camada selecionada</span>
          <h3 id="layer-title">${layers[0].name}</h3>
          <p id="layer-desc">${layers[0].desc}</p>
          <button class="btn-primary" type="button" id="toggle-explode-inline">Alternar vista explodida no 3D</button>
          <div class="hotspot-pills" role="group" aria-label="Pontos de interesse no fone">
            ${hotspots.map((h, idx) => `<button class="ctrl-btn" type="button" data-hotspot="${idx}" aria-pressed="${idx === 0}">${h.label}</button>`).join('')}
          </div>
        </aside>
      </div>
    </section>

    <section class="wrap section reveal" id="escuta" aria-labelledby="escuta-title">
      <div class="section-head">
        <div>
          <span class="eyebrow">03 / Escuta & Resposta Acústica</span>
          <h2 id="escuta-title">Curva aberta.<br>Sem maquiagem sonora.</h2>
        </div>
        <p>Compare três perfis de afinação conceitual no gráfico 20 Hz–20 kHz e, se quiser, dispare uma amostra sonora sintetizada localmente no navegador.</p>
      </div>
      <div class="acoustic-grid">
        <div class="chart-card">
          <div class="chart-top">
            <strong id="eq-name">${eqProfiles[0].name}</strong>
            <div class="eq-tabs" role="tablist" aria-label="Perfis de resposta sonora">
              ${eqProfiles.map((p, idx) => `<button class="ctrl-btn" role="tab" type="button" data-eq="${p.id}" aria-selected="${idx === 0}" aria-pressed="${idx === 0}">${p.name.split(' ')[0]}</button>`).join('')}
            </div>
          </div>
          <svg class="eq-svg" viewBox="0 0 600 230" role="img" aria-label="Gráfico conceitual de resposta em frequência de 20 Hz a 20 kHz">
            <defs>
              <linearGradient id="eqFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="var(--ps-accent)" stop-opacity="0.34"/>
                <stop offset="100%" stop-color="var(--ps-accent)" stop-opacity="0.02"/>
              </linearGradient>
            </defs>
            <g stroke="var(--ps-line)" stroke-width="1" stroke-dasharray="3 4">
              <line x1="24" y1="60" x2="576" y2="60"/>
              <line x1="24" y1="126" x2="576" y2="126"/>
              <line x1="24" y1="186" x2="576" y2="186"/>
              <line x1="130" y1="30" x2="130" y2="208"/>
              <line x1="290" y1="30" x2="290" y2="208"/>
              <line x1="450" y1="30" x2="450" y2="208"/>
            </g>
            <g fill="var(--ps-muted)" font-size="10" font-family="monospace">
              <text x="24" y="222">20 Hz</text>
              <text x="118" y="222">100 Hz</text>
              <text x="278" y="222">1 kHz</text>
              <text x="438" y="222">6 kHz</text>
              <text x="540" y="222">20 kHz</text>
              <text x="6" y="64">+6</text>
              <text x="8" y="130">0 dB</text>
              <text x="6" y="190">-6</text>
            </g>
            <path id="eq-area" d="${eqProfiles[0].area}" fill="url(#eqFill)"/>
            <path id="eq-path" class="eq-curve" d="${eqProfiles[0].path}" fill="none" stroke="var(--ps-accent)" stroke-width="3" stroke-linecap="round"/>
          </svg>
          <div class="eq-metrics">
            <div class="eq-metric"><span>Graves (60 Hz)</span><strong id="eq-bass">${eqProfiles[0].bass}</strong></div>
            <div class="eq-metric"><span>Médios (1 kHz)</span><strong id="eq-mid">${eqProfiles[0].mid}</strong></div>
            <div class="eq-metric"><span>Brilho (10 kHz)</span><strong id="eq-air">${eqProfiles[0].air}</strong></div>
          </div>
        </div>

        <div class="eq-side">
          <div class="sample-box">
            <div>
              <span class="eyebrow">Amostra opcional (sem autoplay)</span>
              <h3 style="font:400 30px/1.05 var(--ps-display);margin:12px 0 8px;color:var(--ps-ink)">Ouça a mudança do filtro ao vivo.</h3>
              <p style="margin:0;color:var(--ps-muted)" id="eq-sub">${eqProfiles[0].sub}. Clique para gerar um acorde harmônico suave com Web Audio API moldado pelo perfil selecionado.</p>
            </div>
            <div class="bars" id="bars" aria-hidden="true">
              ${Array.from({ length: 16 }, () => '<span class="bar"></span>').join('')}
            </div>
            <div style="display:flex;flex-wrap:wrap;gap:10px;align-items:center">
              <button class="btn-primary" type="button" id="audio-toggle" aria-pressed="false">Ouvir amostra conceitual</button>
              <span class="mono" style="font-size:12px;color:var(--ps-muted)" id="audio-status">Silenciado por padrão</span>
            </div>
            <p class="sample-note">Nota de transparência: a curva acima é um alvo conceitual demonstrativo de interface; valores finais dependem de medições em câmara acústica.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="wrap section reveal" id="uso" aria-labelledby="uso-title">
      <div class="section-head">
        <div>
          <span class="eyebrow">04 / Uso & Ergonomia</span>
          <h2 id="uso-title">Pensado para quem passa horas com ele.</h2>
        </div>
        <p>Controles táteis previsíveis, peso distribuído ao longo do arco e peças substituíveis sem ferramentas proprietárias.</p>
      </div>
      <div class="editorial-chapters">
        <article class="ed-card">
          <div>
            <span class="eyebrow">01 · Equilíbrio</span>
            <h3>Pressão lateral distribuída</h3>
            <p>Geometria com inclinação dupla nas hastes para acompanhar o maxilar sem concentrar força atrás da orelha.</p>
          </div>
          <div class="ed-foot"><span>Arco articulado</span><span>Conceito ~295 g</span></div>
        </article>
        <article class="ed-card">
          <div>
            <span class="eyebrow">02 · Tátil</span>
            <h3>Coroa física e clique seco</h3>
            <p>Sem gestos invisíveis em painel sensível ao toque: gire a coroa para volume e pressione para pausa ou transparência.</p>
          </div>
          <div class="ed-foot"><span>Hardware direto</span><span>Zero toque acidental</span></div>
        </article>
        <article class="ed-card">
          <div>
            <span class="eyebrow">03 · Longevidade</span>
            <h3>Reparo em minutos</h3>
            <p>Almofadas magnéticas e bateria acessível via parafusos padrão mantêm o fone útil por anos após a compra.</p>
          </div>
          <div class="ed-foot"><span>Peças de reposição</span><span>USB-C + cabo P2</span></div>
        </article>
      </div>
    </section>

    <section class="wrap section reveal" id="escolha" aria-labelledby="escolha-title">
      <div class="config-box">
        <div>
          <span class="eyebrow">05 / Escolha & Configuração</span>
          <h2 id="escolha-title" style="font:400 clamp(34px,4.5vw,56px)/.98 var(--ps-display);margin:12px 0;color:var(--ps-ink)">Configure o seu ${safeName}.</h2>
          <p style="margin:0;color:var(--ps-muted);max-width:52ch">Troque acabamento metálico e textura das almofadas — a atualização reflete direto no modelo 3D no topo da página.</p>
          <div class="config-options" role="group" aria-label="Material das almofadas">
            <button class="pad-btn" type="button" data-pad="matte" aria-pressed="true">Almofada Couro Fosco</button>
            <button class="pad-btn" type="button" data-pad="woven" aria-pressed="false">Almofada Tecido Respirável</button>
          </div>
        </div>
        <div style="display:grid;gap:10px;justify-items:end">
          <div class="mono" style="font-size:28px;font-weight:600;color:var(--ps-ink)" id="config-price">${finishes[0].price}</div>
          <button class="btn-primary" type="button" id="config-add">Adicionar configuração à sacola</button>
        </div>
      </div>

      <dl class="specs-grid">
        <div class="spec-cell"><dt>Transdutores (conceito)</dt><dd>Planar magnético 45 mm</dd></div>
        <div class="spec-cell"><dt>Conectividade</dt><dd>Bluetooth 5.4 multiponto + USB-C lossless</dd></div>
        <div class="spec-cell"><dt>Isolamento</dt><dd>ANC híbrido com modo transparência</dd></div>
        <div class="spec-cell"><dt>Materiais</dt><dd>Alumínio anodizado, aço mola e espuma viscoelástica</dd></div>
        <div class="spec-cell"><dt>Na caixa</dt><dd>Fone ${safeName}, estojo rígido, cabo USB-C e P2</dd></div>
        <div class="spec-cell"><dt>Transparência</dt><dd>Especificações e preços demonstrativos para validação</dd></div>
      </dl>
    </section>
  </main>

  <footer class="wrap foot">
    <span>${safeName} · Série 02 · Protótipo editorial WebGL</span>
    <span>Conceito visual gerado via ui-craft-studio · Sem coleta de dados</span>
  </footer>

  <div class="drawer-backdrop" id="bag-drawer" role="dialog" aria-modal="true" aria-labelledby="bag-title">
    <div class="drawer">
      <div>
        <div class="drawer-head">
          <h2 id="bag-title" style="font:400 28px var(--ps-display);margin:0;color:var(--ps-ink)">Sua sacola</h2>
          <button class="ctrl-btn" type="button" id="close-bag">Fechar</button>
        </div>
        <div class="drawer-list" id="bag-list" style="margin-top:16px"></div>
      </div>
      <div style="border-top:1px solid var(--ps-line);padding-top:16px">
        <div style="display:flex;justify-content:space-between;margin-bottom:12px">
          <span style="color:var(--ps-muted)">Subtotal estimado</span>
          <strong class="mono" id="bag-total">R$ 0</strong>
        </div>
        <button class="btn-primary" style="width:100%;justify-content:center" type="button" id="checkout-demo">Finalizar reserva (demo)</button>
      </div>
    </div>
  </div>

  <div class="notice" id="notice" role="status" aria-live="polite"></div>

  <script>
    window.__AURELIA_DATA__ = ${JSON.stringify({ finishes, hotspots, layers, eqProfiles })};
  </script>
  <script type="module">
    const { finishes, hotspots, layers, eqProfiles } = window.__AURELIA_DATA__;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const notice = document.getElementById('notice');
    let noticeTimer;
    function toast(msg) {
      notice.textContent = msg;
      notice.classList.add('on');
      clearTimeout(noticeTimer);
      noticeTimer = setTimeout(() => notice.classList.remove('on'), 2400);
    }

    const state = {
      finish: finishes[0],
      pad: 'matte',
      exploded: false,
      view: 'studio',
      cart: []
    };

    // Reveal observer (safe fallback ensures sections never stay invisible)
    if (!reducedMotion && 'IntersectionObserver' in window) {
      document.documentElement.classList.add('ps-anim');
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.01, rootMargin: '0px 0px 120px 0px' });
      document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
      setTimeout(() => document.querySelectorAll('.reveal:not(.in)').forEach((el) => el.classList.add('in')), 1200);
    }

    // Cart Drawer
    const drawer = document.getElementById('bag-drawer');
    const bagCount = document.getElementById('bag-count');
    const bagList = document.getElementById('bag-list');
    const bagTotal = document.getElementById('bag-total');

    function parsePrice(str) {
      return Number(String(str).replace(/[^0-9]/g, '')) || 0;
    }
    function formatBrl(num) {
      return 'R$ ' + Number(num).toLocaleString('pt-BR');
    }
    function renderCart() {
      const totalItems = state.cart.reduce((acc, item) => acc + item.qty, 0);
      const totalValue = state.cart.reduce((acc, item) => acc + item.qty * item.unitPrice, 0);
      bagCount.textContent = String(totalItems);
      bagTotal.textContent = formatBrl(totalValue);
      if (!state.cart.length) {
        bagList.innerHTML = '<p style="color:var(--ps-muted);font-size:14px">Sua sacola está vazia. Escolha um acabamento para simular o pedido.</p>';
        return;
      }
      bagList.innerHTML = state.cart.map((item, idx) =>
        '<div class="cart-item"><div><strong style="display:block">' + item.name + '</strong><small style="color:var(--ps-muted)">' + item.padLabel + ' · ' + formatBrl(item.unitPrice) + '</small></div><div class="qty-row"><button class="qty-btn" type="button" data-delta="-1" data-idx="' + idx + '" aria-label="Diminuir">-</button><span class="mono">' + item.qty + '</span><button class="qty-btn" type="button" data-delta="1" data-idx="' + idx + '" aria-label="Aumentar">+</button></div></div>'
      ).join('');
      bagList.querySelectorAll('.qty-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          const i = Number(btn.dataset.idx);
          const d = Number(btn.dataset.delta);
          state.cart[i].qty += d;
          if (state.cart[i].qty <= 0) state.cart.splice(i, 1);
          renderCart();
        });
      });
    }
    function addCurrentToCart() {
      const padLabel = state.pad === 'woven' ? 'Tecido Respirável' : 'Couro Fosco';
      const existing = state.cart.find((c) => c.id === state.finish.id && c.pad === state.pad);
      if (existing) existing.qty += 1;
      else state.cart.push({ id: state.finish.id, pad: state.pad, padLabel, name: state.finish.label, unitPrice: parsePrice(state.finish.price), qty: 1 });
      renderCart();
      toast(state.finish.label + ' adicionado à sacola');
    }
    renderCart();

    document.getElementById('hero-add').addEventListener('click', addCurrentToCart);
    document.getElementById('config-add').addEventListener('click', addCurrentToCart);
    document.getElementById('open-bag').addEventListener('click', () => drawer.classList.add('open'));
    document.getElementById('close-bag').addEventListener('click', () => drawer.classList.remove('open'));
    drawer.addEventListener('click', (e) => { if (e.target === drawer) drawer.classList.remove('open'); });
    document.getElementById('checkout-demo').addEventListener('click', () => {
      toast(state.cart.length ? 'Fluxo demonstrativo — conecte ao checkout real' : 'Adicione um item antes de finalizar');
    });

    // Hotspots & Layers
    const hsTitle = document.getElementById('hotspot-title');
    const hsDetail = document.getElementById('hotspot-detail');
    const hsBadge = document.getElementById('hotspot-badge');
    const layerBadge = document.getElementById('layer-badge');
    const layerTitle = document.getElementById('layer-title');
    const layerDesc = document.getElementById('layer-desc');

    let applyCameraView = () => {};
    let applyMaterialFinish = () => {};

    function selectHotspot(index) {
      const h = hotspots[index];
      if (!h) return;
      hsTitle.textContent = h.title;
      hsDetail.textContent = h.detail;
      hsBadge.textContent = h.label;
      document.querySelectorAll('[data-hotspot]').forEach((b, i) => b.setAttribute('aria-pressed', String(i === index)));
      applyCameraView(h.view);
    }

    document.querySelectorAll('[data-hotspot]').forEach((btn) => {
      btn.addEventListener('click', () => selectHotspot(Number(btn.dataset.hotspot)));
    });

    document.querySelectorAll('[data-layer]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.dataset.layer);
        const layer = layers[idx];
        document.querySelectorAll('[data-layer]').forEach((b, i) => b.setAttribute('aria-pressed', String(i === idx)));
        layerBadge.textContent = layer.code + ' · Camada selecionada';
        layerTitle.textContent = layer.name;
        layerDesc.textContent = layer.desc;
        applyCameraView('exploded');
      });
    });

    // Finishes & Pads
    document.querySelectorAll('[data-finish]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const fin = finishes.find((f) => f.id === btn.dataset.finish);
        if (!fin) return;
        state.finish = fin;
        document.querySelectorAll('[data-finish]').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
        document.getElementById('finish-name').textContent = fin.label;
        document.getElementById('active-price').textContent = fin.price;
        document.getElementById('config-price').textContent = fin.price;
        document.documentElement.style.setProperty('--ps-glow', fin.ring);
        applyMaterialFinish(fin, state.pad);
        toast('Acabamento: ' + fin.label);
      });
    });

    document.querySelectorAll('[data-pad]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.pad = btn.dataset.pad;
        document.querySelectorAll('[data-pad]').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
        applyMaterialFinish(state.finish, state.pad);
        toast(state.pad === 'woven' ? 'Almofada em tecido respirável aplicada' : 'Almofada em couro fosco aplicada');
      });
    });

    // Acoustic EQ Chart & Optional Web Audio Sample
    let activeEq = eqProfiles[0];
    let audioCtx = null;
    let oscA = null;
    let oscB = null;
    let filterNode = null;
    let gainNode = null;
    let barTimer = null;
    const bars = Array.from(document.querySelectorAll('#bars .bar'));

    function setBarHeights(active) {
      bars.forEach((b, i) => {
        const h = active ? 22 + Math.round(Math.abs(Math.sin(Date.now() * 0.004 + i * 0.65)) * 72) : 18 + ((i * 11) % 24);
        b.style.height = h + '%';
      });
    }
    setBarHeights(false);

    document.querySelectorAll('[data-eq]').forEach((tab) => {
      tab.addEventListener('click', () => {
        const eq = eqProfiles.find((p) => p.id === tab.dataset.eq);
        if (!eq) return;
        activeEq = eq;
        document.querySelectorAll('[data-eq]').forEach((b) => {
          const sel = b === tab;
          b.setAttribute('aria-selected', String(sel));
          b.setAttribute('aria-pressed', String(sel));
        });
        document.getElementById('eq-name').textContent = eq.name;
        document.getElementById('eq-sub').textContent = eq.sub + '. Clique para gerar um acorde harmônico suave com Web Audio API moldado pelo perfil selecionado.';
        document.getElementById('eq-path').setAttribute('d', eq.path);
        document.getElementById('eq-area').setAttribute('d', eq.area);
        document.getElementById('eq-bass').textContent = eq.bass;
        document.getElementById('eq-mid').textContent = eq.mid;
        document.getElementById('eq-air').textContent = eq.air;
        if (filterNode && audioCtx) {
          filterNode.type = 'peaking';
          filterNode.frequency.setTargetAtTime(eq.freq, audioCtx.currentTime, 0.08);
          filterNode.gain.setTargetAtTime(eq.gain, audioCtx.currentTime, 0.08);
        }
      });
    });

    const audioBtn = document.getElementById('audio-toggle');
    const audioStatus = document.getElementById('audio-status');
    audioBtn.addEventListener('click', async () => {
      if (gainNode && audioCtx) {
        gainNode.gain.setTargetAtTime(0.0001, audioCtx.currentTime, 0.08);
        setTimeout(() => {
          try { oscA?.stop(); oscB?.stop(); audioCtx?.close(); } catch {}
          audioCtx = null; oscA = null; oscB = null; filterNode = null; gainNode = null;
        }, 120);
        clearInterval(barTimer);
        setBarHeights(false);
        audioBtn.setAttribute('aria-pressed', 'false');
        audioBtn.textContent = 'Ouvir amostra conceitual';
        audioStatus.textContent = 'Silenciado';
        return;
      }
      try {
        const AC = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AC();
        oscA = audioCtx.createOscillator();
        oscB = audioCtx.createOscillator();
        filterNode = audioCtx.createBiquadFilter();
        gainNode = audioCtx.createGain();
        oscA.type = 'sine';
        oscB.type = 'triangle';
        oscA.frequency.value = 196;
        oscB.frequency.value = 293.66;
        filterNode.type = 'peaking';
        filterNode.frequency.value = activeEq.freq;
        filterNode.gain.value = activeEq.gain;
        gainNode.gain.value = 0.04;
        oscA.connect(filterNode);
        oscB.connect(filterNode);
        filterNode.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscA.start();
        oscB.start();
        audioBtn.setAttribute('aria-pressed', 'true');
        audioBtn.textContent = 'Pausar amostra';
        audioStatus.textContent = 'Reproduzindo filtro: ' + activeEq.name;
        if (!reducedMotion) {
          barTimer = setInterval(() => setBarHeights(true), 120);
        } else {
          setBarHeights(true);
        }
      } catch {
        toast('Web Audio indisponível neste navegador');
      }
    });

    // Three.js Procedural 3D Headphone Studio
    const canvas = document.getElementById('product3d');
    const fallbackEl = document.getElementById('webgl-fallback');
    if (canvas) {
      try {
        const THREE = await import('three');
        const { OrbitControls } = await import('three/addons/controls/OrbitControls.js');
        const { RoomEnvironment } = await import('three/addons/environments/RoomEnvironment.js');

        const host = canvas.parentElement;
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance', preserveDrawingBuffer: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setSize(host.clientWidth, host.clientHeight);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.18;

        const scene = new THREE.Scene();
        const pmrem = new THREE.PMREMGenerator(renderer);
        scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

        const camera = new THREE.PerspectiveCamera(32, host.clientWidth / host.clientHeight, 0.1, 100);
        camera.position.set(1.55, 0.95, 7.25);

        scene.add(new THREE.HemisphereLight(0xf3e7d8, 0x161816, 1.35));
        const keyLight = new THREE.DirectionalLight(0xfff1e0, 3.4);
        keyLight.position.set(-4.5, 5.5, 5.2);
        scene.add(keyLight);
        const rimLight = new THREE.PointLight(0xd88b5a, 24, 16);
        rimLight.position.set(4.2, 2.2, -2.5);
        scene.add(rimLight);
        const fillLight = new THREE.PointLight(0xc8d4e6, 10, 14);
        fillLight.position.set(-3.2, -1.5, 3.5);
        scene.add(fillLight);

        const metalMat = new THREE.MeshPhysicalMaterial({ color: finishes[0].metal, metalness: 0.86, roughness: 0.22, clearcoat: 0.72, clearcoatRoughness: 0.16 });
        const shellMat = new THREE.MeshPhysicalMaterial({ color: finishes[0].shell, metalness: 0.44, roughness: 0.28, clearcoat: 0.82, clearcoatRoughness: 0.18 });
        const cushionMat = new THREE.MeshStandardMaterial({ color: 0x141413, roughness: 0.84, metalness: 0.06 });
        const copperMat = new THREE.MeshStandardMaterial({ color: 0xc98253, metalness: 0.92, roughness: 0.24 });
        const driverMat = new THREE.MeshStandardMaterial({ color: 0x26282a, metalness: 0.75, roughness: 0.35 });
        const ledMat = new THREE.MeshBasicMaterial({ color: 0xff8a3d });

        const rootGroup = new THREE.Group();
        scene.add(rootGroup);

        // Studio halo pedestal
        const halo = new THREE.Mesh(new THREE.TorusGeometry(1.75, 0.008, 12, 96), copperMat);
        halo.rotation.x = Math.PI / 2;
        halo.position.y = -1.62;
        rootGroup.add(halo);

        // Sculpted dual-layer headband
        const archCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(-1.24, 0.24, 0),
          new THREE.Vector3(-1.32, 1.02, 0),
          new THREE.Vector3(-0.92, 1.78, 0),
          new THREE.Vector3(0, 2.08, 0),
          new THREE.Vector3(0.92, 1.78, 0),
          new THREE.Vector3(1.32, 1.02, 0),
          new THREE.Vector3(1.24, 0.24, 0)
        ]);
        const outerBand = new THREE.Mesh(new THREE.TubeGeometry(archCurve, 96, 0.105, 22, false), metalMat);
        outerBand.scale.set(1, 1, 1.45);
        rootGroup.add(outerBand);

        const padCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(-1.12, 0.45, 0),
          new THREE.Vector3(-1.08, 1.15, 0),
          new THREE.Vector3(-0.74, 1.70, 0),
          new THREE.Vector3(0, 1.92, 0),
          new THREE.Vector3(0.74, 1.70, 0),
          new THREE.Vector3(1.08, 1.15, 0),
          new THREE.Vector3(1.12, 0.45, 0)
        ]);
        const headPad = new THREE.Mesh(new THREE.TubeGeometry(padCurve, 84, 0.095, 20, false), cushionMat);
        headPad.scale.set(1, 1, 1.25);
        rootGroup.add(headPad);

        const explodedParts = [];
        function buildEarAssembly(side) {
          const assembly = new THREE.Group();
          assembly.position.set(side * 1.16, -0.34, 0);
          assembly.rotation.z = side * -0.1;

          // Yoke + hinge pin
          const yoke = new THREE.Mesh(new THREE.CapsuleGeometry(0.052, 0.56, 8, 16), metalMat);
          yoke.position.set(side * 0.08, 0.46, 0);
          yoke.rotation.z = side * 0.12;
          assembly.add(yoke);

          const pivot = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.095, 0.08, 28), metalMat);
          pivot.rotation.x = Math.PI / 2;
          pivot.position.set(side * 0.12, 0.18, 0);
          assembly.add(pivot);

          // Outer acoustic cup (shell)
          const outerCup = new THREE.Group();
          const shell = new THREE.Mesh(new THREE.CylinderGeometry(0.56, 0.62, 0.28, 64, 1), shellMat);
          shell.rotation.z = Math.PI / 2;
          shell.scale.set(1, 1.18, 1);
          outerCup.add(shell);

          const trimRing = new THREE.Mesh(new THREE.TorusGeometry(0.57, 0.032, 18, 64), metalMat);
          trimRing.rotation.y = Math.PI / 2;
          trimRing.scale.set(1, 1.18, 1);
          trimRing.position.x = side * 0.14;
          outerCup.add(trimRing);

          const backCap = new THREE.Mesh(new THREE.CylinderGeometry(0.49, 0.53, 0.06, 64), metalMat);
          backCap.rotation.z = Math.PI / 2;
          backCap.scale.set(1, 1.18, 1);
          backCap.position.x = side * 0.15;
          outerCup.add(backCap);

          if (side === 1) {
            const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.075, 28), copperMat);
            crown.rotation.x = Math.PI / 2;
            crown.position.set(0.11, 0.25, -0.52);
            outerCup.add(crown);

            const led = new THREE.Mesh(new THREE.SphereGeometry(0.022, 12, 12), ledMat);
            led.position.set(0.11, -0.32, 0.44);
            outerCup.add(led);
          }

          assembly.add(outerCup);
          explodedParts.push({ obj: outerCup, baseX: 0, deltaX: side * 0.58 });

          // Internal planar driver + copper coil ring
          const driverGroup = new THREE.Group();
          const driverPlate = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.04, 48), driverMat);
          driverPlate.rotation.z = Math.PI / 2;
          driverPlate.scale.set(1, 1.15, 1);
          driverGroup.add(driverPlate);

          const coilRing = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.034, 16, 56), copperMat);
          coilRing.rotation.y = Math.PI / 2;
          coilRing.scale.set(1, 1.15, 1);
          coilRing.position.x = side * -0.02;
          driverGroup.add(coilRing);

          assembly.add(driverGroup);
          explodedParts.push({ obj: driverGroup, baseX: 0, deltaX: side * 0.06 });

          // Memory foam earpad
          const padGroup = new THREE.Group();
          const pad = new THREE.Mesh(new THREE.TorusGeometry(0.47, 0.14, 28, 64), cushionMat);
          pad.rotation.y = Math.PI / 2;
          pad.scale.set(1, 1.18, 1);
          pad.position.x = side * -0.17;
          padGroup.add(pad);

          const innerMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.43, 0.43, 0.02, 48), driverMat);
          innerMesh.rotation.z = Math.PI / 2;
          innerMesh.scale.set(1, 1.15, 1);
          innerMesh.position.x = side * -0.15;
          padGroup.add(innerMesh);

          assembly.add(padGroup);
          explodedParts.push({ obj: padGroup, baseX: 0, deltaX: side * -0.46 });

          rootGroup.add(assembly);
        }

        buildEarAssembly(-1);
        buildEarAssembly(1);

        const controls = new OrbitControls(camera, canvas);
        controls.enableDamping = true;
        controls.dampingFactor = 0.07;
        controls.enablePan = false;
        controls.minDistance = 4.6;
        controls.maxDistance = 9.2;
        controls.minPolarAngle = 0.72;
        controls.maxPolarAngle = 2.15;
        controls.target.set(0, 0.22, 0);

        const cameraPresets = {
          studio: new THREE.Vector3(1.55, 0.95, 7.25),
          front: new THREE.Vector3(0, 0.72, 7.3),
          side: new THREE.Vector3(7.1, 0.65, 0.3),
          detail: new THREE.Vector3(3.4, 0.25, 3.8),
          exploded: new THREE.Vector3(2.15, 0.88, 7.55)
        };

        let targetCamPos = cameraPresets.studio.clone();
        let cameraLerping = false;
        let explodeTarget = 0;
        let explodeProgress = 0;

        const spinBtn = document.getElementById('spin-btn');
        if (reducedMotion) {
          controls.autoRotate = false;
          spinBtn.disabled = true;
          spinBtn.title = 'Rotação automática desativada por prefers-reduced-motion';
        }
        spinBtn.addEventListener('click', () => {
          controls.autoRotate = !controls.autoRotate;
          controls.autoRotateSpeed = 0.75;
          spinBtn.setAttribute('aria-pressed', String(controls.autoRotate));
          spinBtn.textContent = controls.autoRotate ? 'Pausar giro' : 'Girar 360°';
        });

        applyCameraView = (viewName) => {
          state.view = viewName;
          state.exploded = viewName === 'exploded';
          explodeTarget = state.exploded ? 1 : 0;
          targetCamPos = (cameraPresets[viewName] || cameraPresets.studio).clone();
          cameraLerping = true;
          document.querySelectorAll('[data-view]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.view === viewName)));
        };

        document.querySelectorAll('[data-view]').forEach((btn) => {
          btn.addEventListener('click', () => applyCameraView(btn.dataset.view));
        });

        document.getElementById('toggle-explode-inline').addEventListener('click', () => {
          applyCameraView(state.exploded ? 'studio' : 'exploded');
          document.getElementById('stage-box').scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' });
        });

        applyMaterialFinish = (fin, padType) => {
          metalMat.color.set(fin.metal);
          shellMat.color.set(fin.shell);
          copperMat.color.set(fin.ring);
          rimLight.color.set(fin.ring);
          cushionMat.roughness = padType === 'woven' ? 0.96 : 0.80;
          cushionMat.color.set(padType === 'woven' ? 0x262624 : 0x141413);
        };

        controls.addEventListener('start', () => { cameraLerping = false; });

        let rafId = 0;
        function tick() {
          rafId = requestAnimationFrame(tick);
          if (cameraLerping) {
            camera.position.lerp(targetCamPos, reducedMotion ? 1 : 0.085);
            if (camera.position.distanceTo(targetCamPos) < 0.03) cameraLerping = false;
          }
          explodeProgress += (explodeTarget - explodeProgress) * (reducedMotion ? 1 : 0.09);
          for (const part of explodedParts) {
            part.obj.position.x = part.baseX + part.deltaX * explodeProgress;
          }
          controls.update();
          renderer.render(scene, camera);
        }
        tick();

        new ResizeObserver(() => {
          const w = host.clientWidth;
          const h = host.clientHeight;
          if (!w || !h) return;
          renderer.setSize(w, h);
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
        }).observe(host);

        window.addEventListener('pagehide', () => {
          cancelAnimationFrame(rafId);
          pmrem.dispose();
          renderer.dispose();
        });
      } catch {
        canvas.hidden = true;
        if (fallbackEl) fallbackEl.hidden = false;
      }
    }
  </script>
</body>
</html>`;
}

function buildProductStoryPrototypeHtml({ appName = 'Product', brief = '', direction = {}, creativeDirection = {}, modelUrl = '' } = {}) {
  const palette = direction.palette || {};
  const typography = direction.typography || {};
  const chapters = Array.isArray(creativeDirection.chapters) ? creativeDirection.chapters : [];
  const isAudio = creativeDirection.mode === 'product-story';
  const safeName = escapeHtml(appName);
  const safeConcept = escapeHtml(creativeDirection.concept || brief);
  const requestedModelUrl = String(modelUrl || '').trim();
  if (requestedModelUrl && !/^(https?:\/\/|\/|\.\/|\.\.\/)/i.test(requestedModelUrl)) {
    throw new Error('productModelUrl must be an HTTPS/HTTP URL or a relative/absolute web asset path.');
  }
  const safeModelUrl = requestedModelUrl;

  if (isAudio) {
    return buildAudioStoryPrototypeHtml({ appName, brief, direction, creativeDirection, safeModelUrl });
  }

  const fontLink = typography.googleFontsQuery
    ? `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=${escapeHtml(typography.googleFontsQuery)}&display=swap">`
    : '';
  const conceptIllustration = buildConceptFallbackSvg(false);
  const modelMarkup = safeModelUrl
    ? `<model-viewer src="${escapeHtml(safeModelUrl)}" alt="Modelo 3D de ${safeName}" camera-controls auto-rotate rotation-per-second="8deg" shadow-intensity="1" exposure="1.05"></model-viewer>`
    : `<div class="asset-placeholder" role="img" aria-label="Espaço reservado para o modelo 3D real do produto">
        <div class="placeholder-ring ring-a"></div><div class="placeholder-ring ring-b"></div>
        ${conceptIllustration}
        <div class="placeholder-core"><span>3D</span></div>
        <p>MODELO DO PRODUTO<br><strong>Adicionar arquivo GLB aprovado</strong></p>
      </div>`;
  const chapterMarkup = chapters.map((chapter, index) => {
    const split = String(chapter).split(':');
    const heading = escapeHtml(split.shift() || `Capítulo ${index + 1}`);
    const detail = escapeHtml(split.join(':').trim() || chapter);
    return `<article class="story-chapter" id="chapter-${index + 1}">
      <div class="chapter-index">0${index + 1} <span>/ 0${chapters.length}</span></div>
      <div><h2>${heading}</h2><p>${detail}</p></div>
      <div class="chapter-art" aria-hidden="true"><span class="art-orbit"></span><span class="art-core"></span><span class="art-caption">${safeName} / DETAIL ${index + 1}</span></div>
    </article>`;
  }).join('');
  const paletteVars = `--paper:${palette.bg || '#111315'};--surface:${palette.surface || '#1b1e20'};--ink:${palette.text || '#f5f2eb'};--muted:${palette.muted || '#b3b0a8'};--accent:${palette.accent || '#cf6c46'};--line:${palette.border || '#454647'};`;

  return `<!doctype html>
<html lang="pt-BR" data-experience="product-story">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <meta name="theme-color" content="${palette.bg || '#111315'}"><title>${safeName} — experiência de produto</title>${fontLink}
  <style>
    :root{${paletteVars}--display:${typography.display || 'Georgia,serif'};--body:${typography.body || 'system-ui,sans-serif'};color-scheme:${direction.mode === 'light' ? 'light' : 'dark'}}
    *{box-sizing:border-box}html{scroll-behavior:smooth;background:var(--paper)}body{margin:0;background:var(--paper);color:var(--ink);font:16px/1.5 var(--body);-webkit-font-smoothing:antialiased}a{color:inherit}button{font:inherit;color:inherit;cursor:pointer}button:focus-visible,a:focus-visible{outline:2px solid var(--accent);outline-offset:4px}
    .site-head{height:72px;padding:0 clamp(20px,5vw,76px);display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid color-mix(in srgb,var(--line) 68%,transparent);position:absolute;inset:0 0 auto;z-index:4}.wordmark{font:600 20px var(--display);letter-spacing:-.04em}.head-links{display:flex;gap:clamp(14px,3vw,40px);align-items:center;font-size:12px;letter-spacing:.08em;text-transform:uppercase}.head-links a{text-decoration:none;opacity:.78}.head-links a:hover{opacity:1}.buy-link{border:1px solid var(--line);border-radius:999px;padding:10px 17px;background:transparent;text-decoration:none!important}
    .hero{min-height:min(850px,100svh);padding:128px clamp(20px,8vw,120px) 70px;display:grid;grid-template-columns:minmax(290px,.88fr) minmax(380px,1.12fr);align-items:center;gap:3vw;overflow:hidden;position:relative}.hero::before{content:"";position:absolute;width:min(64vw,850px);aspect-ratio:1;border:1px solid color-mix(in srgb,var(--accent) 25%,transparent);border-radius:50%;right:-14%;top:5%;pointer-events:none}.hero-copy{position:relative;z-index:1;max-width:600px}.eyebrow,.chapter-index,.asset-note{font:11px/1.5 var(--body);letter-spacing:.17em;text-transform:uppercase;color:var(--muted)}.eyebrow{display:flex;align-items:center;gap:12px}.eyebrow::before{content:"";width:34px;height:1px;background:var(--accent)}h1{font:500 clamp(56px,8.4vw,132px)/.91 var(--display);letter-spacing:-.07em;margin:25px 0 24px;max-width:720px}h1 em{font-weight:400;color:var(--accent)}.hero-deck{max-width:370px;color:var(--muted);font-size:15px}.hero-actions{display:flex;align-items:center;gap:20px;margin-top:32px}.primary-cta{background:var(--accent);color:#171513;border:0;border-radius:999px;padding:14px 21px;font-size:13px;font-weight:650}.text-cta{font-size:12px;text-underline-offset:5px}.hero-object{min-height:440px;position:relative;display:grid;place-items:center}.model-stage{width:min(100%,660px);height:min(68vh,620px);min-height:410px;display:grid;place-items:center;position:relative;border-radius:50%;background:radial-gradient(ellipse at 52% 49%,color-mix(in srgb,var(--accent) 13%,transparent),transparent 58%)}model-viewer{width:100%;height:100%;--poster-color:transparent;background:transparent}.asset-placeholder{width:min(80%,450px);aspect-ratio:1;position:relative;display:grid;place-items:center;transform:rotate(-8deg);perspective:800px}.fallback-svg{position:absolute;width:78%;height:78%;filter:drop-shadow(0 24px 35px #0008);pointer-events:none}.placeholder-ring{position:absolute;border:1px solid color-mix(in srgb,var(--accent) 55%,transparent);border-radius:50%;inset:8%;transform:rotateX(66deg) rotateZ(-20deg);animation:orbit 18s linear infinite}.ring-b{inset:18%;transform:rotateX(70deg) rotateZ(50deg);animation-direction:reverse;border-color:color-mix(in srgb,var(--ink) 40%,transparent)}.placeholder-core{width:34%;aspect-ratio:1;border-radius:38% 38% 45% 45%;background:linear-gradient(145deg,#8c8e8c,#222729 48%,#090b0c);box-shadow:inset -14px -12px 24px #050607,inset 8px 7px 16px #ffffff42,0 35px 55px #0008;transform:rotateY(-25deg) rotateX(12deg)}.placeholder-core::before{content:"";position:absolute;width:58%;height:110%;left:-43%;top:-5%;border:18px solid #46494a;border-right-color:#171a1a;border-bottom-color:#252929;border-radius:50%;transform:rotate(-10deg);box-shadow:inset 5px 2px 8px #ffffff45,0 12px 22px #0007}.placeholder-core span{position:absolute;top:45%;left:40%;font:10px var(--body);letter-spacing:.18em;color:#eee9}.asset-placeholder p{position:absolute;bottom:2%;text-align:center;color:var(--muted);font-size:9px;letter-spacing:.14em;line-height:1.9}.asset-placeholder strong{color:var(--ink);font-weight:500}.asset-note{position:absolute;bottom:0;right:0;font-size:9px}
    .manifesto{padding:28px clamp(20px,8vw,120px);display:flex;justify-content:space-between;gap:20px;border-top:1px solid var(--line);border-bottom:1px solid var(--line);font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--muted)}.story-chapter{min-height:520px;padding:clamp(70px,12vw,160px) clamp(20px,10vw,150px);display:grid;grid-template-columns:110px minmax(220px,.8fr) minmax(250px,1fr);gap:4vw;align-items:center;border-bottom:1px solid var(--line);scroll-margin-top:30px}.chapter-index span{opacity:.5}.story-chapter h2{font:500 clamp(34px,5.2vw,74px)/.98 var(--display);letter-spacing:-.05em;margin:0 0 20px}.story-chapter p{max-width:400px;color:var(--muted);font-size:14px}.chapter-art{height:250px;position:relative;display:grid;place-items:center;background:radial-gradient(ellipse at center,color-mix(in srgb,var(--accent) 13%,transparent),transparent 68%)}.art-orbit{width:210px;height:95px;border:1px solid color-mix(in srgb,var(--accent) 65%,transparent);border-radius:50%;transform:rotate(-28deg)}.art-core{position:absolute;width:45px;height:45px;border-radius:50%;background:var(--accent);filter:blur(1px);box-shadow:0 0 60px color-mix(in srgb,var(--accent) 45%,transparent)}.art-caption{position:absolute;bottom:12px;left:14px;font:9px var(--body);letter-spacing:.16em;color:var(--muted)}.finish{padding:120px 20px;text-align:center}.finish h2{font:500 clamp(44px,8vw,110px)/.96 var(--display);letter-spacing:-.07em;margin:10px 0 25px}.finish p{color:var(--muted);font-size:14px}.swatches{display:flex;justify-content:center;gap:12px;margin:28px}.swatch{width:34px;height:34px;border-radius:50%;border:2px solid var(--line);background:var(--swatch);box-shadow:inset 0 0 0 3px var(--paper)}.swatch[aria-pressed="true"]{outline:1px solid var(--ink);outline-offset:3px}.foot{padding:25px clamp(20px,5vw,76px);border-top:1px solid var(--line);color:var(--muted);font-size:11px;display:flex;justify-content:space-between}.notice{position:fixed;bottom:20px;left:50%;transform:translate(-50%,12px);opacity:0;padding:12px 18px;background:var(--ink);color:var(--paper);border-radius:999px;font-size:12px;transition:.25s;pointer-events:none}.notice.on{opacity:1;transform:translate(-50%,0)}
    @keyframes orbit{to{transform:rotateX(66deg) rotateZ(340deg)}}@media(max-width:760px){.site-head{height:62px}.head-links a:not(.buy-link){display:none}.hero{min-height:auto;padding:106px 22px 46px;grid-template-columns:1fr;gap:0}.hero::before{width:100vw;right:-42%;top:24%}h1{font-size:clamp(58px,16vw,92px);margin:20px 0}.hero-deck{max-width:310px}.hero-object{min-height:310px;order:-1;margin:0 -5vw -20px}.model-stage{height:310px;min-height:280px;width:100%}.asset-placeholder{width:75%}.asset-note{font-size:8px;right:5px}.manifesto{flex-direction:column;gap:8px}.story-chapter{min-height:unset;padding:76px 24px;grid-template-columns:1fr;gap:18px}.chapter-art{height:190px;grid-row:2}.story-chapter h2{font-size:48px}.chapter-index{order:-1}.finish{padding:85px 20px}.foot{gap:16px;flex-wrap:wrap}}@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}*,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}}
  </style>
  ${safeModelUrl ? '<script type="module" src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"></script>' : '<script type="importmap">{"imports":{"three":"https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js","three/addons/":"https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/"}}</script>'}
</head>
<body>
  <header class="site-head"><a class="wordmark" href="#top" aria-label="Início">${safeName}</a><nav class="head-links" aria-label="Navegação principal"><a href="#chapter-1">A experiência</a><a href="#finish">Acabamentos</a><a class="buy-link" href="#finish">Conhecer produto ↗</a></nav></header>
  <main id="top">
    <section class="hero" aria-labelledby="hero-title"><div class="hero-copy"><p class="eyebrow">Uma ideia feita para se reconhecer</p><h1 id="hero-title">Uma forma<br>de <em>ser único.</em></h1><p class="hero-deck">${safeConcept}. Uma direção visual concebida para explicar o produto através de forma, matéria e movimento.</p><div class="hero-actions"><a class="primary-cta" href="#chapter-1">Explorar a experiência</a><a class="text-cta" href="#finish">Ver acabamentos</a></div></div><div class="hero-object"><div class="model-stage">${modelMarkup}</div><span class="asset-note">${safeModelUrl ? 'MODELO 3D INTERATIVO' : 'ATIVO CONCEITUAL · SUBSTITUIR PELO MODELO DO PRODUTO'}</span></div></section>
    <div class="manifesto"><span>${safeName} / direção de lançamento</span><span>Forma · matéria · uso</span><span>Experiência adaptativa</span></div>
    <section aria-label="Capítulos da narrativa do produto">${chapterMarkup}</section>
    <section class="finish" id="finish"><p class="eyebrow" style="justify-content:center">Escolha seu acabamento</p><h2>Feito para ficar.<br>Pronto para ir.</h2><p>Troque a cor para explorar a direção visual. Substitua opções e informações pelas variantes e especificações confirmadas do produto.</p><div class="swatches" role="group" aria-label="Acabamento conceitual"><button class="swatch" aria-label="Grafite" aria-pressed="true" style="--swatch:#55595a"></button><button class="swatch" aria-label="Areia" aria-pressed="false" style="--swatch:#c6bba8"></button><button class="swatch" aria-label="Terracota" aria-pressed="false" style="--swatch:#bd624c"></button></div><button class="primary-cta" id="interest">${safeModelUrl ? 'Ver disponibilidade' : 'Ver especificações após validação'}</button></section>
  </main><footer class="foot"><span>${safeName} · conceito visual de produto</span><span>Informações do produto ainda precisam ser validadas</span></footer><div class="notice" id="notice" role="status" aria-live="polite"></div>
  <script>
    (function(){const root=document.documentElement;const notice=document.getElementById('notice');let timer;document.querySelectorAll('.swatch').forEach((button)=>button.addEventListener('click',()=>{document.querySelectorAll('.swatch').forEach((b)=>b.setAttribute('aria-pressed',String(b===button)));const color=button.style.getPropertyValue('--swatch');document.querySelector('.placeholder-core')?.style.setProperty('background','linear-gradient(145deg,'+color+',#222729 48%,#090b0c)');root.style.setProperty('--accent',color);notice.textContent='Acabamento conceitual selecionado';notice.classList.add('on');clearTimeout(timer);timer=setTimeout(()=>notice.classList.remove('on'),1800)}));document.getElementById('interest').addEventListener('click',()=>{notice.textContent='Ação demonstrativa — conecte ao fluxo comercial do produto';notice.classList.add('on');clearTimeout(timer);timer=setTimeout(()=>notice.classList.remove('on'),2200)});})();
  </script>
</body></html>`;
}

module.exports = { buildProductStoryPrototypeHtml };
