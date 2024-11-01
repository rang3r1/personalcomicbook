import axios from 'axios';
import { ENV } from '@/config/env';
import { ComicStyle } from '@/types';

if (!ENV.NEXT_PUBLIC_MIDJOURNEY_API_URL) {
  throw new Error('Missing NEXT_PUBLIC_MIDJOURNEY_API_URL');
}

const midjourneyClient = axios.create({
  baseURL: ENV.NEXT_PUBLIC_MIDJOURNEY_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const STYLE_PROMPTS: Record<ComicStyle, string> = {
  manga: 'in manga art style, clean lines, expressive features, dynamic composition',
  superhero: 'in superhero comic book style, bold colors, dramatic lighting, action-packed',
  cartoon: 'in cartoon style, vibrant colors, exaggerated features, playful composition',
  classic: 'in classic comic book style, detailed linework, traditional coloring, panel composition',
};

export const midjourney = {
  async generatePanel(
    prompt: string,
    style: ComicStyle,
    characterDescription?: string
  ): Promise<string> {
    try {
      // Combine the base prompt with style-specific prompts and character description
      const fullPrompt = `${prompt} ${STYLE_PROMPTS[style]} ${
        characterDescription ? `, ${characterDescription}` : ''
      }`;

      const response = await midjourneyClient.post('/generate', {
        prompt: fullPrompt,
        style: style,
        // Add any additional parameters required by your Midjourney API
      });

      // Assuming the API returns an image URL
      return response.data.imageUrl;
    } catch (error) {
      console.error('Error generating panel:', error);
      throw new Error('Failed to generate panel image');
    }
  },

  async regeneratePanel(
    panelId: string,
    prompt: string,
    style: ComicStyle,
    characterDescription?: string
  ): Promise<string> {
    try {
      const fullPrompt = `${prompt} ${STYLE_PROMPTS[style]} ${
        characterDescription ? `, ${characterDescription}` : ''
      }`;

      const response = await midjourneyClient.post('/regenerate', {
        panelId,
        prompt: fullPrompt,
        style: style,
      });

      return response.data.imageUrl;
    } catch (error) {
      console.error('Error regenerating panel:', error);
      throw new Error('Failed to regenerate panel image');
    }
  },

  async upscaleImage(imageUrl: string): Promise<string> {
    try {
      const response = await midjourneyClient.post('/upscale', {
        imageUrl,
      });

      return response.data.upscaledImageUrl;
    } catch (error) {
      console.error('Error upscaling image:', error);
      throw new Error('Failed to upscale image');
    }
  },

  async getGenerationStatus(jobId: string): Promise<{
    status: 'pending' | 'completed' | 'failed';
    imageUrl?: string;
    error?: string;
  }> {
    try {
      const response = await midjourneyClient.get(`/status/${jobId}`);
      return response.data;
    } catch (error) {
      console.error('Error checking generation status:', error);
      throw new Error('Failed to check generation status');
    }
  },
};
