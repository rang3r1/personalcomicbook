import axios from 'axios';
import { ENV } from '@/config/env';

if (!ENV.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY');
}

const openaiClient = axios.create({
  baseURL: 'https://api.openai.com/v1',
  headers: {
    'Authorization': `Bearer ${ENV.OPENAI_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

export const openai = {
  async generateStoryline(prompt: string): Promise<string> {
    try {
      const response = await openaiClient.post('/chat/completions', {
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a creative comic book writer helping to generate engaging storylines.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Error generating storyline:', error);
      throw new Error('Failed to generate storyline');
    }
  },

  async enhanceCharacterDescription(name: string, traits: string): Promise<string> {
    try {
      const response = await openaiClient.post('/chat/completions', {
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a comic book character designer helping to create detailed character descriptions.',
          },
          {
            role: 'user',
            content: `Create a detailed visual description for a character named ${name} with these traits: ${traits}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 300,
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Error enhancing character description:', error);
      throw new Error('Failed to enhance character description');
    }
  },

  async generatePanelPrompt(
    storylineContext: string,
    characterDescription: string,
    style: string
  ): Promise<string> {
    try {
      const response = await openaiClient.post('/chat/completions', {
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a comic book artist helping to create detailed panel descriptions for Midjourney.',
          },
          {
            role: 'user',
            content: `Create a detailed panel description for Midjourney based on:
              Story Context: ${storylineContext}
              Character: ${characterDescription}
              Style: ${style}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 300,
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Error generating panel prompt:', error);
      throw new Error('Failed to generate panel prompt');
    }
  },
};
