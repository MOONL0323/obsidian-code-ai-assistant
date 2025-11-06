// 设置面板

import { App, PluginSettingTab, Setting, Notice } from 'obsidian';
import type CodeAIAssistantPlugin from '../main';
import { AI_MODELS } from '../shared/constants';
import { t } from '../shared/language-simple';

export class SettingsTab extends PluginSettingTab {
    plugin: CodeAIAssistantPlugin;

    constructor(app: App, plugin: CodeAIAssistantPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        containerEl.createEl('h2', { text: t('settings.title') });

        // AI 配置
        this.createAISettings(containerEl);

        // GitLab 配置
        this.createGitLabSettings(containerEl);

        // 仓库配置
        this.createRepositorySettings(containerEl);

        // 通用设置
        this.createGeneralSettings(containerEl);
    }

    /**
     * AI 配置
     */
    private createAISettings(containerEl: HTMLElement): void {
        containerEl.createEl('h3', { text: t('settings.ai.title') });

        // AI 提供商
        new Setting(containerEl)
            .setName(t('settings.ai.provider'))
            .setDesc('选择 AI 提供商')
            .addDropdown((dropdown) => {
                dropdown
                    .addOption('openai', 'OpenAI')
                    .addOption('anthropic', 'Anthropic')
                    .addOption('constrict', 'Constrict (Internal)')
                    .setValue(this.plugin.settings.apiProvider)
                    .onChange(async (value: 'openai' | 'anthropic' | 'constrict') => {
                        this.plugin.settings.apiProvider = value;
                        // 更新模型选项
                        this.plugin.settings.apiModel = AI_MODELS[value][0];
                        await this.plugin.saveSettings();
                        this.display(); // 重新渲染
                    });
            });

        // API Key
        new Setting(containerEl)
            .setName(t('settings.ai.apiKey'))
            .setDesc('输入 API 密钥')
            .addText((text) => {
                text
                    .setPlaceholder('sk-...')
                    .setValue(this.plugin.settings.apiKey)
                    .onChange(async (value) => {
                        this.plugin.settings.apiKey = value;
                        await this.plugin.saveSettings();
                    });
                text.inputEl.type = 'password';
            });

        // 模型选择
        new Setting(containerEl)
            .setName(t('settings.ai.model'))
            .setDesc('选择 AI 模型')
            .addDropdown((dropdown) => {
                const models = AI_MODELS[this.plugin.settings.apiProvider];
                models.forEach((model) => {
                    dropdown.addOption(model, model);
                });
                dropdown
                    .setValue(this.plugin.settings.apiModel)
                    .onChange(async (value) => {
                        this.plugin.settings.apiModel = value;
                        await this.plugin.saveSettings();
                    });
            });

        // Base URL（OpenAI）
        if (this.plugin.settings.apiProvider === 'openai') {
            new Setting(containerEl)
                .setName(t('settings.ai.baseUrl'))
                .setDesc('自定义 API 基础 URL（可选）')
                .addText((text) => {
                    text
                        .setPlaceholder('https://api.openai.com/v1')
                        .setValue(this.plugin.settings.apiBaseUrl || '')
                        .onChange(async (value) => {
                            this.plugin.settings.apiBaseUrl = value;
                            await this.plugin.saveSettings();
                        });
                });
        }

        // Constrict API URL
        if (this.plugin.settings.apiProvider === 'constrict') {
            new Setting(containerEl)
                .setName('Constrict API URL')
                .setDesc('输入公司内部 Constrict API 地址')
                .addText((text) => {
                    text
                        .setPlaceholder('http://your-company-api.com/v1')
                        .setValue(this.plugin.settings.constrictApiUrl || '')
                        .onChange(async (value) => {
                            this.plugin.settings.constrictApiUrl = value;
                            this.plugin.settings.apiBaseUrl = value; // 同步到 baseUrl
                            await this.plugin.saveSettings();
                        });
                });

            new Setting(containerEl)
                .setName('Constrict API Key')
                .setDesc('输入 Constrict API 密钥（如果需要）')
                .addText((text) => {
                    text
                        .setPlaceholder('可选')
                        .setValue(this.plugin.settings.constrictApiKey || '')
                        .onChange(async (value) => {
                            this.plugin.settings.constrictApiKey = value;
                            await this.plugin.saveSettings();
                        });
                    text.inputEl.type = 'password';
                });
        }
    }

