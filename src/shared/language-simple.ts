// 简化的多语言支持

export const LANGUAGES = {
    'en': 'English',
    'zh-CN': '简体中文',
};

const translations: Record<string, Record<string, string>> = {
    'en': {
        'command.openChat': 'Open AI Chat',
        'command.openSettings': 'Open Settings',
        'command.switchBranch': 'Switch Branch',
        'command.generateDoc': 'Generate Documentation',
        'command.generateDiagram': 'Generate Diagram',
        'chat.title': 'AI Chat',
        'chat.sendMessage': 'Send Message',
        'chat.inputPlaceholder': 'Type your message...',
        'settings.title': 'Code AI Assistant Settings',
        'settings.ai.title': 'AI Configuration',
        'settings.ai.provider': 'AI Provider',
        'settings.ai.apiKey': 'API Key',
        'settings.ai.model': 'Model',
        'settings.ai.baseUrl': 'Base URL',
        'settings.gitlab.title': 'GitLab Configuration',
        'settings.gitlab.url': 'GitLab URL',
        'settings.gitlab.token': 'Access Token',
        'settings.repository.title': 'Repository Management',
        'settings.general.title': 'General Settings',
        'notice.settingsSaved': 'Settings saved',
    },
    'zh-CN': {
        'command.openChat': '打开 AI 聊天',
        'command.openSettings': '打开设置',
        'command.switchBranch': '切换分支',
        'command.generateDoc': '生成文档',
        'command.generateDiagram': '生成架构图',
        'chat.title': 'AI 聊天',
        'chat.sendMessage': '发送消息',
        'chat.inputPlaceholder': '输入你的消息...',
        'settings.title': 'Code AI Assistant 设置',
        'settings.ai.title': 'AI 配置',
        'settings.ai.provider': 'AI 提供商',
        'settings.ai.apiKey': 'API 密钥',
        'settings.ai.model': '模型',
        'settings.ai.baseUrl': '基础 URL',
        'settings.gitlab.title': 'GitLab 配置',
        'settings.gitlab.url': 'GitLab 地址',
        'settings.gitlab.token': '访问令牌',
        'settings.repository.title': '仓库管理',
        'settings.general.title': '通用设置',
        'notice.settingsSaved': '设置已保存',
    },
};

let currentLanguage = 'en';

export function setLanguage(lang: string) {
    currentLanguage = lang;
}

export function t(key: string): string {
    return translations[currentLanguage]?.[key] || key;
}
