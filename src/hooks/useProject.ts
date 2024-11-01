import { useState } from 'react';
import { useProjectStore } from '@/store/projectStore';
import { useUserStore } from '@/store/userStore';
import { db } from '@/services/supabase';
import { openai } from '@/services/openai';
import { midjourney } from '@/services/midjourney';
import { Project, Character, Panel, ComicStyle } from '@/types';

export function useProject() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentProject, setCurrentProject } = useProjectStore();
  const { user } = useUserStore();

  const createProject = async (description: string) => {
    if (!user) throw new Error('User not authenticated');
    
    setLoading(true);
    setError(null);
    try {
      const project = await db.createProject(user.user_id, description);
      setCurrentProject(project);
      return project;
    } catch (err) {
      setError('Failed to create project');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addCharacter = async (
    projectId: string,
    name: string,
    traits: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      // Enhance character description using OpenAI
      const enhancedDescription = await openai.enhanceCharacterDescription(
        name,
        traits
      );

      // Create character in database
      const character = await db.createCharacter(projectId, name, {
        description: enhancedDescription,
        appearance: '',
        personality: traits,
      });

      return character;
    } catch (err) {
      setError('Failed to add character');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const generatePanel = async (
    projectId: string,
    character: Character | null,
    style: ComicStyle,
    storylineContext: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      // Generate panel prompt using OpenAI
      const panelPrompt = await openai.generatePanelPrompt(
        storylineContext,
        character?.traits?.description || '',
        style
      );

      // Generate image using Midjourney
      const imageUrl = await midjourney.generatePanel(
        panelPrompt,
        style,
        character?.traits?.description
      );

      // Get current panel count for ordering
      const existingPanels = await db.getProjectPanels(projectId);
      const order = existingPanels.length;

      // Create panel in database
      const panel = await db.createPanel(
        projectId,
        character?.character_id,
        style,
        imageUrl,
        order
      );

      return panel;
    } catch (err) {
      setError('Failed to generate panel');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const regeneratePanel = async (
    panel: Panel,
    character: Character | null,
    storylineContext: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      // Generate new panel prompt
      const panelPrompt = await openai.generatePanelPrompt(
        storylineContext,
        character?.traits?.description || '',
        panel.style_id as ComicStyle
      );

      // Regenerate image
      const imageUrl = await midjourney.regeneratePanel(
        panel.panel_id,
        panelPrompt,
        panel.style_id as ComicStyle,
        character?.traits?.description
      );

      // Update panel in database
      const updatedPanel = await db.updatePanel(panel.panel_id, {
        image_url: imageUrl,
      });

      return updatedPanel;
    } catch (err) {
      setError('Failed to regenerate panel');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reorderPanels = async (projectId: string, panelIds: string[]) => {
    setLoading(true);
    setError(null);
    try {
      // Update panel orders in database
      await Promise.all(
        panelIds.map((panelId, index) =>
          db.updatePanel(panelId, { order: index })
        )
      );

      // Fetch updated panels
      const updatedPanels = await db.getProjectPanels(projectId);
      return updatedPanels;
    } catch (err) {
      setError('Failed to reorder panels');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    currentProject,
    loading,
    error,
    createProject,
    addCharacter,
    generatePanel,
    regeneratePanel,
    reorderPanels,
  };
}