    /**
     * GitLab 配置
     */
    private createGitLabSettings(containerEl: HTMLElement): void {
        containerEl.createEl('h3', { text: t('settings.gitlab.title') });

        // GitLab URL
        new Setting(containerEl)
            .setName(t('settings.gitlab.url'))
            .setDesc('GitLab 实例地址')
            .addText((text) => {
                text
                    .setPlaceholder('https://gitlab.com')
                    .setValue(this.plugin.settings.gitlabUrl)
                    .onChange(async (value) => {
                        this.plugin.settings.gitlabUrl = value;
                        await this.plugin.saveSettings();
                    });
            });

        // GitLab Token
        new Setting(containerEl)
            .setName(t('settings.gitlab.token'))
            .setDesc('GitLab 访问令牌')
            .addText((text) => {
                text
                    .setPlaceholder('glpat-...')
                    .setValue(this.plugin.settings.gitlabToken)
                    .onChange(async (value) => {
                        this.plugin.settings.gitlabToken = value;
                        await this.plugin.saveSettings();
                    });
                text.inputEl.type = 'password';
            });
    }

    /**
     * 仓库配置
     */
    private createRepositorySettings(containerEl: HTMLElement): void {
        containerEl.createEl('h3', { text: t('settings.repo.title') });

        // 本地访问优先
        new Setting(containerEl)
            .setName('优先使用本地访问')
            .setDesc('当仓库同时配置本地路径和 GitLab 时，优先使用本地')
            .addToggle((toggle) => {
                toggle
                    .setValue(this.plugin.settings.preferLocalAccess)
                    .onChange(async (value) => {
                        this.plugin.settings.preferLocalAccess = value;
                        await this.plugin.saveSettings();
                    });
            });

        // 仓库列表
        const repoList = containerEl.createDiv({ cls: 'repo-list' });
        
        for (const repo of this.plugin.settings.repositories) {
            const repoItem = repoList.createDiv({ cls: 'repo-item' });
            
            repoItem.createEl('strong', { text: repo.name });
            repoItem.createEl('span', { 
                text: ` (${repo.type}${repo.localPath ? ': ' + repo.localPath : ''})`,
                cls: 'repo-info'
            });

            const deleteBtn = repoItem.createEl('button', {
                text: '删除',
                cls: 'repo-delete-btn',
            });
            deleteBtn.addEventListener('click', async () => {
                this.plugin.removeRepository(repo.name);
                this.display(); // 重新渲染
                new Notice(`已删除仓库: ${repo.name}`);
            });
        }

        // 添加仓库按钮
        new Setting(containerEl)
            .setName(t('settings.repo.add'))
            .setDesc('添加新的代码仓库')
            .addButton((button) => {
                button
                    .setButtonText('+')
                    .onClick(() => {
                        // TODO: 打开添加仓库的弹窗
                        new Notice('添加仓库功能开发中...');
                    });
            });
    }

    /**
     * 通用设置
     */
    private createGeneralSettings(containerEl: HTMLElement): void {
        containerEl.createEl('h3', { text: '通用设置' });

        // 语言
        new Setting(containerEl)
            .setName('界面语言')
            .setDesc('选择插件界面语言')
            .addDropdown((dropdown) => {
                dropdown
                    .addOption('zh-CN', '简体中文')
                    .addOption('en', 'English')
                    .setValue(this.plugin.settings.language)
                    .onChange(async (value: 'en' | 'zh-CN') => {
                        this.plugin.settings.language = value;
                        await this.plugin.saveSettings();
                        this.display(); // 重新渲染
                    });
            });
    }
}
