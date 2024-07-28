import { IProvider } from './IProvider';
import { OpenAIProvider } from './OpenAIProvider';
import { ClaudeProvider } from './ClaudeProvider';
import { GroqProvider } from './GroqProvider';

export enum ProviderType {
    OPENAI,
    CLAUDE,
    GROQ,
    // Add more providers here
}

export class ProviderFactory {
    static createProvider(providerType: ProviderType): IProvider {
        switch (providerType) {
            case ProviderType.OPENAI:
                return new OpenAIProvider();
            case ProviderType.CLAUDE:
                return new ClaudeProvider();
            case ProviderType.GROQ:
                return new GroqProvider();
            // Add more providers here
            default:
                throw new Error('Unknown provider type');
        }
    }
}