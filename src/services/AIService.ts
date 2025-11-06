/**
 * AI Service - 暂时使用简单实现，后续集成 Costrict
 */

import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { AIProviderConfig, AIResponse, ChatMessage } from '../shared/types';
import { createLogger } from '../utils/logger';

const logger = createLogger('AIService');

// 简化的成本计算
function estimateCost(inputTokens: number, outputTokens: number, model: string): number {
    // 简单估算，实际价格可能不同
    const priceMap: Record<string, { input: number; output: number }> = {
        'gpt-4': { input: 0.03, output: 0.06 },
        'gpt-4-turbo': { input: 0.01, output: 0.03 },
        'gpt-3.5-turbo': { input: 0.0005, output: 0.0015 },
        'claude-3-opus': { input: 0.015, output: 0.075 },
        'claude-3-sonnet': { input: 0.003, output: 0.015 },
        'claude-3-haiku': { input: 0.00025, output: 0.00125 },
    };

    const price = priceMap[model] || { input: 0.001, output: 0.002 };
    return (inputTokens * price.input + outputTokens * price.output) / 1000;
}

export class AIService {
    private config: AIProviderConfig;
    private openaiClient?: OpenAI;
    private anthropicClient?: Anthropic;

    constructor(config: AIProviderConfig) {
        this.config = config;
        this.initializeClient();
    }

    private initializeClient(): void {
        if (this.config.provider === 'openai') {
            this.openaiClient = new OpenAI({
                apiKey: this.config.apiKey,
                baseURL: this.config.baseUrl,
            });
        } else if (this.config.provider === 'anthropic') {
            this.anthropicClient = new Anthropic({
                apiKey: this.config.apiKey,
            });
        }
    }

    /**
     * 更新配置
     */
    updateConfig(config: Partial<AIProviderConfig>): void {
        this.config = { ...this.config, ...config };
        this.initializeClient();
    }

    /**
     * 发送聊天消息
     */
    async chat(messages: ChatMessage[], systemPrompt?: string): Promise<AIResponse> {
        try {
            if (this.config.provider === 'openai') {
                return await this.chatWithOpenAI(messages, systemPrompt);
            } else if (this.config.provider === 'anthropic') {
                return await this.chatWithAnthropic(messages, systemPrompt);
            } else {
                throw new Error(`Unsupported AI provider: ${this.config.provider}`);
            }
        } catch (error) {
            logger.error('AI chat failed', error);
            throw error;
        }
    }

    /**
     * OpenAI 聊天
     */
    private async chatWithOpenAI(
        messages: ChatMessage[],
        systemPrompt?: string
    ): Promise<AIResponse> {
        if (!this.openaiClient) {
            throw new Error('OpenAI client not initialized');
        }

        const apiMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [];

        if (systemPrompt) {
            apiMessages.push({ role: 'system', content: systemPrompt });
        }

        for (const msg of messages) {
            apiMessages.push({
                role: msg.role as 'user' | 'assistant' | 'system',
                content: msg.content,
            });
        }

        const response = await this.openaiClient.chat.completions.create({
            model: this.config.model,
            messages: apiMessages,
            max_tokens: this.config.maxTokens,
            temperature: this.config.temperature ?? 0.7,
        });

        const choice = response.choices[0];
        const usage = response.usage!;

        return {
            content: choice.message.content || '',
            tokens: {
                input: usage.prompt_tokens,
                output: usage.completion_tokens,
                total: usage.total_tokens,
            },
            cost: estimateCost(usage.prompt_tokens, usage.completion_tokens, this.config.model),
            model: this.config.model,
        };
    }

    /**
     * Anthropic 聊天
     */
    private async chatWithAnthropic(
        messages: ChatMessage[],
        systemPrompt?: string
    ): Promise<AIResponse> {
        if (!this.anthropicClient) {
            throw new Error('Anthropic client not initialized');
        }

        const apiMessages: Anthropic.MessageParam[] = messages.map(msg => ({
            role: msg.role === 'assistant' ? 'assistant' : 'user',
            content: msg.content,
        }));

        const response = await this.anthropicClient.messages.create({
            model: this.config.model,
            max_tokens: this.config.maxTokens ?? 4096,
            temperature: this.config.temperature ?? 0.7,
            system: systemPrompt,
            messages: apiMessages,
        });

        const content = response.content[0];
        const textContent = content.type === 'text' ? content.text : '';

        return {
            content: textContent,
            tokens: {
                input: response.usage.input_tokens,
                output: response.usage.output_tokens,
                total: response.usage.input_tokens + response.usage.output_tokens,
            },
            cost: estimateCost(response.usage.input_tokens, response.usage.output_tokens, this.config.model),
            model: this.config.model,
        };
    }

    /**
     * 流式聊天（OpenAI）
     */
    async *chatStream(
        messages: ChatMessage[],
        systemPrompt?: string
    ): AsyncGenerator<string, void, unknown> {
        if (this.config.provider !== 'openai' || !this.openaiClient) {
            throw new Error('Streaming only supported for OpenAI');
        }

        const apiMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [];

        if (systemPrompt) {
            apiMessages.push({ role: 'system', content: systemPrompt });
        }

        for (const msg of messages) {
            apiMessages.push({
                role: msg.role as 'user' | 'assistant' | 'system',
                content: msg.content,
            });
        }

        const stream = await this.openaiClient.chat.completions.create({
            model: this.config.model,
            messages: apiMessages,
            max_tokens: this.config.maxTokens,
            temperature: this.config.temperature ?? 0.7,
            stream: true,
        });

        for await (const chunk of stream) {
            const delta = chunk.choices[0]?.delta?.content;
            if (delta) {
                yield delta;
            }
        }
    }
}
