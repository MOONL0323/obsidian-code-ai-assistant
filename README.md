# Code AI Assistant

基于 Costrict 架构的 Obsidian AI 代码助手插件，支持多种 AI 模型、本地 Git 仓库和 GitLab API 集成。

## 功能特性

### AI 对话
- 支持 OpenAI (GPT-4, GPT-4o, GPT-4o-mini)
- 支持 Anthropic (Claude 3.5 Sonnet, Claude 3 Opus, Claude 3 Haiku)
- 流式响应，实时显示 AI 回复
- Token 计数和成本估算
- 聊天历史记录保存

### 代码仓库管理
- 本地 Git 仓库集成（使用 simple-git）
- GitLab API 支持
- 文件树浏览
- 分支管理和切换
- 代码文件读取（支持多种编程语言）

### 扩展功能
- 代码审查（计划中）
- 文档生成（计划中）
- 架构图生成（计划中）
- 多语言支持（中文、英文）

## 安装方法

### 方式 1: 手动安装

1. 下载最新版本的 release
2. 解压到 Obsidian vault 的插件目录：
   ```
   <vault>/.obsidian/plugins/code-ai-assistant/
   ```
3. 重启 Obsidian 或按 `Ctrl+R` 重新加载
4. 在设置中启用 "Code AI Assistant" 插件

### 方式 2: 开发模式安装

```powershell
# 克隆仓库
git clone https://github.com/MOONL0323/obsidian-code-ai-assistant.git

# 安装依赖
cd obsidian-code-ai-assistant
npm install

# 构建
npm run build

# 创建符号链接到你的 vault
New-Item -ItemType SymbolicLink `
  -Path "你的Vault路径\.obsidian\plugins\code-ai-assistant" `
  -Target "当前项目路径"
```

## 使用指南

### 1. 配置 API Key

1. 打开 Obsidian 设置
2. 找到 "Code AI Assistant" 插件设置
3. 选择 AI Provider (OpenAI 或 Anthropic)
4. 输入你的 API Key
5. 选择模型（推荐 gpt-4o-mini 或 claude-3-5-sonnet）
6. 调整参数（可选）：
   - Temperature: 控制回复的随机性 (0-2)
   - Max Tokens: 最大生成长度

### 2. 配置 GitLab（可选）

如果需要访问 GitLab 仓库：
1. 在设置中填写 GitLab URL（例如：https://gitlab.com）
2. 输入 Personal Access Token
3. Token 需要 `api`, `read_repository` 权限

### 3. 开始使用

#### 打开聊天界面
- 点击左侧功能区的聊天图标
- 或使用命令面板：`Ctrl+P` 输入 "Open AI Chat"

#### 添加代码仓库
1. 在聊天界面点击仓库管理
2. 添加本地仓库或 GitLab 仓库
3. 浏览文件树，选择需要分析的代码

#### 与 AI 对话
1. 在输入框输入你的问题
2. 点击发送或按 `Enter`
3. AI 将实时流式返回回复
4. 查看 Token 消耗和成本估算

## 项目架构

### 技术栈

- **平台**: Obsidian Plugin API
- **语言**: TypeScript 5.3.0
- **构建工具**: esbuild 0.19.0
- **AI SDK**: 
  - openai ^5.12.2
  - @anthropic-ai/sdk ^0.37.0
- **Git 工具**: simple-git ^3.20.0
- **HTTP 客户端**: axios ^1.12.0

### 目录结构

```
obsidian-code-ai-assistant/
├── src/
│   ├── main.ts                 # 插件入口
│   ├── services/               # 核心服务
│   │   ├── AIService.ts        # AI 对话服务
│   │   ├── GitService.ts       # Git 操作服务
│   │   └── CodeService.ts      # 代码仓库服务
│   ├── views/                  # 用户界面
│   │   └── ChatView.ts         # 聊天视图
│   ├── settings/               # 设置面板
│   │   └── SettingsTab.ts      # 设置页面
│   ├── shared/                 # 共享模块
│   │   ├── types.ts            # 类型定义
│   │   ├── constants.ts        # 常量
│   │   └── language-simple.ts  # 国际化
│   ├── utils/                  # 工具函数
│   │   └── logger.ts           # 日志系统
│   └── types/                  # 类型声明
│       └── roo-code-types.ts   # Costrict 类型适配
├── styles.css                  # 样式文件
├── manifest.json               # 插件元数据
├── package.json                # 依赖配置
├── tsconfig.json               # TypeScript 配置
└── esbuild.config.mjs          # 构建配置
```

### 核心模块

