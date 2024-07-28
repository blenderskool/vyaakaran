import axios from 'axios';
import { generateRightRegularGrammarPrompt } from './prompt_templates/rg_prompt';
import { generateContextFreeGrammarPrompt } from './prompt_templates/cfg_prompt';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export async function generateRightRegularGrammar(userRequest: string, exampleStrings: string[] = []): Promise<string> {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not set. Please check your environment variables.');
  }

  const prompt = generateRightRegularGrammarPrompt(userRequest, exampleStrings);

  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: "gpt-4o", 
        messages: [{ role: "user", content: prompt }],
        temperature: 0.0,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw new Error('Failed to generate response from OpenAI');
  }
}

export async function generateContextFreeGrammar(userRequest: string, exampleStrings: string[] = []): Promise<string> {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not set. Please check your environment variables.');
  }

  const prompt = generateContextFreeGrammarPrompt(userRequest, exampleStrings);

  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: "gpt-4o",  // or "gpt-4" if you have access
        messages: [{ role: "user", content: prompt }],
        temperature: 0.0,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw new Error('Failed to generate response from OpenAI');
  }
}