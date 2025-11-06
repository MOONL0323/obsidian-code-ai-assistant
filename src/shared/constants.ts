// 常量定义

export const PLUGIN_NAME = 'Code AI Assistant';
export const PLUGIN_ID = 'code-ai-assistant';

// 视图类型
export const VIEW_TYPE_CHAT = 'code-ai-chat-view';

// 命令 ID
export const COMMAND_OPEN_CHAT = 'open-chat';
export const COMMAND_OPEN_SETTINGS = 'open-settings';
export const COMMAND_SWITCH_BRANCH = 'switch-branch';
export const COMMAND_SELECT_FILES = 'select-files';
export const COMMAND_GENERATE_DOC = 'generate-doc';
export const COMMAND_GENERATE_DIAGRAM = 'generate-diagram';

// API 模型
export const AI_MODELS = {
    openai: [
        'gpt-4',
        'gpt-4-turbo-preview',
        'gpt-3.5-turbo',
    ],
    anthropic: [
        'claude-3-opus-20240229',
        'claude-3-sonnet-20240229',
        'claude-3-haiku-20240307',
    ],
} as const;

// Token 价格（美元/1K tokens）
export const TOKEN_PRICES = {
    'gpt-4': { prompt: 0.03, completion: 0.06 },
    'gpt-4-turbo-preview': { prompt: 0.01, completion: 0.03 },
    'gpt-3.5-turbo': { prompt: 0.0015, completion: 0.002 },
    'claude-3-opus-20240229': { prompt: 0.015, completion: 0.075 },
    'claude-3-sonnet-20240229': { prompt: 0.003, completion: 0.015 },
    'claude-3-haiku-20240307': { prompt: 0.00025, completion: 0.00125 },
} as const;

// 默认配置
export const DEFAULT_SETTINGS = {
    apiProvider: 'openai' as const,
    apiKey: '',
    apiModel: 'gpt-4-turbo-preview',
    apiBaseUrl: 'https://api.openai.com/v1',
    gitlabUrl: 'https://gitlab.com',
    gitlabToken: '',
    repositories: [],
    preferLocalAccess: true,
    language: 'zh-CN' as const,
    theme: 'auto' as const,
};

// 文件扩展名到语言的映射
export const LANGUAGE_MAP: Record<string, string> = {
    'ts': 'typescript',
    'tsx': 'typescript',
    'js': 'javascript',
    'jsx': 'javascript',
    'py': 'python',
    'java': 'java',
    'cpp': 'cpp',
    'c': 'c',
    'cs': 'csharp',
    'go': 'go',
    'rs': 'rust',
    'rb': 'ruby',
    'php': 'php',
    'swift': 'swift',
    'kt': 'kotlin',
    'scala': 'scala',
    'sh': 'bash',
    'sql': 'sql',
    'html': 'html',
    'css': 'css',
    'json': 'json',
    'yaml': 'yaml',
    'yml': 'yaml',
    'xml': 'xml',
    'md': 'markdown',
};

// 系统提示词
export const SYSTEM_PROMPTS = {
    'default': '你是一个专业的代码助手，擅长分析代码、生成文档和提供技术建议。',
    'generate-doc': '你是一个文档生成专家，请根据提供的代码生成清晰、专业的技术文档。',
    'generate-diagram': '你是一个架构图生成专家，请使用 Mermaid 语法生成清晰的架构图。',
    'code-review': '你是一个代码审查专家，请分析代码的质量、安全性和性能，提供改进建议。',
};

// 最大值限制
export const MAX_FILE_SIZE = 1024 * 1024; // 1MB
export const MAX_FILES_COUNT = 50;
export const MAX_CONTEXT_LENGTH = 100000; // tokens
