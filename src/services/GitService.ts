// Git 服务（使用 simple-git）

import simpleGit, { SimpleGit, BranchSummary, StatusResult } from 'simple-git';
import { Branch } from '../shared/types';
import { createLogger } from '../utils/logger';

const logger = createLogger('GitService');

export class GitService {
    private git: Map<string, SimpleGit> = new Map();

    /**
     * 获取 Git 实例
     */
    private getGit(repoPath: string): SimpleGit {
        if (!this.git.has(repoPath)) {
            this.git.set(repoPath, simpleGit(repoPath));
        }
        return this.git.get(repoPath)!;
    }

    /**
     * 检查是否为 Git 仓库
     */
    async isGitRepository(repoPath: string): Promise<boolean> {
        try {
            const git = this.getGit(repoPath);
            await git.status();
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * 获取当前分支
     */
    async getCurrentBranch(repoPath: string): Promise<string> {
        try {
            const git = this.getGit(repoPath);
            const status = await git.status();
            return status.current || 'unknown';
        } catch (error) {
            logger.error(`Failed to get current branch: ${repoPath}`, error);
            throw error;
        }
    }

    /**
     * 获取所有分支
     */
    async getBranches(repoPath: string): Promise<Branch[]> {
        try {
            const git = this.getGit(repoPath);
            const branchSummary: BranchSummary = await git.branch();
            
            return branchSummary.all.map(name => ({
                name,
                commit: branchSummary.branches[name]?.commit || '',
                protected: false, // 需要额外 API 判断
            }));
        } catch (error) {
            logger.error(`Failed to get branches: ${repoPath}`, error);
            throw error;
        }
    }

    /**
     * 切换分支
     */
    async checkout(repoPath: string, branch: string): Promise<void> {
        try {
            const git = this.getGit(repoPath);
            await git.checkout(branch);
            logger.info(`Switched to branch: ${branch}`);
        } catch (error) {
            logger.error(`Failed to checkout branch: ${branch}`, error);
            throw error;
        }
    }

    /**
     * 创建并切换到新分支
     */
    async checkoutNewBranch(repoPath: string, branch: string): Promise<void> {
        try {
            const git = this.getGit(repoPath);
            await git.checkoutLocalBranch(branch);
            logger.info(`Created and switched to new branch: ${branch}`);
        } catch (error) {
            logger.error(`Failed to create branch: ${branch}`, error);
            throw error;
        }
    }

    /**
     * 获取仓库状态
     */
    async getStatus(repoPath: string): Promise<StatusResult> {
        try {
            const git = this.getGit(repoPath);
            return await git.status();
        } catch (error) {
            logger.error(`Failed to get status: ${repoPath}`, error);
            throw error;
        }
    }

    /**
     * 拉取最新代码
     */
    async pull(repoPath: string): Promise<void> {
        try {
            const git = this.getGit(repoPath);
            await git.pull();
            logger.info('Pulled latest changes');
        } catch (error) {
            logger.error(`Failed to pull: ${repoPath}`, error);
            throw error;
        }
    }

    /**
     * 获取远程 URL
     */
    async getRemoteUrl(repoPath: string): Promise<string> {
        try {
            const git = this.getGit(repoPath);
            const remotes = await git.getRemotes(true);
            const origin = remotes.find(r => r.name === 'origin');
            return origin?.refs.fetch || '';
        } catch (error) {
            logger.error(`Failed to get remote URL: ${repoPath}`, error);
            throw error;
        }
    }

    /**
     * 获取最近的提交
     */
    async getRecentCommits(repoPath: string, count: number = 10): Promise<any[]> {
        try {
            const git = this.getGit(repoPath);
            const log = await git.log({ maxCount: count });
            return Array.from(log.all);
        } catch (error) {
            logger.error(`Failed to get commits: ${repoPath}`, error);
            throw error;
        }
    }
}
