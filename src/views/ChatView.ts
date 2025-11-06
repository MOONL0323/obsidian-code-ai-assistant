// 聊天视图

import { ItemView, WorkspaceLeaf } from 'obsidian';
import { VIEW_TYPE_CHAT } from '../shared/constants';
import { ChatMessage } from '../shared/types';
import { t } from '../shared/language-simple';
import { createLogger } from '../utils/logger';
import type CodeAIAssistantPlugin from '../main';

const logger = createLogger('ChatView');

export class ChatView extends ItemView {
    plugin: CodeAIAssistantPlugin;
    messages: ChatMessage[] = [];
    containerEl: HTMLElement;  // Changed from private to public (required by ItemView)
    private messageListEl: HTMLElement;
    private inputAreaEl: HTMLElement;

    constructor(leaf: WorkspaceLeaf, plugin: CodeAIAssistantPlugin) {
        super(leaf);
        this.plugin = plugin;
    }

    getViewType(): string {
        return VIEW_TYPE_CHAT;
    }

    getDisplayText(): string {
        return t('chat.title');
    }

    getIcon(): string {
        return 'message-square';
    }

    async onOpen() {
        const container = this.containerEl;
        container.empty();
        container.addClass('code-ai-chat-view');

        // 创建头部
        this.createHeader(container);

        // 创建消息列表
        this.messageListEl = container.createDiv({ cls: 'chat-messages' });

        // 创建输入区域
        this.inputAreaEl = container.createDiv({ cls: 'chat-input-area' });
        this.createInputArea(this.inputAreaEl);

        // 渲染现有消息
        this.renderMessages();
    }

    async onClose() {
        // 清理
    }

    /**
     * 创建头部
     */
    private createHeader(container: HTMLElement): void {
        const header = container.createDiv({ cls: 'chat-header' });
        
        const title = header.createEl('h3', { text: t('chat.title') });
        
        const actions = header.createDiv({ cls: 'chat-actions' });
        
        // 清空按钮
        const clearBtn = actions.createEl('button', {
            text: t('chat.clear'),
            cls: 'chat-btn-clear',
        });
        clearBtn.addEventListener('click', () => this.clearChat());

        // 导出按钮
        const exportBtn = actions.createEl('button', {
            text: t('chat.export'),
            cls: 'chat-btn-export',
        });
        exportBtn.addEventListener('click', () => this.exportChat());
    }

    /**
     * 创建输入区域
     */
    private createInputArea(container: HTMLElement): void {
        const inputWrapper = container.createDiv({ cls: 'chat-input-wrapper' });

        // 文本区域
        const textarea = inputWrapper.createEl('textarea', {
            cls: 'chat-input',
            attr: {
                placeholder: t('chat.placeholder'),
                rows: '3',
            },
        });

        // 发送按钮
        const sendBtn = inputWrapper.createEl('button', {
            text: t('chat.send'),
            cls: 'chat-btn-send',
        });

        // 绑定事件
        sendBtn.addEventListener('click', () => {
            this.sendMessage(textarea.value);
            textarea.value = '';
        });

        textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                this.sendMessage(textarea.value);
                textarea.value = '';
                e.preventDefault();
            }
        });
    }

    /**
     * 发送消息
     */
    private async sendMessage(content: string): Promise<void> {
        if (!content.trim()) return;

        // 验证 API Key
        if (!this.plugin.settings.apiKey) {
            // @ts-ignore
            new Notice(t('error.apiKeyMissing'));
            return;
        }

        // 添加用户消息
        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: content.trim(),
            timestamp: new Date(),
        };
        this.messages.push(userMessage);
        this.renderMessages();

        try {
            // 显示加载状态
            const loadingMsg = this.addLoadingMessage();

            // 调用 AI
            const response = await this.plugin.aiService.chat(this.messages);

            // 移除加载状态
            this.removeLoadingMessage(loadingMsg);

            // 添加 AI 回复
            const assistantMessage: ChatMessage = {
                id: Date.now().toString(),
                role: 'assistant',
                content: response.content,
                timestamp: new Date(),
                tokens: response.tokens.total,
                cost: response.cost,
            };
            this.messages.push(assistantMessage);
            this.renderMessages();

            logger.info('Chat response received', {
                tokens: response.tokens,
                cost: response.cost,
            });
        } catch (error) {
            logger.error('Failed to send message', error);
            // @ts-ignore
            new Notice(t('error.networkError'));
        }
    }

    /**
     * 渲染消息列表
     */
    private renderMessages(): void {
        this.messageListEl.empty();

        for (const message of this.messages) {
            const messageEl = this.messageListEl.createDiv({
                cls: `chat-message chat-message-${message.role}`,
            });

            // 消息内容
            const contentEl = messageEl.createDiv({ cls: 'chat-message-content' });
            contentEl.textContent = message.content;

            // 消息元数据
            const metaEl = messageEl.createDiv({ cls: 'chat-message-meta' });
            const timeStr = message.timestamp.toLocaleTimeString();
            let metaText = timeStr;

            if (message.tokens) {
                metaText += ` · ${message.tokens} tokens`;
            }
            if (message.cost) {
                metaText += ` · $${message.cost.toFixed(4)}`;
            }

            metaEl.textContent = metaText;
        }

        // 滚动到底部
        this.messageListEl.scrollTop = this.messageListEl.scrollHeight;
    }

    /**
     * 添加加载消息
     */
    private addLoadingMessage(): HTMLElement {
        const loadingEl = this.messageListEl.createDiv({
            cls: 'chat-message chat-message-loading',
        });
        loadingEl.textContent = 'AI 正在思考...';
        return loadingEl;
    }

    /**
     * 移除加载消息
     */
    private removeLoadingMessage(element: HTMLElement): void {
        element.remove();
    }

    /**
     * 清空聊天
     */
    private clearChat(): void {
        this.messages = [];
        this.renderMessages();
    }

    /**
     * 导出聊天记录
     */
    private async exportChat(): Promise<void> {
        const content = this.messages
            .map((msg) => {
                const role = msg.role.toUpperCase();
                const time = msg.timestamp.toLocaleString();
                return `[${time}] ${role}:\n${msg.content}\n`;
            })
            .join('\n---\n\n');

        const filename = `chat-export-${Date.now()}.md`;
        
        try {
            // 创建文件
            await this.app.vault.create(filename, content);
            // @ts-ignore
            new Notice(`导出成功: ${filename}`);
        } catch (error) {
            logger.error('Failed to export chat', error);
            // @ts-ignore
            new Notice('导出失败');
        }
    }
}
