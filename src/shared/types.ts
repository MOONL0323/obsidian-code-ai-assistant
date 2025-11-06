// 核心类型定义（参考 Costrict）

export interface PluginSettings {
    // AI 配置
    apiProvider: 'openai' | 'anthropic';
    apiKey: string;
    apiModel: string;
    apiBaseUrl?: string;
    
    // GitLab 配置
    gitlabUrl: string;
    gitlabToken: string;
    
    // 本地仓库配置
    repositories: Repository[];
    preferLocalAccess: boolean;
    
    // UI 配置
    language: 'en' | 'zh-CN';
    theme: 'light' | 'dark' | 'auto';
}

export interface Repository {
    name: string;
    type: 'local' | 'gitlab';
    localPath?: string;
    projectId?: string;
    defaultBranch: string;
    currentBranch?: string;
    description?: string;
}

export interface CodeFile {
    path: string;
    content: string;
    language: string;
    size: number;
    lastModified?: Date;
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
    tokens?: number;
    cost?: number;
}

export interface AIResponse {
    content: string;
    tokens: {
        input: number;      // Input tokens (formerly 'prompt')
        output: number;     // Output tokens (formerly 'completion')
        total: number;
    };
    cost: number;
    model: string;
}

export interface Task {
    id: string;
    type: 'generate-doc' | 'generate-diagram' | 'code-review' | 'chat';
    status: 'pending' | 'running' | 'completed' | 'failed';
    input: any;
    output?: any;
    error?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Branch {
    name: string;
    commit: string;
    protected: boolean;
}

export interface FileTree {
    name: string;
    path: string;
    type: 'file' | 'directory';
    children?: FileTree[];
}

// AI 提供商配置
export interface AIProviderConfig {
    provider: 'openai' | 'anthropic';
    apiKey: string;
    model: string;
    baseUrl?: string;
    maxTokens?: number;
    temperature?: number;
}

// 代码上下文
export interface CodeContext {
    repository: string;
    branch: string;
    files: CodeFile[];
    description?: string;
}

// LogLevel 和 LogEntry 已移至 utils/logger.ts（使用 Costrict 的增强版）
