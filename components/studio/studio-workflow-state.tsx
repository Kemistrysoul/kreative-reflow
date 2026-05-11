'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  crmContentHandoffs,
  crmProjectHandoffs,
  type ProjectRecord,
  type CrmHandoffRecord,
} from '@/lib/dashboard-data';

export type WorkflowProjectRecord = ProjectRecord & {
  id: string;
  sourceHandoffId?: string;
  owner: string;
  email?: string;
  notes?: string;
  startedAt?: string;
};

type StudioWorkflowContextValue = {
  projectHandoffs: CrmHandoffRecord[];
  contentHandoffs: CrmHandoffRecord[];
  activeProjects: WorkflowProjectRecord[];
  queueProjectHandoff: (handoff: CrmHandoffRecord) => void;
  queueContentHandoff: (handoff: CrmHandoffRecord) => void;
  activateProjectFromHandoff: (handoffId: string, project: WorkflowProjectRecord) => void;
  updateActiveProject: (project: WorkflowProjectRecord) => void;
};

const projectKey = 'kreative-reflow-project-handoffs';
const contentKey = 'kreative-reflow-content-handoffs';
const activeProjectsKey = 'kreative-reflow-active-projects';

const StudioWorkflowContext = createContext<StudioWorkflowContextValue | null>(null);

function loadStoredState<T>(key: string, fallback: T[]) {
  if (typeof window === 'undefined') {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return fallback;
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : fallback;
  } catch {
    return fallback;
  }
}

function persistState<T>(key: string, value: T[]) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

function upsertHandoff(current: CrmHandoffRecord[], next: CrmHandoffRecord) {
  if (current.some((entry) => entry.id === next.id)) {
    return current.map((entry) => (entry.id === next.id ? { ...entry, ...next } : entry));
  }

  return [next, ...current];
}

function upsertProject(current: WorkflowProjectRecord[], next: WorkflowProjectRecord) {
  if (current.some((entry) => entry.id === next.id)) {
    return current.map((entry) => (entry.id === next.id ? { ...entry, ...next } : entry));
  }

  return [next, ...current];
}

export function StudioWorkflowProvider({ children }: { children: ReactNode }) {
  const [projectHandoffs, setProjectHandoffs] = useState<CrmHandoffRecord[]>(() =>
    loadStoredState(projectKey, crmProjectHandoffs),
  );
  const [contentHandoffs, setContentHandoffs] = useState<CrmHandoffRecord[]>(() =>
    loadStoredState(contentKey, crmContentHandoffs),
  );
  const [activeProjects, setActiveProjects] = useState<WorkflowProjectRecord[]>(() =>
    loadStoredState(activeProjectsKey, [] as WorkflowProjectRecord[]),
  );

  useEffect(() => {
    persistState(projectKey, projectHandoffs);
  }, [projectHandoffs]);

  useEffect(() => {
    persistState(contentKey, contentHandoffs);
  }, [contentHandoffs]);

  useEffect(() => {
    persistState(activeProjectsKey, activeProjects);
  }, [activeProjects]);

  const value = useMemo<StudioWorkflowContextValue>(
    () => ({
      projectHandoffs,
      contentHandoffs,
      activeProjects,
      queueProjectHandoff: (handoff) => setProjectHandoffs((current) => upsertHandoff(current, handoff)),
      queueContentHandoff: (handoff) => setContentHandoffs((current) => upsertHandoff(current, handoff)),
      activateProjectFromHandoff: (handoffId, project) => {
        setActiveProjects((current) => upsertProject(current, project));
        setProjectHandoffs((current) => current.filter((entry) => entry.id !== handoffId));
      },
      updateActiveProject: (project) => {
        setActiveProjects((current) => upsertProject(current, project));
      },
    }),
    [activeProjects, contentHandoffs, projectHandoffs],
  );

  return <StudioWorkflowContext.Provider value={value}>{children}</StudioWorkflowContext.Provider>;
}

export function useStudioWorkflow() {
  const context = useContext(StudioWorkflowContext);

  if (!context) {
    throw new Error('useStudioWorkflow must be used within StudioWorkflowProvider');
  }

  return context;
}
