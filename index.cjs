'use strict';

const {
  DESIGN_DIRECTIONS,
  PLATFORM_GUIDELINES,
  INTERACTIVE_STATES,
  GITHUB_ECOSYSTEM_REFERENCES,
  ANTI_SLOP_BAN_LIST
} = require('./lib/design-library.cjs');
const { scanProjectCodebase } = require('./lib/project-scanner.cjs');
const { searchDesignCatalog, listDesignCatalog, researchDesignEcosystem } = require('./lib/craft-research.cjs');
const { parseHexRgb, computeContrastRatio, auditPaletteContrast, auditAntiSlop } = require('./lib/anti-slop-auditor.cjs');
const { buildDesignMd, buildInteractivePrototypeHtml, buildCodeBundles } = require('./lib/prototype-builder.cjs');
const { DESIGN_CREW, inferDomainProfile, selectDirection, deriveCreativeDirection, runDesignPipeline } = require('./lib/orchestrator.cjs');
const { defaultStudioHome, DesignStore } = require('./lib/store.cjs');
const { createDesignWebServer } = require('./lib/studio-web.cjs');
const { getClientTargets, installStudioClients, checkStudioStatus } = require('./lib/installers.cjs');

module.exports = {
  DESIGN_DIRECTIONS,
  PLATFORM_GUIDELINES,
  INTERACTIVE_STATES,
  GITHUB_ECOSYSTEM_REFERENCES,
  ANTI_SLOP_BAN_LIST,
  DESIGN_CREW,
  scanProjectCodebase,
  searchDesignCatalog,
  listDesignCatalog,
  researchDesignEcosystem,
  parseHexRgb,
  computeContrastRatio,
  auditPaletteContrast,
  auditAntiSlop,
  buildDesignMd,
  buildInteractivePrototypeHtml,
  buildCodeBundles,
  inferDomainProfile,
  selectDirection,
  deriveCreativeDirection,
  runDesignPipeline,
  defaultStudioHome,
  DesignStore,
  createDesignWebServer,
  getClientTargets,
  installStudioClients,
  checkStudioStatus
};
