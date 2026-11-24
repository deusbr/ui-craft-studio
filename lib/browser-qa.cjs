'use strict';

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawn } = require('node:child_process');

function findBrowserExecutable() {
  if (process.env.CHROME_PATH && fs.existsSync(process.env.CHROME_PATH)) {
    return process.env.CHROME_PATH;
  }
  const candidates = process.platform === 'win32'
    ? [
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
        'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
      ]
    : process.platform === 'darwin'
      ? ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge']
      : ['/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/microsoft-edge'];
  return candidates.find((p) => fs.existsSync(p)) || null;
}

async function createCdpClient(wsUrl) {
  if (typeof globalThis.WebSocket !== 'function') {
    throw new Error('Node >=22 global WebSocket is required for CDP browser QA');
  }
  const ws = new globalThis.WebSocket(wsUrl);
  await new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve, { once: true });
    ws.addEventListener('error', reject, { once: true });
  });
  let seq = 0;
  const pending = new Map();
  ws.addEventListener('message', (ev) => {
    const msg = JSON.parse(String(ev.data));
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(new Error(msg.error.message || JSON.stringify(msg.error)));
      else resolve(msg.result);
    }
  });
  return {
    send(method, params = {}) {
      const id = ++seq;
      ws.send(JSON.stringify({ id, method, params }));
      return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
    },
    close() {
      try { ws.close(); } catch {}
    }
  };
}

async function waitForDevTools(port) {
  for (let i = 0; i < 60; i += 1) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/list`);
      if (res.ok) {
        const list = await res.json();
        const page = list.find((t) => t.type === 'page' && t.webSocketDebuggerUrl);
        if (page) return page;
      }
    } catch {}
    await new Promise((r) => setTimeout(r, 120));
  }
  throw new Error('Timed out waiting for headless browser DevTools');
}

async function inspectHtmlInBrowser({ html, screenshotDir, prefix = 'shot', viewports } = {}) {
  const exe = findBrowserExecutable();
  if (!exe) {
    return { ran: false, reason: 'Chrome/Edge executable not found on host; skipped live browser QA.' };
  }
  if (typeof globalThis.WebSocket !== 'function') {
    return { ran: false, reason: 'Node WebSocket unavailable; skipped live browser QA.' };
  }

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ui-craft-qa-'));
  const htmlPath = path.join(tmpDir, 'preview.html');
  fs.writeFileSync(htmlPath, html, 'utf8');
  const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');
  const port = 9300 + Math.floor(Math.random() * 500);
  const profileDir = path.join(tmpDir, 'profile');

  const chrome = spawn(exe, [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profileDir}`,
    fileUrl
  ], { stdio: 'ignore' });

  const checkedViewports = Array.isArray(viewports) && viewports.length
    ? viewports
    : [
        { name: 'desktop', width: 1440, height: 900, mobile: false, scale: 1 },
        { name: 'mobile', width: 390, height: 844, mobile: true, scale: 2 }
      ];

  const reports = [];
  const screenshots = [];

  try {
    const target = await waitForDevTools(port);
    const cdp = await createCdpClient(target.webSocketDebuggerUrl);
    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');
    await new Promise((r) => setTimeout(r, 900));

    for (const vp of checkedViewports) {
      await cdp.send('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: vp.scale || 1,
        mobile: Boolean(vp.mobile)
      });
      await new Promise((r) => setTimeout(r, 350));

      const evalRes = await cdp.send('Runtime.evaluate', {
        returnByValue: true,
        expression: `(() => {
          const doc = document.documentElement;
          const bodyText = (document.body.innerText || '').trim();
          const svgs = document.querySelectorAll('svg').length;
          const fonts = Array.from(document.fonts || []).filter(f => f.status === 'loaded').map(f => f.family);
          const overflowX = Math.max(0, Math.round(doc.scrollWidth - window.innerWidth));
          const buttons = document.querySelectorAll('button, a, [role="tab"]').length;
          return {
            viewport: window.innerWidth + 'x' + window.innerHeight,
            overflowX,
            passedOverflow: overflowX <= 2,
            svgCount: svgs,
            interactiveControls: buttons,
            loadedFonts: [...new Set(fonts)],
            textLength: bodyText.length
          };
        })()`
      });

      const metrics = evalRes && evalRes.result ? evalRes.result.value : {};
      reports.push({ name: vp.name, ...metrics });

      if (screenshotDir) {
        fs.mkdirSync(screenshotDir, { recursive: true });
        const shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
        const outFile = path.join(screenshotDir, `${prefix}_${vp.name}.png`);
        fs.writeFileSync(outFile, Buffer.from(shot.data, 'base64'));
        screenshots.push(outFile);
      }
    }

    cdp.close();
    return {
      ran: true,
      executable: exe,
      passed: reports.every((r) => r.passedOverflow && r.svgCount > 0 && r.textLength > 40),
      reports,
      screenshots
    };
  } catch (err) {
    return { ran: false, reason: err.message, reports, screenshots };
  } finally {
    try { chrome.kill('SIGKILL'); } catch {}
    setTimeout(() => {
      try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch {}
    }, 300);
  }
}

module.exports = {
  findBrowserExecutable,
  inspectHtmlInBrowser
};
