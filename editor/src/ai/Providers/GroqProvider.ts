import axios from 'axios';
import { IProvider } from './IProvider';
import { generateRightRegularGrammarPrompt } from '../prompt_templates/rg_prompt';
import { generateContextFreeGrammarPrompt } from '../prompt_templates/cfg_prompt';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export class GroqProvider implements IProvider {
  constructor() {
    if (!GROQ_API_KEY) {
      throw new Error('Groq API key is not set. Please check your environment variables.');
    }
  }

  private async generateGrammar(prompt: string): Promise<string> {
    try {
      const response = await axios.post(
        GROQ_API_URL,
        {
          messages: [{ role: 'user', content: prompt }],
          model: 'llama-3.1-70b-versatile', // You can change this to the appropriate model
        },
        {
          headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.data.choices || response.data.choices.length === 0) {
        throw new Error('Unexpected response structure from Groq API');
      }

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Error calling Groq API:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to generate response from Groq: ${error.message}`);
      } else {
        throw new Error('Failed to generate response from Groq');
      }
    }
  }

  async generateRightRegularGrammar(userRequest: string, exampleStrings: string[]): Promise<string> {
    const prompt = generateRightRegularGrammarPrompt(userRequest, exampleStrings);
    return this.generateGrammar(prompt);
  }

  async generateContextFreeGrammar(userRequest: string, exampleStrings: string[]): Promise<string> {
    const prompt = generateContextFreeGrammarPrompt(userRequest, exampleStrings);
    return this.generateGrammar(prompt);
  }
}