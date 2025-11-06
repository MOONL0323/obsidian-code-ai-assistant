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
        'notice.settingsSaved': 'Settings saved',
    },
    'zh-CN': {
        'command.openChat': '打开 AI 聊天',
        'command.openSettings': '打开设置',
        'command.switchBranch': '切换分支',
        'command.generateDoc': '生成文档',
        'command.generateDiagram': '生成架构图',
        'chat.title': 'AI 聊天',
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
