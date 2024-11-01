import { useState } from 'react';
import { useProjectStore } from '@/store/projectStore';
import { openai } from '@/services/openai';
import { midjourney } from '@/services/midjourney';
import { db } from '@/services/supabase';
import { Character, ComicStyle, Panel } from '@/types';

interface GenerationProgress {
  status: 'idle' | 'generating' | 'completed' | 'failed';
  step: 'storyline' | 'panel' | null;
  progress: number;
  total: number;
}

export function useComicGeneration() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<GenerationProgress>({
    status: 'idle',
    step: null,
    progress: 0,
    total: 0,
  });
  const { currentProject } = useProjectStore();

  const generateStoryline = async (prompt: string) => {
    setLoading(true);
    setError(null);
    setProgress({
      status: 'generating',
      step: 'storyline',
      progress: 0,
      total: 1,
    });

    try {
      const storyline = await openai.generateStoryline(prompt);
      setProgress((prev) => ({
        ...prev,
        progress: 1,
        status: 'completed',
      }));
      return storyline;
    } catch (err) {
      setError('Failed to generate storyline');
      setProgress((prev) => ({
        ...prev,
        status: 'failed',
      }));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const generatePanelSequence = async (
    projectId: string,
    storyline: string,
    character: Character | null,
    style: ComicStyle,
    panelCount: number
  ) => {
    if (!projectId) throw new Error('Project ID is required');

    setLoading(true);
    setError(null);
    setProgress({
      status: 'generating',
      step: 'panel',
      progress: 0,
      total: panelCount,
    });

    const panels: Panel[] = [];

    try {
      for (let i = 0; i < panelCount; i++) {
        // Generate panel prompt
        const panelPrompt = await openai.generatePanelPrompt(
          storyline,
          character?.traits?.description || '',
          style
        );

        // Generate panel image
        const imageUrl = await midjourney.generatePanel(
          panelPrompt,
          style,
          character?.traits?.description
        );

        // Create panel in database
        const panel = await db.createPanel(
          projectId,
          character?.character_id,
          style,
          imageUrl,
          i
        );

        panels.push(panel);

        setProgress((prev) => ({
          ...prev,
          progress: i + 1,
        }));
      }

      setProgress((prev) => ({
        ...prev,
        status: 'completed',
      }));

      return panels;
    } catch (err) {
      setError('Failed to generate panel sequence');
      setProgress((prev) => ({
        ...prev,
        status: 'failed',
      }));
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
    setProgress({
      status: 'generating',
      step: 'panel',
      progress: 0,
      total: 1,
    });

    try {
      // Generate new panel prompt
      const panelPrompt = await openai.generatePanelPrompt(
        storylineContext,
        character?.traits?.description || '',
        panel.style_id as ComicStyle
      );

      // Generate new image
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

      setProgress({
        status: 'completed',
        step: 'panel',
        progress: 1,
        total: 1,
      });

      return updatedPanel;
    } catch (err) {
      setError('Failed to regenerate panel');
      setProgress({
        status: 'failed',
        step: 'panel',
        progress: 0,
        total: 1,
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const enhanceCharacterDescription = async (
    name: string,
    traits: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      const enhancedDescription = await openai.enhanceCharacterDescription(
        name,
        traits
      );
      return enhancedDescription;
    } catch (err) {
      setError('Failed to enhance character description');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    progress,
    generateStoryline,
    generatePanelSequence,
    regeneratePanel,
    enhanceCharacterDescription,
  };
}
