// 代码服务（本地 Git + GitLab API）

import { Repository, CodeFile, FileTree } from '../shared/types';
import { createLogger } from '../utils/logger';
import * as fs from 'fs';
import * as path from 'path';

const logger = createLogger('CodeService');

// 简化的工具函数
async function readCodeFile(filePath: string): Promise<CodeFile> {
    const content = await fs.promises.readFile(filePath, 'utf-8');
    const stats = await fs.promises.stat(filePath);
    const ext = path.extname(filePath).toLowerCase();
    
    // 简单的语言检测
    const languageMap: Record<string, string> = {
        '.ts': 'typescript',
        '.js': 'javascript',
        '.py': 'python',
        '.java': 'java',
        '.cpp': 'cpp',
        '.c': 'c',
        '.go': 'go',
        '.rs': 'rust',
        '.md': 'markdown',
        '.json': 'json',
        '.yml': 'yaml',
        '.yaml': 'yaml',
    };
    
    return {
        path: filePath,
        content,
        language: languageMap[ext] || 'plaintext',
        size: stats.size,
        lastModified: stats.mtime
    };
}

interface BuildFileTreeOptions {
    maxDepth?: number;
    ignorePatterns?: RegExp[];
}

async function buildFileTree(dirPath: string, options: BuildFileTreeOptions = {}): Promise<FileTree> {
    const { maxDepth = 10, ignorePatterns = [] } = options;
    const stats = await fs.promises.stat(dirPath);
    const name = path.basename(dirPath);
    
    if (!stats.isDirectory()) {
        return {
            name,
            path: dirPath,
            type: 'file'
        };
    }
    
    // 检查是否应该忽略
    const shouldIgnore = ignorePatterns.some(pattern => pattern.test(dirPath));
    if (shouldIgnore || maxDepth <= 0) {
        return {
            name,
            path: dirPath,
            type: 'directory',
            children: []
        };
    }
    
    const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });
    const children: FileTree[] = [];
    
    for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        
        // 检查是否应该忽略
        const shouldIgnoreEntry = ignorePatterns.some(pattern => pattern.test(entry.name));
        if (shouldIgnoreEntry) {
            continue;
        }
        
        if (entry.isDirectory()) {
            children.push(await buildFileTree(fullPath, {
                maxDepth: maxDepth - 1,
                ignorePatterns
            }));
        } else {
            children.push({
                name: entry.name,
                path: fullPath,
                type: 'file'
            });
        }
    }
    
    return {
        name,
        path: dirPath,
        type: 'directory',
        children
    };
}

function normalizePath(p: string): string {
    return p.replace(/\\/g, '/');
}

export class CodeService {
    private gitlabUrl: string;
    private gitlabToken: string;
    private repositories: Map<string, Repository>;

    constructor(gitlabUrl: string, gitlabToken: string, repositories: Repository[]) {
        this.gitlabUrl = gitlabUrl;
        this.gitlabToken = gitlabToken;
        this.repositories = new Map(repositories.map(r => [r.name, r]));
    }

    /**
     * 获取仓库
     */
    getRepository(name: string): Repository | undefined {
        return this.repositories.get(name);
    }

    /**
     * 添加仓库
     */
    addRepository(repo: Repository): void {
        this.repositories.set(repo.name, repo);
    }

    /**
     * 删除仓库
     */
    removeRepository(name: string): void {
        this.repositories.delete(name);
    }

    /**
     * 读取文件（本地优先）
     */
    async readFile(repoName: string, filePath: string): Promise<CodeFile> {
        const repo = this.getRepository(repoName);
        if (!repo) {
            throw new Error(`Repository not found: ${repoName}`);
        }

        try {
            // 优先使用本地
            if (repo.type === 'local' && repo.localPath) {
                return await this.readLocalFile(repo.localPath, filePath);
            }

            // 备用：GitLab API
            if (repo.type === 'gitlab' && repo.projectId) {
                return await this.readGitLabFile(repo, filePath);
            }

            throw new Error('No valid file access method');
        } catch (error) {
            logger.error(`Failed to read file: ${repoName}/${filePath}`, error);
            throw error;
        }
    }

    /**
     * 读取本地文件
     */
    private async readLocalFile(basePath: string, filePath: string): Promise<CodeFile> {
        const fullPath = normalizePath(`${basePath}/${filePath}`);
        return await readCodeFile(fullPath);
    }

    /**
     * 通过 GitLab API 读取文件
     */
    private async readGitLabFile(repo: Repository, filePath: string): Promise<CodeFile> {
        const encodedPath = encodeURIComponent(filePath);
        const branch = repo.currentBranch || repo.defaultBranch;
        const apiUrl = `${this.gitlabUrl}/api/v4/projects/${repo.projectId}/repository/files/${encodedPath}/raw?ref=${branch}`;

        const response = await fetch(apiUrl, {
            headers: {
                'Authorization': `Bearer ${this.gitlabToken}`,
            },
        });

        if (!response.ok) {
            throw new Error(`GitLab API error: ${response.status} ${response.statusText}`);
        }

        const content = await response.text();

        return {
            path: filePath,
            content,
            language: filePath.split('.').pop() || 'plaintext',
            size: content.length,
        };
    }

    /**
     * 获取文件树（仅本地）
     */
    async getFileTree(repoName: string): Promise<FileTree | null> {
        const repo = this.getRepository(repoName);
        if (!repo || repo.type !== 'local' || !repo.localPath) {
            logger.warn('File tree only available for local repositories');
            return null;
        }

        try {
            return await buildFileTree(repo.localPath, {
                maxDepth: 5,
                ignorePatterns: [
                    /node_modules/,
                    /\.git/,
                    /dist/,
                    /build/,
                    /\.next/,
                    /target/,
                ],
            });
        } catch (error) {
            logger.error(`Failed to build file tree: ${repoName}`, error);
            throw error;
        }
    }

    /**
     * 获取 GitLab 项目信息
     */
    async getGitLabProject(projectId: string): Promise<any> {
        const apiUrl = `${this.gitlabUrl}/api/v4/projects/${projectId}`;

        const response = await fetch(apiUrl, {
            headers: {
                'Authorization': `Bearer ${this.gitlabToken}`,
            },
        });

        if (!response.ok) {
            throw new Error(`GitLab API error: ${response.status}`);
        }

        return await response.json();
    }

    /**
     * 获取 GitLab 分支列表
     */
    async getGitLabBranches(projectId: string): Promise<any[]> {
        const apiUrl = `${this.gitlabUrl}/api/v4/projects/${projectId}/repository/branches`;

        const response = await fetch(apiUrl, {
            headers: {
                'Authorization': `Bearer ${this.gitlabToken}`,
            },
        });

        if (!response.ok) {
            throw new Error(`GitLab API error: ${response.status}`);
        }

        return await response.json();
    }

    /**
     * 更新配置
     */
    updateConfig(gitlabUrl: string, gitlabToken: string): void {
        this.gitlabUrl = gitlabUrl;
        this.gitlabToken = gitlabToken;
    }
}
