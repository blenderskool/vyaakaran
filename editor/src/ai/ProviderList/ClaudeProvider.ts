import Anthropic from '@anthropic-ai/sdk';
import { IProvider } from '../ProviderInit/IProvider';
import { generateRightRegularGrammarPrompt } from '../prompt_templates/rg_prompt';
import { generateContextFreeGrammarPrompt } from '../prompt_templates/cfg_prompt';

const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

export class ClaudeProvider implements IProvider {
  private anthropic: Anthropic;

  constructor() {
    if (!ANTHROPIC_API_KEY) {
      throw new Error('Anthropic API key is not set. Please check your environment variables.');
    }
    this.anthropic = new Anthropic({
      apiKey: ANTHROPIC_API_KEY,
    });
  }

  private async generateGrammar(prompt: string): Promise<string> {
    try {
      const message = await this.anthropic.messages.create({
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
        model: 'claude-3-5-sonnet-20240620',
      });

      if (!message.content || message.content.length === 0) {
        throw new Error('Unexpected response structure from Claude API');
      }

      // Extract text content from various block types
      let responseText = '';
      for (const content of message.content) {
        if (content.type === 'text') {
          responseText += content.text;
        }
      }

      if (!responseText) {
        throw new Error('No text content found in Claude API response');
      }

      return responseText;
    } catch (error) {
      console.error('Error calling Claude API:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to generate response from Claude: ${error.message}`);
      } else {
        throw new Error('Failed to generate response from Claude');
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