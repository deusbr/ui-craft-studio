'use strict';

const { renderIcon } = require('./icons.cjs');

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderCompanionSvg(opts = {}) {
  const accent = opts.accent || '#FF7A1A';
  const body = opts.bodyColor || '#323632';
  const belly = opts.bellyColor || '#F4F0E8';
  const size = Number(opts.size) || 44;
  return `<svg width="${size}" height="${size}" viewBox="0 0 64 64" fill="none" aria-hidden="true">
    <ellipse cx="32" cy="58" rx="15" ry="3.5" fill="rgba(0,0,0,0.16)"/>
    <rect x="21" y="45" width="8" height="10" rx="4" fill="${body}"/>
    <rect x="35" y="45" width="8" height="10" rx="4" fill="${body}"/>
    <ellipse cx="32" cy="41" rx="15" ry="13" fill="${body}"/>
    <ellipse cx="32" cy="42" rx="7.5" ry="9.5" fill="${belly}"/>
    <circle cx="15" cy="40" r="4.5" fill="${body}"/>
    <circle cx="49" cy="40" r="4.5" fill="${body}"/>
    <path d="M13 24C12 14 21 9 32 9C43 9 52 14 51 24C50 32 42 36 32 36C22 36 14 32 13 24Z" fill="${body}"/>
    <path d="M29 10L34 3L37 11" fill="${accent}"/>
    <path d="M17 16C18 13 21 12 24 13" stroke="${accent}" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M40 13C43 12 46 13 47 16" stroke="${accent}" stroke-width="2.4" stroke-linecap="round"/>
    <circle cx="24" cy="23" r="3.4" fill="#FFFCF6"/>
    <circle cx="24.6" cy="23.2" r="1.7" fill="#171A17"/>
    <circle cx="40" cy="23" r="4" fill="#FFFCF6"/>
    <circle cx="39.4" cy="23.2" r="1.9" fill="#171A17"/>
    <path d="M28 29C30.5 31 33.5 30.8 36 28.5" stroke="#FFFCF6" stroke-width="2" stroke-linecap="round"/>
  </svg>`;
}

