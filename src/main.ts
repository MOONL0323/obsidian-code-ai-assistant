// 插件主入口

import { Plugin, WorkspaceLeaf, Notice } from 'obsidian';
import { PluginSettings, Repository } from './shared/types';
import { DEFAULT_SETTINGS, VIEW_TYPE_CHAT } from './shared/constants';
import { createLogger } from './utils/logger';
import { setLanguage, t } from './shared/language-simple';
import { AIService } from './services/AIService';
import { GitService } from './services/GitService';
import { CodeService } from './services/CodeService';
import { ChatView } from './views/ChatView';
import { SettingsTab } from './settings/SettingsTab';

const logger = createLogger('CodeAIAssistantPlugin');

export default class CodeAIAssistantPlugin extends Plugin {
    settings!: PluginSettings;
    aiService!: AIService;
    gitService!: GitService;
    codeService!: CodeService;

    async onload() {
        logger.info('Loading Code AI Assistant Plugin');

        // 加载设置
        await this.loadSettings();

        // 设置语言
        setLanguage(this.settings.language);

        // 初始化服务
        this.initializeServices();

        // 注册视图
        this.registerView(
            VIEW_TYPE_CHAT,
            (leaf) => new ChatView(leaf, this)
        );

        // 添加左侧边栏图标
        this.addRibbonIcon('message-square', t('command.openChat'), () => {
            this.activateChatView();
        });

        // 注册命令
        this.registerCommands();

        // 添加设置面板
        this.addSettingTab(new SettingsTab(this.app, this));

        logger.info('Plugin loaded successfully');
    }

    async onunload() {
        logger.info('Unloading Code AI Assistant Plugin');
    }

    /**
     * 初始化服务
     */
    private initializeServices(): void {
        // AI 服务
        this.aiService = new AIService({
            provider: this.settings.apiProvider,
            apiKey: this.settings.apiKey,
            model: this.settings.apiModel,
            baseUrl: this.settings.apiBaseUrl,
        });

        // Git 服务
        this.gitService = new GitService();

        // 代码服务
        this.codeService = new CodeService(
            this.settings.gitlabUrl,
            this.settings.gitlabToken,
            this.settings.repositories
        );
    }

    /**
     * 注册命令
     */
    private registerCommands(): void {
        // 打开聊天
        this.addCommand({
            id: 'open-chat',
            name: t('command.openChat'),
            callback: () => {
                this.activateChatView();
            },
        });

        // 打开设置
        this.addCommand({
            id: 'open-settings',
            name: t('command.openSettings'),
            callback: () => {
                // @ts-ignore
                this.app.setting.open();
                // @ts-ignore
                this.app.setting.openTabById('code-ai-assistant');
            },
        });

        // 切换分支（需要先选择仓库）
        this.addCommand({
            id: 'switch-branch',
            name: t('command.switchBranch'),
            callback: async () => {
                // TODO: 实现分支切换弹窗
                new Notice('分支切换功能开发中...');
            },
        });

        // 生成文档
        this.addCommand({
            id: 'generate-doc',
            name: t('command.generateDoc'),
            callback: async () => {
                // TODO: 实现文档生成
                new Notice('文档生成功能开发中...');
            },
        });

        // 生成架构图
        this.addCommand({
            id: 'generate-diagram',
            name: t('command.generateDiagram'),
            callback: async () => {
                // TODO: 实现架构图生成
                new Notice('架构图生成功能开发中...');
            },
        });
    }

    /**
     * 激活聊天视图
     */
    async activateChatView() {
        const { workspace } = this.app;

        let leaf: WorkspaceLeaf | null = null;
        const leaves = workspace.getLeavesOfType(VIEW_TYPE_CHAT);

        if (leaves.length > 0) {
            // 如果已经打开，激活它
            leaf = leaves[0];
        } else {
            // 在右侧边栏创建新的 leaf
            leaf = workspace.getRightLeaf(false);
            if (leaf) {
                await leaf.setViewState({
                    type: VIEW_TYPE_CHAT,
                    active: true,
                });
            }
        }

        // 显示 leaf
        if (leaf) {
            workspace.revealLeaf(leaf);
        }
    }

    /**
     * 加载设置
     */
    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    /**
     * 保存设置
     */
    async saveSettings() {
        await this.saveData(this.settings);
        
        // 更新语言
        setLanguage(this.settings.language);
        
        // 重新初始化服务
        this.initializeServices();
        
        logger.info('Settings saved');
        new Notice(t('notice.settingsSaved'));
    }

    /**
     * 添加仓库
     */
    addRepository(repo: Repository): void {
        this.settings.repositories.push(repo);
        this.codeService.addRepository(repo);
        this.saveSettings();
    }

    /**
     * 删除仓库
     */
    removeRepository(repoName: string): void {
        this.settings.repositories = this.settings.repositories.filter(
            r => r.name !== repoName
        );
        this.codeService.removeRepository(repoName);
        this.saveSettings();
    }
}
