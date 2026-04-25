#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const rootDir = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', '..');
const currentPhasePath = path.join(rootDir, '.opencode', 'plans', 'current-phase.md');
const backlogPath = path.join(rootDir, '.opencode', 'backlog', 'candidates.yaml');

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function extractLineValue(text, prefix) {
  const line = text
    .split('\n')
    .find((entry) => entry.trim().startsWith(prefix));

  if (!line) {
    return null;
  }

  return line.split(prefix)[1]?.trim() ?? null;
}

const currentPhase = readText(currentPhasePath);
const backlog = readText(backlogPath);
const phaseId = extractLineValue(currentPhase, '- id:');
const phaseStatus = extractLineValue(currentPhase, '- status:');
const backlogHasPhase = phaseId ? backlog.includes(`- id: ${phaseId}`) : false;
const activeHandoffPath = phaseId
  ? path.join(rootDir, '.opencode', 'plans', `${phaseId}-handoff.md`)
  : null;
const activeHandoffRelativePath = activeHandoffPath ? path.relative(rootDir, activeHandoffPath) : null;
const activeHandoffExists = activeHandoffPath ? fs.existsSync(activeHandoffPath) : false;
const activeHandoff = activeHandoffExists ? readText(activeHandoffPath) : null;

function normalizeMarkdownValue(value) {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();

  if (trimmed.startsWith('`') && trimmed.endsWith('`')) {
    return trimmed.slice(1, -1);
  }

  return trimmed;
}

function extractBulletValue(text, label) {
  if (!text) {
    return null;
  }

  const prefix = `- ${label}:`;
  const line = text
    .split('\n')
    .find((entry) => entry.trim().startsWith(prefix));

  if (!line) {
    return null;
  }

  return normalizeMarkdownValue(line.split(prefix)[1] ?? null);
}

function hasSection(text, heading) {
  if (!text) {
    return false;
  }

  return text.split('\n').some((entry) => entry.trim() === `## ${heading}`);
}

function getActiveHandoffMetadata() {
  if (!activeHandoffRelativePath) {
    return null;
  }

  if (!activeHandoffExists) {
    return {
      path: activeHandoffRelativePath,
      exists: false,
    };
  }

  return {
    path: activeHandoffRelativePath,
    exists: true,
    phase: extractBulletValue(activeHandoff, 'phase'),
    phase_status: extractBulletValue(activeHandoff, 'phase status'),
    handoff_status: extractBulletValue(activeHandoff, 'handoff status'),
    current_blocker: extractBulletValue(activeHandoff, 'current blocker'),
    next_action: extractBulletValue(activeHandoff, 'next action'),
    last_updated: extractBulletValue(activeHandoff, 'last updated'),
    sections: {
      snapshot: hasSection(activeHandoff, 'Snapshot'),
      execution_checklist: hasSection(activeHandoff, 'Execution Checklist'),
      session_log: hasSection(activeHandoff, 'Session Log'),
      resume_here: hasSection(activeHandoff, 'Resume Here'),
    },
  };
}

function getNextActions(status, handoffMetadata) {
  if (handoffMetadata?.exists) {
    if (handoffMetadata.handoff_status === 'blocked') {
      return [];
    }

    if (handoffMetadata.handoff_status === 'completed' && status !== 'completed') {
      return ['/validate-phase'];
    }
  }

  switch (status) {
    case 'pending':
      return ['/run-phase'];
    case 'in_progress':
      return ['/run-phase', '/validate-phase'];
    case 'completed':
      return ['/next-phase', '/finish-phase'];
    default:
      return [];
  }
}

const activeHandoffMetadata = getActiveHandoffMetadata();

const result = {
  root: rootDir,
  current_phase_id: phaseId,
  current_phase_status: phaseStatus,
  backlog_has_phase: backlogHasPhase,
  drift_detected: !phaseId || !phaseStatus || !backlogHasPhase,
  workflow_companion_files: activeHandoffExists && activeHandoffRelativePath ? [activeHandoffRelativePath] : [],
  active_handoff: activeHandoffMetadata,
  next_actions: getNextActions(phaseStatus, activeHandoffMetadata),
};

console.log(JSON.stringify(result, null, 2));
