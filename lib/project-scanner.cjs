'use strict';

const fs = require('node:fs');
const path = require('node:path');

const IGNORE_DIRS = new Set([
  'node_modules',
  '.git',
  '.next',
  '.nuxt',
  'dist',
  'build',
  'coverage',
  '.expo',
  '.dart_tool',
  'target',
  '__pycache__',
  '.venv'
]);

const MAX_FILES_SCAN = 250;
const MAX_READ_BYTES = 128 * 1024;

function readTextCapped(filePath) {
  try {
    const st = fs.lstatSync(filePath);
    if (st.isSymbolicLink() || !st.isFile() || st.size > MAX_READ_BYTES) return '';
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return '';
  }
}

function walkProjectFiles(rootDir, maxFiles = MAX_FILES_SCAN) {
  const files = [];
  const queue = [rootDir];
  while (queue.length && files.length < maxFiles) {
    const dir = queue.shift();
    let entries = [];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const entry of entries) {
      if (files.length >= maxFiles) break;
      if (IGNORE_DIRS.has(entry.name)) continue;
      const full = path.join(dir, entry.name);
      if (entry.isSymbolicLink()) continue;
      if (entry.isDirectory()) {
        queue.push(full);
      } else if (entry.isFile()) {
        files.push(path.relative(rootDir, full).replace(/\\/g, '/'));
      }
    }
  }
  return files;
}

function extractCssTokens(rootDir, relFiles) {
  const cssFiles = relFiles.filter((f) => /\.(css|scss|sass|less)$/i.test(f) || /tailwind\.config/i.test(f)).slice(0, 12);
  const variables = {};
  const hexColors = new Set();
  const fonts = new Set();

  for (const rel of cssFiles) {
    const text = readTextCapped(path.join(rootDir, rel));
    if (!text) continue;
    let m;
    const varRe = /(--[a-zA-Z0-9_-]+)\s*:\s*([^;\n}]+)/g;
    while ((m = varRe.exec(text)) !== null) {
      if (Object.keys(variables).length < 40) {
        variables[m[1]] = m[2].trim();
      }
    }
    const hexRe = /#[0-9a-fA-F]{6}\b/g;
    while ((m = hexRe.exec(text)) !== null) {
      hexColors.add(m[0].toUpperCase());
    }
    const fontRe = /font-family\s*:\s*([^;\n}]+)/gi;
    while ((m = fontRe.exec(text)) !== null) {
      fonts.add(m[1].trim().replace(/['"]/g, '').split(',')[0].trim());
    }
  }

  return {
    variables,
    colors: Array.from(hexColors).slice(0, 16),
    fonts: Array.from(fonts).filter(Boolean).slice(0, 8)
  };
}

function detectTechStack(rootDir, relFiles) {
  const frameworks = new Set();
  const uiLibraries = new Set();
  const platforms = new Set();
  let projectName = path.basename(rootDir);
  let description = '';

  const pkgPath = path.join(rootDir, 'package.json');
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(readTextCapped(pkgPath) || '{}');
      if (pkg.name) projectName = pkg.name;
      if (pkg.description) description = pkg.description;
      const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
      const has = (name) => Boolean(deps[name]);

      if (has('next')) frameworks.add('Next.js');
      if (has('react')) frameworks.add('React');
      if (has('react-native') || has('expo')) {
        frameworks.add(has('expo') ? 'Expo / React Native' : 'React Native');
        platforms.add('mobile');
      }
      if (has('electron') || has('@tauri-apps/api') || has('@tauri-apps/cli')) {
        frameworks.add(has('electron') ? 'Electron' : 'Tauri');
        platforms.add('desktop');
      }
      if (has('vue') || has('nuxt')) frameworks.add(has('nuxt') ? 'Nuxt' : 'Vue');
      if (has('svelte') || has('@sveltejs/kit')) frameworks.add('Svelte');
      if (has('vite')) frameworks.add('Vite');

      if (has('tailwindcss') || relFiles.some((f) => /tailwind\.config/i.test(f))) uiLibraries.add('Tailwind CSS');
      if (has('@radix-ui/react-dialog') || has('class-variance-authority') || relFiles.some((f) => /components\/ui\//i.test(f))) {
        uiLibraries.add('shadcn/ui / Radix');
      }
      if (has('@mui/material')) uiLibraries.add('Material UI');
      if (has('lucide-react') || has('lucide-react-native')) uiLibraries.add('Lucide Icons');
      if (has('framer-motion') || has('motion')) uiLibraries.add('Motion');
      if (has('nativewind')) uiLibraries.add('NativeWind');
    } catch {}
  }

  if (relFiles.includes('pubspec.yaml')) {
    const pub = readTextCapped(path.join(rootDir, 'pubspec.yaml'));
    if (/flutter:/i.test(pub)) {
      frameworks.add('Flutter');
      platforms.add('mobile');
    }
    const nameMatch = pub.match(/^name:\s*([^\s]+)/m);
    if (nameMatch) projectName = nameMatch[1];
  }

  if (relFiles.some((f) => /src-tauri\/Cargo\.toml/i.test(f))) {
    frameworks.add('Tauri');
    platforms.add('desktop');
  }

  if (!platforms.size) {
    platforms.add('desktop');
    platforms.add('mobile');
  } else if (platforms.has('mobile') && (frameworks.has('Next.js') || frameworks.has('React') || frameworks.has('Vite'))) {
    platforms.add('desktop');
  }

  if (platforms.size === 1 && platforms.has('desktop')) {
    platforms.add('mobile');
  }

  return {
    projectName,
    description,
    frameworks: Array.from(frameworks),
    uiLibraries: Array.from(uiLibraries),
    platforms: Array.from(platforms)
  };
}

