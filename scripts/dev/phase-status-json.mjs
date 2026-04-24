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

function getNextActions(status) {
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

const result = {
  root: rootDir,
  current_phase_id: phaseId,
  current_phase_status: phaseStatus,
  backlog_has_phase: backlogHasPhase,
  drift_detected: !phaseId || !phaseStatus || !backlogHasPhase,
  next_actions: getNextActions(phaseStatus),
};

console.log(JSON.stringify(result, null, 2));
