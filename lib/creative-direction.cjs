'use strict';

// Converts a product brief into a deliberately authored visual thesis. The
// references below are case studies and inspiration, never templates to copy.
const CASE_STUDIES = {
  audio: [
    { title: 'Aether 1 — OFF+BRAND', url: 'https://www.itsoffbrand.com/our-work/aether1', lesson: 'Treat the object as the story; use authored 3D assets, staged reveals, and a lightweight mobile fallback.' },
    { title: 'Sennheiser Orpheus — Artificial Rome', url: 'https://artificialrome.com/case/sennheiser-reshaping-excellence', lesson: 'Let a guided camera move reveal meaningful product detail, then return control to the visitor.' },
    { title: 'Building Aether 1 — Codrops', url: 'https://tympanus.net/codrops/2025/08/06/building-aether-1-sound-without-boundaries/', lesson: 'Keep geometry, scroll chapters, and responsive rendering inside one performance budget.' }
  ],
  general: [
    { title: 'Igloo Inc. — abeto case study', url: 'https://frontenddesignbasics.com/cases/igloo-inc/', lesson: 'Build a world around one recognizable metaphor and let the scroll advance that narrative.' },
    { title: 'Aether 1 — OFF+BRAND', url: 'https://www.itsoffbrand.com/our-work/aether1', lesson: 'Pair technical spectacle with clear product information, interaction, and performance.' }
  ]
};

function deriveCreativeDirection({ brief = '', appName = '', domain = '', projectScan = {} } = {}) {
  const text = `${appName} ${brief} ${domain}`.toLowerCase();
  const audioProduct = /\b(headphones?|headsets?|fones?(?: de ouvido)?|earbuds?)\b/.test(text);
  const siteIntent = /\b(website|web site|site|landing page|product page|product launch|brand site|microsite)\b/.test(text);
  const appIntent = /\b(app|application|dashboard|workspace|player)\b/.test(text);
  const audio = (audioProduct && (siteIntent || !appIntent)) || (siteIntent && /\b(audio|som|ac[uú]stic)\b/.test(text));
  const productSite = audio || siteIntent;
  const productName = String(appName || 'Produto').trim();

  if (audio) {
    return {
      mode: 'product-story',
      concept: `${productName}: o som como matéria que se revela`,
      thesis: 'A visita começa com a forma física do produto; cada capítulo mostra uma razão concreta para ouvi-lo, senti-lo ou escolhê-lo.',
      signatureDevice: 'Um grande objeto 3D de estúdio, em escala crível, com arcos acústicos finos que reagem ao scroll; os arcos param quando não acrescentam informação.',
      chapters: [
        'Silhueta: hero amplo, produto girando lentamente e uma frase curta de posicionamento.',
        'Construção: vista explodida curta para revelar materiais e peças reais, com rótulos acessíveis.',
        'Escuta: visualização de áudio sincronizada com uma amostra opcional iniciada pelo visitante; sem autoplay sonoro.',
        'Uso: conforto, controles e autonomia explicados em cenas editoriais, com fatos verificáveis.',
        'Escolha: configurador de acabamento, preço, disponibilidade e ação de compra persistente.'
      ],
      interaction: 'O scroll conduz uma única sequência narrativa; toque/arraste permite girar o modelo; seletor troca acabamento; hotspots revelam especificações e são operáveis por teclado.',
      assetPolicy: 'Preferir modelo GLB criado ou aprovado para o produto, com materiais PBR e escala conferida. Identificar explicitamente qualquer placeholder; não apresentar geometria genérica como modelo final.',
      performance: 'Carregar poster estático primeiro; importar o modelo sob demanda; limitar DPR e partículas em mobile; respeitar prefers-reduced-motion; manter texto, galeria e compra disponíveis sem WebGL.',
      references: CASE_STUDIES.audio,
      sourceConfidence: projectScan && projectScan.detected ? 'brief + repositório analisado' : 'brief fornecido; modelo e especificações não foram verificados'
    };
  }

  if (productSite) {
    return {
      mode: 'brand-story',
      concept: `${productName}: uma ideia visual central, sustentada do primeiro quadro ao último`,
      thesis: 'Definir uma metáfora visual própria com base no produto, mostrar evidências do benefício e fazer cada interação avançar a narrativa ou ajudar uma decisão.',
      signatureDevice: 'Uma única assinatura visual derivada da forma, material, gesto ou contexto de uso do produto; repetir com variação, sem empilhar efeitos.',
      chapters: ['Promessa e imagem hero próprias do produto.', 'Prova: detalhe, demonstração ou transformação que sustenta a promessa.', 'Uso real: contexto e pessoas coerentes com o público.', 'Decisão: comparação, preço e ação principal clara.'],
      interaction: 'Escolher uma interação principal que revele algo; todos os controles secundários devem ajudar orientação, compreensão ou decisão.',
      assetPolicy: 'Usar imagens, ilustrações ou modelos específicos ao produto; placeholders genéricos precisam estar marcados e substituíveis.',
      performance: 'Poster/HTML útil antes de qualquer cena pesada; carregar 3D e vídeo sob demanda; fallback para mobile, baixa potência e movimento reduzido.',
      references: CASE_STUDIES.general,
      sourceConfidence: projectScan && projectScan.detected ? 'brief + repositório analisado' : 'brief fornecido; ativos e afirmações não foram verificados'
    };
  }

  return {
    mode: 'application',
    concept: `${productName}: interface moldada pela tarefa principal`,
    thesis: 'Escolher uma estrutura de navegação e densidade que correspondam às tarefas reais do produto, em vez de impor o mesmo dashboard a todos os domínios.',
    signatureDevice: 'Um padrão de interação ligado à entidade central do produto — por exemplo, timeline, mapa, editor, conversa ou tabela — como protagonista da tela inicial.',
    chapters: ['Entrada: tarefa mais frequente e estado atual.', 'Trabalho: superfície principal de criação/decisão.', 'Revisão: contexto, histórico e recuperação de erros.'],
    interaction: 'Cada ação primária precisa alterar estado visível; manter estados vazio, carregando, erro e sucesso coerentes com a tarefa.',
    assetPolicy: 'Reutilizar componentes, tokens e linguagem já encontrados no repositório antes de criar um visual paralelo.',
    performance: 'Priorizar navegação responsiva, alvos táteis, acessibilidade por teclado e movimento reduzido.',
    references: CASE_STUDIES.general,
    sourceConfidence: projectScan && projectScan.detected ? 'brief + repositório analisado' : 'brief fornecido; sem repositório para estudo'
  };
}

module.exports = { deriveCreativeDirection };