function renderDefaultBrandMark(brandName = 'App', accent = '#FF7A1A') {
  if (/bando/i.test(brandName)) {
    // Coletivo B mark: 3 distinct geometric pieces forming letter B
    return `<svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="6.5" height="24" rx="3.25" fill="currentColor"/>
      <path d="M13.5 4.5H20.5C24.4 4.5 27 7 27 10.4C27 13.7 24.4 15.8 20.5 15.8H13.5V4.5Z" fill="${accent}"/>
      <path d="M13.5 17.5H21.5C25.3 17.5 28 19.9 28 23.1C28 26.2 25.3 28 21.5 28H13.5V17.5Z" fill="currentColor" opacity="0.88"/>
    </svg>`;
  }
  return `<svg width="26" height="26" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <rect x="3" y="3" width="26" height="26" rx="8" fill="${accent}"/>
    <path d="M11 21V11L21 21V11" stroke="#FFFFFF" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

function renderChatOrchestrator(screen, ctx) {
  const data = screen.archetypeData || {};
  const messages = data.messages || [
    {
      role: 'user',
      author: 'Você',
      time: '09:41',
      text: 'Compare os 3 fornecedores de embalagem sustentável e gere a planilha executiva com prazos e custos.'
    },
    {
      role: 'agent',
      author: data.leadAgent || 'Bando',
      badge: 'Orquestrador',
      time: '09:41',
      text: 'Missão organizada. Acionei pesquisa de preços, conferência de prazos e geração do comparativo final.',
      steps: [
        { label: 'Lendo catálogos e cotações em 3 fornecedores', state: 'done', agent: 'Pesquisadora' },
        { label: 'Calculando frete e imposto por lote mínimo', state: 'done', agent: 'Analista' },
        { label: 'Compilando entrega em PDF + CSV auditável', state: 'active', agent: 'Editor' }
      ],
      artifact: {
        title: 'Comparativo_Embalagens_Q4.pdf',
        meta: '4 páginas • Tabela de TCO e economia estimada de 18%',
        actionLabel: 'Abrir entrega',
        targetScreen: data.deliverableScreenId || 'sandbox'
      }
    }
  ];
  const prompts = data.quickPrompts || [
    'Resumo executivo para reunião',
    'Acionar especialista financeiro',
    'Agendar acompanhamento semanal'
  ];
  const teamPills = data.specialists || [
    { name: 'Bando', role: 'Orquestrador', status: 'active' },
    { name: 'Clara', role: 'Pesquisa Web', status: 'busy' },
    { name: 'Mateus', role: 'Código & Dados', status: 'busy' },
    { name: 'Nina', role: 'Design & Entrega', status: 'ready' }
  ];

  return `
  <section class="archetype-chat" data-archetype="chat-orchestrator">
    <div class="chat-stage-top">
      <div class="chat-identity-strip">
        <div class="companion-pill">
          ${renderCompanionSvg({ accent: ctx.palette.accent, size: 40 })}
          <div>
            <div class="companion-title">${escapeHtml(data.missionTitle || screen.title)}</div>
            <div class="companion-sub">${escapeHtml(screen.subtitle || 'Equipe coordenada em paralelo com entregas rastreáveis')}</div>
          </div>
        </div>
        ${data.switchToSpatialLabel ? `
          <button type="button" class="pill-switch-cta" data-jump-screen="${escapeHtml(data.spatialScreenId || 'office')}">
            ${renderIcon('cube', { size: 16 })}
            <span>${escapeHtml(data.switchToSpatialLabel)}</span>
          </button>
        ` : ''}
      </div>
      <div class="specialist-ribbon" role="list" aria-label="Especialistas ativos">
        ${teamPills.map((sp) => `
          <button type="button" class="specialist-chip" data-specialist="${escapeHtml(sp.name)}">
            <span class="pulse-dot status-${escapeHtml(sp.status)}"></span>
            <strong>${escapeHtml(sp.name)}</strong>
            <span class="chip-role">${escapeHtml(sp.role)}</span>
          </button>
        `).join('')}
      </div>
    </div>

    <div class="chat-thread" id="chatThread-${escapeHtml(screen.id)}">
      ${messages.map((m) => `
        <article class="chat-msg chat-msg--${m.role === 'user' ? 'user' : 'agent'}">
          <div class="chat-msg-meta">
            <span class="chat-author">${escapeHtml(m.author)}</span>
            ${m.badge ? `<span class="meta-badge">${escapeHtml(m.badge)}</span>` : ''}
            <span class="chat-time">${escapeHtml(m.time)}</span>
          </div>
          <p class="chat-bubble">${escapeHtml(m.text)}</p>
          ${Array.isArray(m.steps) ? `
            <details class="tool-timeline" open>
              <summary>${renderIcon('zap', { size: 14 })} <span>Etapas em andamento (${m.steps.length})</span></summary>
              <ul class="timeline-list">
                ${m.steps.map((st) => `
                  <li class="timeline-item is-${st.state}">
                    <span class="timeline-ico">${st.state === 'done' ? renderIcon('checkCircle', { size: 15 }) : renderIcon('refresh', { size: 15 })}</span>
                    <span class="timeline-label">${escapeHtml(st.label)}</span>
                    <span class="timeline-owner">${escapeHtml(st.agent)}</span>
                  </li>
                `).join('')}
              </ul>
            </details>
          ` : ''}
          ${m.artifact ? `
            <div class="artifact-embed">
              <div class="artifact-embed-icon">${renderIcon('doc', { size: 20 })}</div>
              <div class="artifact-embed-copy">
                <strong>${escapeHtml(m.artifact.title)}</strong>
                <span>${escapeHtml(m.artifact.meta)}</span>
              </div>
              <button type="button" class="btn-secondary btn-sm" data-jump-screen="${escapeHtml(m.artifact.targetScreen || 'sandbox')}">
                <span>${escapeHtml(m.artifact.actionLabel || 'Visualizar')}</span>
                ${renderIcon('arrowRight', { size: 14 })}
              </button>
            </div>
          ` : ''}
        </article>
      `).join('')}
    </div>

    <div class="chat-composer-dock">
      <div class="prompt-chips">
        ${prompts.map((p) => `<button type="button" class="prompt-chip" data-prompt-fill="${escapeHtml(p)}">${escapeHtml(p)}</button>`).join('')}
      </div>
      <form class="chat-form" data-chat-form="${escapeHtml(screen.id)}">
        <button type="button" class="icon-btn" title="Anexar arquivo" aria-label="Anexar arquivo">${renderIcon('paperclip', { size: 18 })}</button>
        <input type="text" class="chat-input" placeholder="${escapeHtml(data.composerPlaceholder || 'Peça uma missão ou oriente o Bando...')}" aria-label="Mensagem para a equipe" />
        <button type="button" class="icon-btn" title="Ditado por voz" aria-label="Ditado por voz">${renderIcon('mic', { size: 18 })}</button>
        <button type="submit" class="btn-primary send-btn">${renderIcon('send', { size: 16 })}<span>Enviar</span></button>
      </form>
    </div>
  </section>`;
}

function renderSpatialWorkspace(screen, ctx) {
  const data = screen.archetypeData || {};
  const agents = data.agents || [
    { id: 'bando', name: 'Bando', role: 'Orquestrador', zone: 'Comando', status: 'active', task: 'Coordenando 3 especialistas na missão Q4', x: 430, y: 152, color: ctx.palette.accent },
    { id: 'clara', name: 'Clara', role: 'Pesquisa Web', zone: 'Pesquisa', status: 'busy', task: 'Lendo 14 PDFs e comparando preços', x: 245, y: 215, color: '#3B82F6' },
    { id: 'mateus', name: 'Mateus', role: 'Código & Dados', zone: 'Sandbox', status: 'busy', task: 'Executando script Python no sandbox seguro', x: 605, y: 225, color: '#10B981' },
    { id: 'nina', name: 'Nina', role: 'Design & Entrega', zone: 'Ateliê', status: 'waiting', task: 'Aguardando aprovação final de layout', x: 350, y: 315, color: '#F59E0B' },
    { id: 'lucas', name: 'Lucas', role: 'Rotinas & Agenda', zone: 'Operações', status: 'ready', task: 'Monitorando webhooks e prazos diários', x: 540, y: 335, color: '#8B5CF6' }
  ];
  const zones = ['Todos', ...new Set(agents.map((a) => a.zone))];
  const firstAgent = agents[0];

  return `
  <section class="archetype-spatial" data-archetype="spatial-workspace">
    <div class="spatial-toolbar">
      <div class="spatial-tabs" role="tablist">
        ${zones.map((z, idx) => `<button type="button" class="zone-pill ${idx === 0 ? 'is-active' : ''}" data-zone-filter="${escapeHtml(z)}">${escapeHtml(z)}</button>`).join('')}
      </div>
      <div class="spatial-actions">
        <button type="button" class="btn-secondary btn-sm" data-toggle-expand="true">
          ${renderIcon('plus', { size: 14 })}<span>Expandir ala</span>
        </button>
        ${data.switchToChatLabel ? `
          <button type="button" class="pill-switch-cta" data-jump-screen="${escapeHtml(data.chatScreenId || 'chat')}">
            ${renderIcon('chat', { size: 15 })}<span>${escapeHtml(data.switchToChatLabel)}</span>
          </button>
        ` : ''}
      </div>
    </div>

    <div class="spatial-grid">
      <div class="iso-canvas-wrap">
        <svg class="iso-office-svg" viewBox="0 0 880 460" role="img" aria-label="Mapa espacial interativo da equipe">
          <defs>
            <linearGradient id="isoFloorGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="${ctx.palette.surface}" />
              <stop offset="100%" stop-color="${ctx.palette.surfaceAlt}" />
            </linearGradient>
            <linearGradient id="isoGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="${ctx.palette.accent}" stop-opacity="0.24" />
              <stop offset="100%" stop-color="${ctx.palette.accent}" stop-opacity="0" />
            </linearGradient>
          </defs>

          <!-- Main Isometric Floor Slab -->
          <polygon points="440,56 790,230 440,404 90,230" fill="url(#isoFloorGrad)" stroke="${ctx.palette.border}" stroke-width="2"/>
          <polygon points="90,230 440,404 440,426 90,252" fill="${ctx.palette.surfaceAlt}" stroke="${ctx.palette.border}" stroke-width="1.5"/>
          <polygon points="790,230 440,404 440,426 790,252" fill="${ctx.palette.bg}" stroke="${ctx.palette.border}" stroke-width="1.5"/>

          <!-- Subtle Architectural Grid -->
          <g stroke="${ctx.palette.border}" stroke-width="0.9" opacity="0.55">
            <line x1="265" y1="143" x2="615" y2="317"/>
            <line x1="615" y1="143" x2="265" y2="317"/>
            <line x1="178" y1="186" x2="528" y2="360"/>
            <line x1="702" y1="186" x2="352" y2="360"/>
          </g>

          <!-- Room Zone Highlights -->
          <polygon points="440,86 590,160 440,234 290,160" fill="url(#isoGlow)" stroke="${ctx.palette.accent}" stroke-opacity="0.35" stroke-width="1.2"/>
          <text x="440" y="106" text-anchor="middle" font-size="11" font-weight="600" fill="${ctx.palette.muted}">COMANDO CENTRAL</text>
          <text x="235" y="182" text-anchor="middle" font-size="10.5" font-weight="600" fill="${ctx.palette.muted}">PESQUISA</text>
          <text x="635" y="182" text-anchor="middle" font-size="10.5" font-weight="600" fill="${ctx.palette.muted}">SANDBOX</text>

          <!-- Expandable Annex Wing (toggled via JS) -->
          <g class="iso-annex" style="opacity:0.45; transition: opacity .25s ease;">
            <polygon points="720,120 845,182 775,217 650,155" fill="none" stroke="${ctx.palette.accent}" stroke-dasharray="5 5" stroke-width="1.6"/>
            <text x="748" y="172" text-anchor="middle" font-size="10.5" font-weight="600" fill="${ctx.palette.linkAccent || ctx.palette.accent}">+ NOVA ALA</text>
          </g>

          <!-- Connection Beams from Orchestrator to Agents -->
          <g stroke="${ctx.palette.accent}" stroke-width="1.5" stroke-dasharray="4 4" opacity="0.5">
            ${agents.slice(1).map((a) => `<line x1="${firstAgent.x}" y1="${firstAgent.y}" x2="${a.x}" y2="${a.y}" />`).join('')}
          </g>

          <!-- Interactive Desks & Agents -->
          ${agents.map((ag, idx) => `
            <g class="iso-node ${idx === 0 ? 'is-selected' : ''}" data-agent-select="${escapeHtml(ag.id)}" data-zone="${escapeHtml(ag.zone)}" tabindex="0" role="button" aria-label="${escapeHtml(ag.name)} — ${escapeHtml(ag.role)}" style="cursor:pointer;">
              <!-- Desk Slab -->
              <polygon points="${ag.x},${ag.y + 8} ${ag.x + 42},${ag.y + 28} ${ag.x},${ag.y + 48} ${ag.x - 42},${ag.y + 28}" fill="${ctx.palette.surface}" stroke="${idx === 0 ? ctx.palette.accent : ctx.palette.border}" stroke-width="1.6"/>
              <!-- Mini Monitor -->
              <polygon points="${ag.x - 10},${ag.y + 4} ${ag.x + 12},${ag.y - 6} ${ag.x + 12},${ag.y + 10} ${ag.x - 10},${ag.y + 20}" fill="${ctx.palette.bg}" stroke="${ctx.palette.border}" stroke-width="1.2"/>
              <line x1="${ag.x - 4}" y1="${ag.y + 8}" x2="${ag.x + 6}" y2="${ag.y + 3}" stroke="${ag.color}" stroke-width="2" stroke-linecap="round"/>
              <!-- Avatar / Mascot Head -->
              <circle cx="${ag.x}" cy="${ag.y - 8}" r="15" fill="${ag.id === 'bando' ? ctx.palette.accent : ctx.palette.surfaceAlt}" stroke="${ag.color}" stroke-width="2.2"/>
              <text x="${ag.x}" y="${ag.y - 4}" text-anchor="middle" font-size="11" font-weight="700" fill="${ag.id === 'bando' ? ctx.palette.accentText : ctx.palette.text}">${escapeHtml(ag.name.slice(0, 2).toUpperCase())}</text>
              <!-- Status Dot -->
              <circle cx="${ag.x + 12}" cy="${ag.y - 18}" r="4.5" fill="${ag.status === 'waiting' ? ctx.palette.warning : ag.status === 'busy' || ag.status === 'active' ? ctx.palette.accent : ctx.palette.success}" stroke="${ctx.palette.surface}" stroke-width="1.5"/>
              <!-- Nameplate -->
              <rect x="${ag.x - 42}" y="${ag.y + 52}" width="84" height="22" rx="11" fill="${ctx.palette.surface}" stroke="${ctx.palette.border}" stroke-width="1"/>
              <text x="${ag.x}" y="${ag.y + 66.5}" text-anchor="middle" font-size="11" font-weight="600" fill="${ctx.palette.text}">${escapeHtml(ag.name)}</text>
            </g>
          `).join('')}
        </svg>
      </div>

      <aside class="spatial-inspector" id="spatialInspector-${escapeHtml(screen.id)}">
        <div class="inspector-head">
          <div class="agent-badge-lg">${escapeHtml(firstAgent.name.slice(0, 2).toUpperCase())}</div>
          <div>
            <h3 data-sp-name>${escapeHtml(firstAgent.name)}</h3>
            <p data-sp-role>${escapeHtml(firstAgent.role)} • Zona ${escapeHtml(firstAgent.zone)}</p>
          </div>
        </div>
        <div class="spatial-status-pill" data-sp-status>Em atividade</div>
        <p class="spatial-task-copy" data-sp-task>${escapeHtml(firstAgent.task)}</p>
        <div class="spatial-specs">
          <div><span>Sandbox</span><strong>sandbox-${escapeHtml(firstAgent.id)}.cloud</strong></div>
          <div><span>Canal dedicado</span><strong>${escapeHtml(firstAgent.id)}@bando.work</strong></div>
        </div>
        <div class="spatial-inspector-actions">
          <button type="button" class="btn-primary" data-jump-screen="${escapeHtml(data.chatScreenId || 'chat')}">
            ${renderIcon('chat', { size: 16 })}<span>Conversar com especialista</span>
          </button>
          <button type="button" class="btn-secondary" data-jump-screen="${escapeHtml(data.sandboxScreenId || 'sandbox')}">
            ${renderIcon('terminal', { size: 16 })}<span>Ver sandbox ao vivo</span>
          </button>
        </div>
      </aside>
    </div>

    <script type="application/json" data-spatial-agents>${JSON.stringify(agents)}</script>
  </section>`;
}

function renderSandboxDeliverables(screen, ctx) {
  const data = screen.archetypeData || {};
  const docs = data.files || [
    { name: 'Relatorio_Comparativo_Q4.pdf', size: '1.4 MB', kind: 'Documento final', previewTitle: 'Comparativo de Fornecedores — Resumo Executivo', bullets: ['Economia estimada de 18,4% no contrato anual mantendo SLA de 48h.', 'Fornecedor B validado em auditoria ambiental e estoque local.', 'Cronograma de migração dividido em 3 lotes sem parada operacional.'] },
    { name: 'Planilha_TCO_Fornecedores.xlsx', size: '420 KB', kind: 'Planilha auditável', previewTitle: 'Matriz de Custos e Impostos (TCO 12 meses)', bullets: ['Custo unitário cai de R$ 14,20 para R$ 11,58 no lote de 5 mil unidades.', 'Frete CIF incluso para regiões Sul e Sudeste.', 'Margem de segurança calculada para variação cambial de até 8%.'] },
    { name: 'Checklist_Aprovacao.md', size: '18 KB', kind: 'Minuta pronta', previewTitle: 'Próximos Passos para Assinatura', bullets: ['Confirmar amostra física até quinta-feira.', 'Liberar pedido piloto via sandbox financeiro.', 'Agendar revisão automática em 30 dias.'] }
  ];
  const logs = data.logs || [
    '09:41:04 [browser] Abrindo portal de cotações...',
    '09:41:12 [python] Normalizando tabelas PDF -> CSV (3 fornecedores)',
    '09:41:19 [audit] Contrastes, prazos e impostos conferidos',
    '09:41:24 [ready] Entrega pronta para revisão humana'
  ];

  return `
  <section class="archetype-sandbox" data-archetype="sandbox-deliverables">
    <div class="sandbox-split">
      <div class="deliverable-pane">
        <div class="pane-header">
          <div>
            <h3>${escapeHtml(screen.title)}</h3>
            <p>${escapeHtml(screen.subtitle || 'Arquivos produzidos pela equipe com revisão direta')}</p>
          </div>
          <button type="button" class="btn-secondary btn-sm" data-toast-msg="Pacote ZIP pronto para download">
            ${renderIcon('download', { size: 15 })}<span>Baixar tudo</span>
          </button>
        </div>

        <div class="file-tabs">
          ${docs.map((d, i) => `
            <button type="button" class="file-tab ${i === 0 ? 'is-active' : ''}" data-file-idx="${i}">
              ${renderIcon('doc', { size: 15 })}
              <span>${escapeHtml(d.name)}</span>
            </button>
          `).join('')}
        </div>

        <article class="doc-sheet" id="docPreview-${escapeHtml(screen.id)}">
          <div class="doc-sheet-badge" data-doc-kind>${escapeHtml(docs[0].kind)} • ${escapeHtml(docs[0].size)}</div>
          <h4 data-doc-title>${escapeHtml(docs[0].previewTitle)}</h4>
          <ul class="doc-bullets" data-doc-bullets>
            ${docs[0].bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join('')}
          </ul>
          <div class="mini-bar-chart" aria-hidden="true">
            <div class="bar-row"><span>Atual</span><div class="bar-track"><div class="bar-fill is-muted" style="width:88%"></div></div><strong>R$ 71k</strong></div>
            <div class="bar-row"><span>Fornecedor B</span><div class="bar-track"><div class="bar-fill" style="width:66%"></div></div><strong>R$ 58k</strong></div>
            <div class="bar-row"><span>Fornecedor C</span><div class="bar-track"><div class="bar-fill is-muted" style="width:74%"></div></div><strong>R$ 63k</strong></div>
          </div>
        </article>
      </div>

      <div class="computer-pane">
        <div class="computer-chrome">
          <div class="chrome-dots"><span></span><span></span><span></span></div>
          <div class="chrome-url">${renderIcon('globe', { size: 13 })}<span>sandbox://clara-pesquisa/comparativo-q4</span></div>
          <span class="live-tag">Sandbox Isolado</span>
        </div>
        <div class="computer-terminal">
          ${logs.map((line) => `<div class="term-line">${escapeHtml(line)}</div>`).join('')}
        </div>
        <form class="revision-bar" data-revision-form="${escapeHtml(screen.id)}">
          <input type="text" placeholder="Pedir ajuste nesta entrega (ex: incluir frete Nordeste)..." aria-label="Pedir ajuste" />
          <button type="submit" class="btn-primary btn-sm">${renderIcon('send', { size: 14 })}<span>Revisar</span></button>
        </form>
      </div>
    </div>
    <script type="application/json" data-deliverable-docs>${JSON.stringify(docs)}</script>
  </section>`;
}

function renderRoutinesVault(screen) {
  const data = screen.archetypeData || {};
  const approvals = data.approvals || [
    { id: 'apr-1', title: 'Autorizar acesso de leitura ao Gmail corporativo', agent: 'Clara • Pesquisa', scope: 'Escopo mínimo: somente faturas dos últimos 30 dias' }
  ];
  const routines = data.routines || [
    { id: 'rt-1', title: 'Radar matinal de concorrência', cadence: 'Seg–Sex • 07:30', active: true, owner: 'Clara' },
    { id: 'rt-2', title: 'Conciliação de notas e recibos', cadence: 'Todo dia • 18:00', active: true, owner: 'Mateus' },
    { id: 'rt-3', title: 'Checklist de releases GitHub', cadence: 'Sextas • 16:00', active: false, owner: 'Lucas' }
  ];
  const vault = data.vault || [
    { agent: 'Clara', email: 'clara@bando.work', sandbox: 'Ubuntu Cloud #04', state: 'Isolado' },
    { agent: 'Mateus', email: 'mateus@bando.work', sandbox: 'Node + Python VM', state: 'Ativo' },
    { agent: 'Nina', email: 'nina@bando.work', sandbox: 'Figma + Browser', state: 'Pronto' }
  ];

  return `
  <section class="archetype-routines" data-archetype="routines-vault">
    <div class="approval-stack">
      ${approvals.map((ap) => `
        <div class="approval-banner" data-approval-card="${escapeHtml(ap.id)}">
          <div class="approval-icon">${renderIcon('shield', { size: 20 })}</div>
          <div class="approval-copy">
            <strong>${escapeHtml(ap.title)}</strong>
            <span>${escapeHtml(ap.agent)} — ${escapeHtml(ap.scope)}</span>
          </div>
          <div class="approval-actions">
            <button type="button" class="btn-secondary btn-sm" data-resolve-approval="${escapeHtml(ap.id)}" data-decision="negado">Recusar</button>
            <button type="button" class="btn-primary btn-sm" data-resolve-approval="${escapeHtml(ap.id)}" data-decision="aprovado">${renderIcon('check', { size: 14 })}<span>Autorizar</span></button>
          </div>
        </div>
      `).join('')}
    </div>

    <div class="routines-two-col">
      <div class="panel-card">
        <div class="panel-head">
          <h3>Rotinas agendadas</h3>
          <span class="panel-sub">Execução autônoma em segundo plano</span>
        </div>
        <div class="routine-list">
          ${routines.map((rt) => `
            <div class="routine-row">
              <div>
                <strong>${escapeHtml(rt.title)}</strong>
                <div class="routine-meta">${renderIcon('clock', { size: 13 })}<span>${escapeHtml(rt.cadence)} • ${escapeHtml(rt.owner)}</span></div>
              </div>
              <button type="button" class="switch-btn ${rt.active ? 'is-on' : ''}" role="switch" aria-checked="${rt.active ? 'true' : 'false'}" data-toggle-switch>
                <span class="switch-knob"></span>
              </button>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="panel-card">
        <div class="panel-head">
          <h3>Identidade & Sandboxes</h3>
          <span class="panel-sub">Contas isoladas por especialista</span>
        </div>
        <div class="vault-list">
          ${vault.map((v) => `
            <div class="vault-row">
              <div class="vault-ico">${renderIcon('lock', { size: 16 })}</div>
              <div class="vault-copy">
                <strong>${escapeHtml(v.agent)}</strong>
                <span>${escapeHtml(v.email)} • ${escapeHtml(v.sandbox)}</span>
              </div>
              <span class="status-chip">${escapeHtml(v.state)}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  </section>`;
}

function renderFintechCockpit(screen, ctx) {
  const data = screen.archetypeData || {};
  const series = data.series || {
    '7D': { total: 'R$ 148.920,40', delta: '+4,8% na semana', path: 'M 0 110 L 70 96 L 140 102 L 210 74 L 280 68 L 350 40 L 420 26', area: 'M 0 110 L 70 96 L 140 102 L 210 74 L 280 68 L 350 40 L 420 26 L 420 140 L 0 140 Z' },
    '30D': { total: 'R$ 148.920,40', delta: '+14,2% no mês', path: 'M 0 120 L 70 112 L 140 88 L 210 92 L 280 54 L 350 48 L 420 18', area: 'M 0 120 L 70 112 L 140 88 L 210 92 L 280 54 L 350 48 L 420 18 L 420 140 L 0 140 Z' },
    '1A': { total: 'R$ 148.920,40', delta: '+38,6% no ano', path: 'M 0 130 L 70 118 L 140 104 L 210 86 L 280 64 L 350 38 L 420 12', area: 'M 0 130 L 70 118 L 140 104 L 210 86 L 280 64 L 350 38 L 420 12 L 420 140 L 0 140 Z' }
  };
  const ledger = data.ledger || [
    { name: 'Liquidação AWS Cloud', meta: 'Hoje • 08:15 • Cartão virtual', amount: '-R$ 1.840,00', kind: 'out' },
    { name: 'Recebimento Stripe BR', meta: 'Ontem • 17:42 • Liquidação Pix', amount: '+R$ 18.450,00', kind: 'in' },
    { name: 'Reserva CDB Liquidez', meta: 'Ontem • 10:00 • Aplicação automática', amount: '+R$ 4.200,00', kind: 'in' }
  ];

  return `
  <section class="archetype-fintech" data-archetype="fintech-cockpit">
    <div class="fintech-grid">
      <div class="panel-card chart-panel">
        <div class="chart-top">
          <div>
            <span class="panel-sub">Saldo consolidado</span>
            <h3 class="balance-fig" data-ft-total>${escapeHtml(series['30D'].total)}</h3>
            <span class="delta-badge" data-ft-delta>${escapeHtml(series['30D'].delta)}</span>
          </div>
          <div class="range-pills">
            ${Object.keys(series).map((k) => `<button type="button" class="range-pill ${k === '30D' ? 'is-active' : ''}" data-ft-range="${k}">${k}</button>`).join('')}
          </div>
        </div>
        <svg class="cashflow-svg" viewBox="0 0 420 140" preserveAspectRatio="none" aria-label="Gráfico de fluxo de caixa">
          <defs>
            <linearGradient id="cashArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="${ctx.palette.accent}" stop-opacity="0.28"/>
              <stop offset="100%" stop-color="${ctx.palette.accent}" stop-opacity="0"/>
            </linearGradient>
          </defs>
          <path data-ft-area d="${series['30D'].area}" fill="url(#cashArea)"/>
          <path data-ft-line d="${series['30D'].path}" fill="none" stroke="${ctx.palette.accent}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>

      <div class="virtual-card-box" id="virtualCardBox">
        <div class="vcard-surface">
          <div class="vcard-row">
            <span>CARTÃO CORPORATIVO</span>
            ${renderIcon('card', { size: 20 })}
          </div>
          <div class="vcard-number" data-card-num>•••• •••• •••• 4829</div>
          <div class="vcard-row">
            <div><small>TITULAR</small><strong>EMERSON ALMEIDA</strong></div>
            <div><small>CVV</small><strong data-card-cvv>•••</strong></div>
          </div>
        </div>
        <div class="vcard-actions">
          <button type="button" class="btn-secondary btn-sm" data-card-reveal="true">Revelar CVV</button>
          <button type="button" class="btn-secondary btn-sm" data-card-freeze="true">Congelar cartão</button>
        </div>
      </div>
    </div>

    <div class="panel-card">
      <div class="panel-head">
        <h3>Movimentações recentes</h3>
        <button type="button" class="btn-primary btn-sm" data-toast-msg="Fluxo de transferência instantânea pronto">Nova transferência</button>
      </div>
      <div class="ledger-list">
        ${ledger.map((tx) => `
          <div class="ledger-row">
            <div>
              <strong>${escapeHtml(tx.name)}</strong>
              <span>${escapeHtml(tx.meta)}</span>
            </div>
            <strong class="ledger-amt is-${tx.kind}">${escapeHtml(tx.amount)}</strong>
          </div>
        `).join('')}
      </div>
    </div>
    <script type="application/json" data-fintech-series>${JSON.stringify(series)}</script>
  </section>`;
}

function renderCommerceEditorial(screen, ctx) {
  const data = screen.archetypeData || {};
  const products = data.products || [
    { id: 'p1', name: 'Luminária Arco Brushed', category: 'Iluminação', price: 'R$ 890', tag: 'Edição limitada' },
    { id: 'p2', name: 'Teclado Mecânico 65%', category: 'Mesa de trabalho', price: 'R$ 1.240', tag: 'Alumínio anodizado' },
    { id: 'p3', name: 'Suporte Vertical Walnut', category: 'Acessórios', price: 'R$ 420', tag: 'Nogueira maciça' }
  ];

  return `
  <section class="archetype-commerce" data-archetype="commerce-editorial">
    <div class="editorial-banner">
      <div>
        <h2>${escapeHtml(screen.title)}</h2>
        <p>${escapeHtml(screen.subtitle || 'Curadoria de objetos de mesa com acabamento arquitetônico')}</p>
      </div>
      <button type="button" class="btn-primary" data-cart-open="true">
        ${renderIcon('bag', { size: 16 })}<span>Sacola (<span data-cart-count>1</span>)</span>
      </button>
    </div>
    <div class="product-grid">
      ${products.map((p, idx) => `
        <article class="product-card">
          <div class="product-art">
            <svg viewBox="0 0 180 120" width="100%" height="120" aria-hidden="true">
              <rect x="0" y="0" width="180" height="120" rx="12" fill="${ctx.palette.surfaceAlt}"/>
              <circle cx="${60 + idx * 24}" cy="60" r="30" fill="${ctx.palette.accent}" opacity="0.22"/>
              <rect x="${50 + idx * 14}" y="36" width="68" height="48" rx="10" fill="${ctx.palette.surface}" stroke="${ctx.palette.border}" stroke-width="1.5"/>
            </svg>
          </div>
          <div class="product-meta">
            <span>${escapeHtml(p.category)}</span>
            <strong>${escapeHtml(p.price)}</strong>
          </div>
          <h3>${escapeHtml(p.name)}</h3>
          <p>${escapeHtml(p.tag)}</p>
          <button type="button" class="btn-secondary btn-sm" data-add-cart="${escapeHtml(p.name)}">Adicionar à sacola</button>
        </article>
      `).join('')}
    </div>
  </section>`;
}

function renderSaasCockpit(screen, ctx) {
  const records = Array.isArray(screen.records) && screen.records.length ? screen.records : [
    { id: 'rec-1', title: 'Revisão clínica — Unidade Sul', owner: 'Dra. Camila', status: 'Em dia', priority: 'Alta', updated: 'há 8 min', summary: 'Todos os prontuários digitais sincronizados e prontos para triagem.' },
    { id: 'rec-2', title: 'Faturamento TISS lote #409', owner: 'Financeiro', status: 'Revisar', priority: 'Média', updated: 'há 25 min', summary: '2 guias aguardando confirmação de anexo complementar.' },
    { id: 'rec-3', title: 'Escala plantão fim de semana', owner: 'Coordenação', status: 'Ativo', priority: 'Normal', updated: 'há 1 h', summary: 'Cobertura de 100% das salas confirmada.' }
  ];
  const first = records[0];

  return `
  <section class="archetype-saas" data-archetype="saas-cockpit">
    <div class="saas-split">
      <div class="panel-card">
        <div class="panel-head">
          <div>
            <h3>${escapeHtml(screen.title)}</h3>
            <p class="panel-sub">${escapeHtml(screen.subtitle || 'Registros ativos com inspeção contextual')}</p>
          </div>
          <button type="button" class="btn-primary btn-sm" data-toast-msg="Novo item criado na fila">${renderIcon('plus', { size: 15 })}<span>Novo</span></button>
        </div>
        <div class="saas-rows">
          ${records.map((r, i) => `
            <button type="button" class="saas-row ${i === 0 ? 'is-selected' : ''}" data-saas-row="${i}">
              <div class="saas-row-main">
                <strong>${escapeHtml(r.title)}</strong>
                <span>${escapeHtml(r.owner)} • ${escapeHtml(r.updated || 'agora')}</span>
              </div>
              <span class="status-chip">${escapeHtml(r.status)}</span>
            </button>
          `).join('')}
        </div>
      </div>

      <aside class="panel-card saas-inspector">
        <span class="panel-sub">Detalhe selecionado</span>
        <h3 data-saas-title>${escapeHtml(first.title)}</h3>
        <p class="spatial-task-copy" data-saas-summary>${escapeHtml(first.summary || first.owner)}</p>
        <div class="spatial-specs">
          <div><span>Responsável</span><strong data-saas-owner>${escapeHtml(first.owner)}</strong></div>
          <div><span>Prioridade</span><strong data-saas-priority>${escapeHtml(first.priority || 'Normal')}</strong></div>
        </div>
        <button type="button" class="btn-primary" data-toast-msg="Ação aplicada ao registro selecionado">Executar ação</button>
      </aside>
    </div>
    <script type="application/json" data-saas-records>${JSON.stringify(records)}</script>
  </section>`;
}

function renderScreenArchetype(screen, ctx) {
  const type = String(screen.type || 'saas-cockpit').toLowerCase();
  if (type === 'chat-orchestrator' || type === 'chat') return renderChatOrchestrator(screen, ctx);
  if (type === 'spatial-workspace' || type === 'spatial-3d-office' || type === 'spatial') return renderSpatialWorkspace(screen, ctx);
  if (type === 'sandbox-deliverables' || type === 'deliverables' || type === 'sandbox') return renderSandboxDeliverables(screen, ctx);
  if (type === 'routines-vault' || type === 'routines' || type === 'vault') return renderRoutinesVault(screen, ctx);
  if (type === 'fintech-cockpit' || type === 'fintech') return renderFintechCockpit(screen, ctx);
  if (type === 'commerce-editorial' || type === 'commerce') return renderCommerceEditorial(screen, ctx);
  return renderSaasCockpit(screen, ctx);
}

module.exports = {
  escapeHtml,
  renderCompanionSvg,
  renderDefaultBrandMark,
  renderScreenArchetype
};