#### AIService
处理与 AI 模型的交互：
- 支持 OpenAI 和 Anthropic API
- 流式响应处理
- Token 计数和成本估算
- 错误处理和重试

#### GitService
Git 仓库操作：
- 初始化 Git 实例
- 获取分支列表
- 切换分支
- 查询仓库状态
- 获取提交历史

#### CodeService
代码文件管理：
- 本地文件读取（支持多种语言）
- GitLab API 集成
- 文件树构建（支持深度限制和过滤）
- 路径规范化

#### ChatView
聊天界面组件：
- 消息列表显示
- 输入框和发送按钮
- 流式消息更新
- 历史记录管理

## 开发指南

### 环境要求

- Node.js >= 16.0.0
- npm >= 7.0.0

### 开发命令

```bash
# 安装依赖
npm install

# 开发模式（自动重新编译）
npm run dev

# 生产构建
npm run build

# 版本发布
npm version patch   # 1.0.0 -> 1.0.1
npm version minor   # 1.0.0 -> 1.1.0
npm version major   # 1.0.0 -> 2.0.0
```

### 构建流程

1. TypeScript 编译检查（不生成文件）
2. esbuild 打包（生成 main.js）
3. 自动处理 Node.js 内置模块
4. 生成 source map（开发模式）

### 添加新功能

1. 在 `src/services/` 创建新服务
2. 在 `src/views/` 添加新视图（如需要）
3. 在 `src/main.ts` 注册命令和视图
4. 更新 `src/shared/types.ts` 添加类型定义
5. 运行 `npm run build` 测试编译

## Costrict 集成

本项目基于 [Costrict](https://github.com/zgsm-ai/costrict) 架构设计，未来将逐步集成更多功能：

### 当前实现
- 简化版 AI 服务（OpenAI + Anthropic）
- 基础日志系统
- 最小化国际化支持

### 计划集成
- 45+ AI Provider 支持
- 完整的成本计算系统
- 高级工具函数库
- 更多 AI 功能

## 配置说明

### AI Provider 配置

#### OpenAI
```json
{
  "provider": "openai",
  "apiKey": "sk-...",
  "model": "gpt-4o-mini",
  "baseUrl": "https://api.openai.com/v1",
  "temperature": 0.7,
  "maxTokens": 4096
}
```

支持的模型：
- gpt-4o
- gpt-4o-mini
- gpt-4-turbo
- gpt-4
- gpt-3.5-turbo

#### Anthropic
```json
{
  "provider": "anthropic",
  "apiKey": "sk-ant-...",
  "model": "claude-3-5-sonnet-20241022",
  "temperature": 0.7,
  "maxTokens": 4096
}
```

支持的模型：
- claude-3-5-sonnet-20241022
- claude-3-opus-20240229
- claude-3-haiku-20240307

### 仓库配置

#### 本地仓库
```typescript
{
  name: "my-project",
  type: "local",
  localPath: "C:/projects/my-project",
  defaultBranch: "main"
}
```

#### GitLab 仓库
```typescript
{
  name: "my-project",
  type: "gitlab",
  projectId: "12345",
  defaultBranch: "main"
}
```

## 常见问题

### Q: 插件无法加载
A: 检查以下几点：
1. 确保 manifest.json、main.js、styles.css 都在插件目录
2. 打开开发者工具 (Ctrl+Shift+I) 查看错误信息
3. 尝试重新启动 Obsidian

### Q: API 调用失败
A: 可能的原因：
1. API Key 未配置或无效
2. 网络连接问题
3. API 配额不足
4. 请求参数错误（检查开发者工具的 Network 标签页）

### Q: Git 操作失败
A: 确保：
1. 本地仓库路径正确
2. Git 已安装并在 PATH 中
3. 有相应的文件读写权限

### Q: 如何自定义样式
A: 编辑 `styles.css` 文件，然后重新构建：
```bash
npm run build
```

## 更新日志

### v1.0.0 (2025-11-06)
- 首次发布
- 支持 OpenAI 和 Anthropic AI 对话
- 本地 Git 仓库管理
- GitLab API 集成
- 基础聊天界面
- 设置面板

## 贡献指南

欢迎贡献代码、报告问题或提出建议！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

MIT License

## 致谢

- [Costrict](https://github.com/zgsm-ai/costrict) - 核心架构灵感来源
- [Obsidian](https://obsidian.md) - 优秀的知识管理平台
- 所有贡献者和用户

## 联系方式

- GitHub: [@MOONL0323](https://github.com/MOONL0323)
- Issues: [提交问题](https://github.com/MOONL0323/obsidian-code-ai-assistant/issues)

---

如果这个插件对你有帮助，欢迎给个 Star！
