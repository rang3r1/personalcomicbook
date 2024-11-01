'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useProject } from '@/hooks/useProject';
import { useComicGeneration } from '@/hooks/useComicGeneration';
import { useSubscription } from '@/hooks/useSubscription';
import { Character, Panel, ComicStyle } from '@/types';
import { db } from '@/services/supabase';

interface ProjectDetailPageProps {
  params: {
    id: string;
  };
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { currentProject, loading: projectLoading } = useProject();
  const { isWithinLimits, getFeatures } = useSubscription();
  const {
    loading: generationLoading,
    progress,
    generateStoryline,
    generatePanelSequence,
  } = useComicGeneration();

  const [characters, setCharacters] = useState<Character[]>([]);
  const [panels, setPanels] = useState<Panel[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<ComicStyle>('manga');
  const [storyline, setStoryline] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/auth/signin');
      return;
    }

    const loadProjectData = async () => {
      try {
        // Load characters
        const projectCharacters = await db.getProjectCharacters(params.id);
        setCharacters(projectCharacters);

        // Load panels
        const projectPanels = await db.getProjectPanels(params.id);
        setPanels(projectPanels);

        setLoading(false);
      } catch (err) {
        console.error('Error loading project data:', err);
        setError('Failed to load project data');
        setLoading(false);
      }
    };

    loadProjectData();
  }, [params.id, user, router]);

  const handleAddCharacter = async () => {
    if (!user) return;

    try {
      const character = await db.createCharacter(params.id, 'New Character', {
        description: '',
        appearance: '',
        personality: '',
      });
      setCharacters([...characters, character]);
    } catch (err) {
      console.error('Error adding character:', err);
      setError('Failed to add character');
    }
  };

  const handleGenerateComic = async () => {
    if (!user || !storyline) return;

    if (!isWithinLimits('maxPanelsPerProject', panels.length)) {
      router.push('/pricing');
      return;
    }

    try {
      // Generate enhanced storyline
      const enhancedStoryline = await generateStoryline(storyline);

      // Generate panels
      const newPanels = await generatePanelSequence(
        params.id,
        enhancedStoryline,
        characters[0] || null,
        selectedStyle,
        4 // Default to 4 panels, could be made configurable
      );

      setPanels([...panels, ...newPanels]);
    } catch (err) {
      console.error('Error generating comic:', err);
      setError('Failed to generate comic');
    }
  };

  if (loading || projectLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="py-10">
      <header>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
            {currentProject?.description || 'Project Details'}
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Characters Section */}
        <div className="mt-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h2 className="text-xl font-semibold text-gray-900">Characters</h2>
            </div>
            <div className="mt-4 sm:ml-16 sm:mt-0">
              <button
                onClick={handleAddCharacter}
                className="block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
              >
                Add Character
              </button>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {characters.map((character) => (
              <div
                key={character.character_id}
                className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-gray-400"
              >
                <h3 className="text-lg font-medium">{character.name}</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {character.traits.description || 'No description'}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Comic Generation Section */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-gray-900">Generate Comic</h2>
          <div className="mt-4">
            <div className="space-y-4">
              <div>
                <label htmlFor="storyline" className="block text-sm font-medium text-gray-700">
                  Storyline
                </label>
                <textarea
                  id="storyline"
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={storyline}
                  onChange={(e) => setStoryline(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="style" className="block text-sm font-medium text-gray-700">
                  Comic Style
                </label>
                <select
                  id="style"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={selectedStyle}
                  onChange={(e) => setSelectedStyle(e.target.value as ComicStyle)}
                >
                  <option value="manga">Manga</option>
                  <option value="superhero">Superhero</option>
                  <option value="cartoon">Cartoon</option>
                  <option value="classic">Classic</option>
                </select>
              </div>
              <button
                onClick={handleGenerateComic}
                disabled={generationLoading || !storyline}
                className={`
                  w-full rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm
                  ${
                    generationLoading || !storyline
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-500'
                  }
                `}
              >
                {generationLoading ? 'Generating...' : 'Generate Comic'}
              </button>
            </div>
          </div>
        </div>

        {/* Generated Panels */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-gray-900">Comic Panels</h2>
          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {panels.map((panel) => (
              <div
                key={panel.panel_id}
                className="relative rounded-lg border border-gray-300 bg-white p-4 shadow-sm"
              >
                <img
                  src={panel.image_url}
                  alt={`Panel ${panel.order + 1}`}
                  className="w-full h-auto rounded"
                />
                <div className="mt-2 text-sm text-gray-500">
                  Panel {panel.order + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
