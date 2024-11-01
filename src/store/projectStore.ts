import { create } from 'zustand';
import { Project, ProjectStore } from '@/types';

export const useProjectStore = create<ProjectStore>((set) => ({
  currentProject: null,
  setCurrentProject: (project: Project | null) => set({ currentProject: project }),
  clearCurrentProject: () => set({ currentProject: null }),
}));