function scanProjectCodebase(projectPath) {
  if (!projectPath || !String(projectPath).trim()) {
    return {
      detected: false,
      projectPath: null,
      projectName: 'custom-app',
      description: '',
      frameworks: [],
      uiLibraries: [],
      platforms: ['mobile', 'desktop'],
      hasDesignMd: false,
      hasProductMd: false,
      existingDesignMd: null,
      existingReadmeSummary: '',
      routesOrScreens: [],
      components: [],
      designTokens: { variables: {}, colors: [], fonts: [] },
      fileCountSampled: 0
    };
  }

  const resolved = path.resolve(String(projectPath));
  if (!fs.existsSync(resolved) || !fs.statSync(resolved).isDirectory()) {
    throw new Error(`Project directory not found: ${resolved}`);
  }

  const relFiles = walkProjectFiles(resolved);
  const stack = detectTechStack(resolved, relFiles);
  const designTokens = extractCssTokens(resolved, relFiles);

  const designMdFile = relFiles.find((f) => /^DESIGN\.md$/i.test(f)) || relFiles.find((f) => /DESIGN\.md$/i.test(f));
  const productMdFile = relFiles.find((f) => /^PRODUCT\.md$/i.test(f));
  const readmeFile = relFiles.find((f) => /^README\.md$/i.test(f));

  const existingDesignMd = designMdFile ? readTextCapped(path.join(resolved, designMdFile)).slice(0, 4000) : null;
  const existingReadmeSummary = readmeFile
    ? readTextCapped(path.join(resolved, readmeFile)).split(/\r?\n/).filter(Boolean).slice(0, 12).join(' ').slice(0, 600)
    : '';

  const routesOrScreens = relFiles
    .filter((f) => /(?:^|\/)(?:pages|app|screens|views|routes)\//i.test(f) && /\.(tsx|jsx|ts|js|vue|svelte|dart)$/i.test(f))
    .slice(0, 25);

  const components = relFiles
    .filter((f) => /(?:^|\/)components\//i.test(f) && /\.(tsx|jsx|ts|js|vue|svelte|dart)$/i.test(f))
    .slice(0, 30);

  return {
    detected: true,
    projectPath: resolved,
    projectName: stack.projectName,
    description: stack.description,
    frameworks: stack.frameworks,
    uiLibraries: stack.uiLibraries,
    platforms: stack.platforms,
    hasDesignMd: Boolean(designMdFile),
    hasProductMd: Boolean(productMdFile),
    existingDesignMd,
    existingReadmeSummary,
    routesOrScreens,
    components,
    designTokens,
    fileCountSampled: relFiles.length
  };
}

module.exports = {
  scanProjectCodebase
};
