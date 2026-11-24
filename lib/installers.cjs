'use strict';

const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const SKILL_NAME = 'ui-craft-studio';
const SERVER_NAME = 'ui-craft-studio';
const MAX_CONFIG_BYTES = 2 * 1024 * 1024;

function atomicWriteText(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const tmp = path.join(path.dirname(filePath), `.${path.basename(filePath)}.${process.pid}.${Date.now()}.tmp`);
  fs.writeFileSync(tmp, content, { mode: 0o600 });
  fs.renameSync(tmp, filePath);
}

function readTextSafe(filePath) {
  if (!fs.existsSync(filePath)) return '';
  const st = fs.lstatSync(filePath);
  if (st.isSymbolicLink()) throw new Error(`Refusing symlink config path: ${filePath}`);
  if (!st.isFile() || st.size > MAX_CONFIG_BYTES) {
    throw new Error(`Invalid or oversized config file: ${filePath}`);
  }
  return fs.readFileSync(filePath, 'utf8');
}

function getClientTargets({
  home = os.homedir(),
  appdata = process.env.APPDATA || path.join(home, '.config'),
  platform = process.platform
} = {}) {
  const claudeDesktop =
    platform === 'darwin'
      ? path.join(home, 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json')
      : path.join(appdata, 'Claude', 'claude_desktop_config.json');

  return [
    {
      id: 'codex',
      name: 'Codex',
      format: 'toml',
      configPath: path.join(process.env.CODEX_HOME || path.join(home, '.codex'), 'config.toml'),
      skillDir: path.join(home, '.agents', 'skills', SKILL_NAME),
      extraSkillDirs: [path.join(process.env.CODEX_HOME || path.join(home, '.codex'), 'skills', SKILL_NAME)]
    },
    {
      id: 'gemini',
      name: 'Gemini CLI',
      format: 'json',
      configPath: path.join(home, '.gemini', 'settings.json'),
      skillDir: path.join(home, '.gemini', 'skills', SKILL_NAME)
    },
    {
      id: 'claude-code',
      name: 'Claude Code',
      format: 'json',
      configPath: path.join(home, '.claude.json'),
      skillDir: path.join(home, '.claude', 'skills', SKILL_NAME)
    },
    {
      id: 'claude-desktop',
      name: 'Claude Desktop',
      format: 'json',
      configPath: claudeDesktop,
      skillDir: null
    }
  ];
}

function tomlSectionSpan(text, serverName) {
  const escaped = serverName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const headerRe = new RegExp(`^\\[mcp_servers\\.(?:"${escaped}"|'${escaped}'|${escaped})\\]\\s*$`, 'm');
  const match = headerRe.exec(text);
  if (!match) return null;
  const start = match.index;
  const after = text.slice(start + match[0].length);
  const nextTop = after.search(/\r?\n\[(?!mcp_servers\.(?:"[^"]+"|'[^']+'|[A-Za-z0-9_.-]+)\.env\])[^\]]+\]/);
  const end = nextTop === -1 ? text.length : start + match[0].length + nextTop + 1;
  return [start, end];
}

function formatTomlServerSection(serverName, def) {
  const lines = [
    `[mcp_servers.${serverName}]`,
    `command = ${JSON.stringify(def.command)}`,
    `args = ${JSON.stringify(def.args || [])}`
  ];
  if (def.env && Object.keys(def.env).length > 0) {
    lines.push('', `[mcp_servers.${serverName}.env]`);
    for (const [k, v] of Object.entries(def.env)) {
      lines.push(`${k} = ${JSON.stringify(String(v))}`);
    }
  }
  return lines.join('\n') + '\n';
}

function upsertTomlMcpServer(text, serverName, def) {
  const section = formatTomlServerSection(serverName, def);
  const span = tomlSectionSpan(text, serverName);
  if (span) {
    const before = text.slice(0, span[0]).replace(/\s+$/, '');
    const after = text.slice(span[1]).replace(/^\s+/, '');
    return [before, section.trimEnd(), after].filter(Boolean).join('\n\n') + '\n';
  }
  const base = text.trimEnd();
  return base ? `${base}\n\n${section}` : section;
}

function upsertJsonMcpServer(text, serverName, def) {
  const parsed = text.trim() ? JSON.parse(text) : {};
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Config JSON root must be an object.');
  }
  parsed.mcpServers = parsed.mcpServers && typeof parsed.mcpServers === 'object' ? parsed.mcpServers : {};
  parsed.mcpServers[serverName] = def;
  return JSON.stringify(parsed, null, 2) + '\n';
}

function copyDirRecursive(srcDir, destDir) {
  fs.mkdirSync(destDir, { recursive: true });
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const src = path.join(srcDir, entry.name);
    const dest = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(src, dest);
    } else if (entry.isFile()) {
      fs.copyFileSync(src, dest);
    }
  }
}

function installStudioClients({
  nodeCommand = process.execPath,
  mcpServerScript = path.resolve(__dirname, '..', 'bin', 'mcp-server.cjs'),
  skillSourceDir = path.resolve(__dirname, '..', 'skill'),
  targets = getClientTargets(),
  clientIds = null
} = {}) {
  const selected = Array.isArray(clientIds) && clientIds.length
    ? targets.filter((t) => clientIds.includes(t.id))
    : targets;

  const def = {
    command: nodeCommand,
    args: [mcpServerScript]
  };

  const results = [];
  for (const target of selected) {
    const entry = { id: target.id, name: target.name, configPath: target.configPath, skillDir: target.skillDir };
    try {
      const existing = readTextSafe(target.configPath);
      const next =
        target.format === 'toml'
          ? upsertTomlMcpServer(existing, SERVER_NAME, def)
          : upsertJsonMcpServer(existing, SERVER_NAME, def);
      atomicWriteText(target.configPath, next);
      entry.mcpInstalled = true;
    } catch (err) {
      entry.mcpInstalled = false;
      entry.mcpError = err.message;
    }

    if (target.skillDir && fs.existsSync(skillSourceDir)) {
      try {
        copyDirRecursive(skillSourceDir, target.skillDir);
        for (const extraDir of target.extraSkillDirs || []) {
          copyDirRecursive(skillSourceDir, extraDir);
        }
        entry.skillInstalled = true;
      } catch (err) {
        entry.skillInstalled = false;
        entry.skillError = err.message;
      }
    } else {
      entry.skillInstalled = false;
    }

    results.push(entry);
  }
  return results;
}

function checkStudioStatus(targets = getClientTargets()) {
  return targets.map((t) => {
    let mcpConfigured = false;
    const configExists = fs.existsSync(t.configPath);
    if (configExists) {
      try {
        const raw = readTextSafe(t.configPath);
        if (t.format === 'toml') {
          mcpConfigured = Boolean(tomlSectionSpan(raw, SERVER_NAME));
        } else {
          const parsed = raw.trim() ? JSON.parse(raw) : {};
          mcpConfigured = Boolean(parsed.mcpServers && parsed.mcpServers[SERVER_NAME]);
        }
      } catch {}
    }
    const skillInstalled = Boolean(t.skillDir && fs.existsSync(path.join(t.skillDir, 'SKILL.md')));
    return {
      id: t.id,
      name: t.name,
      configPath: t.configPath,
      configExists,
      mcpConfigured,
      skillDir: t.skillDir,
      skillInstalled
    };
  });
}

module.exports = {
  SKILL_NAME,
  SERVER_NAME,
  getClientTargets,
  upsertTomlMcpServer,
  upsertJsonMcpServer,
  installStudioClients,
  checkStudioStatus
};
