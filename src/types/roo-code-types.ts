/**
 * Mock @roo-code/types package
 * 提取 Costrict 中使用的核心类型定义
 */

export type ApiProvider =
	| "anthropic"
	| "openai"
	| "openrouter"
	| "bedrock"
	| "vertex"
	| "openai-native"
	| "ollama"
	| "lmstudio"
	| "gemini"
	| "openai-native"
	| "deepseek"
	| "mistral"
	| "glama"
	| "claude-code"
	| "zgsm"
	| "qwen-code"
	| "doubao"
	| "xai"
	| "groq"
	| "moonshot"
	| "cerebras"
	| "huggingface"
	| "chutes"
	| "litellm"
	| "sambanova"
	| "zai"
	| "fireworks"
	| "io-intelligence"
	| "roo"
	| "featherless"
	| "vercel-ai-gateway"
	| "minimax"
	| "deepinfra"
	| "gemini-cli"
	| "vscode-lm"
	| "unbound"
	| "requesty"
	| "human-relay"
	| "fake-ai"

// Model IDs
export type AnthropicModelId = string
export type VertexModelId = string
export type BedrockModelId = string
export type OpenAIModelId = string
export type ClaudeCodeModelId = string
export type GeminiModelId = string
export type OllamaModelId = string
export type CerebrasModelId = string

// Default models
export const anthropicDefaultModelId = "claude-3-5-sonnet-20241022"
export const vertexDefaultModelId = "claude-3-5-sonnet-20241022"
export const bedrockDefaultModelId = "anthropic.claude-3-5-sonnet-20241022-v2:0"
export const openAiDefaultModelId = "gpt-4o"
export const claudeCodeDefaultModelId = "claude-code-latest"
export const geminiDefaultModelId = "gemini-2.0-flash-exp"
export const ollamaDefaultModelId = "qwen2.5-coder:7b"
export const cerebrasDefaultModelId = "llama-3.3-70b"
export const chutesDefaultModelId = "deepseek-chat"
export const bedrockDefaultPromptRouterModelId = "us.anthropic.claude-3-5-sonnet-20241022-v2:0"

// Model configs
export const anthropicModels: Record<string, ModelInfo> = {}
export const vertexModels: Record<string, ModelInfo> = {}
export const bedrockModels: Record<string, ModelInfo> = {}
export const claudeCodeModels: Record<string, ModelInfo> = {}
export const geminiModels: Record<string, ModelInfo> = {}

// Helper functions
export function getClaudeCodeModelId(id?: string): string {
	return id || claudeCodeDefaultModelId
}

// Constants
export const ANTHROPIC_DEFAULT_MAX_TOKENS = 8192
export const BEDROCK_DEFAULT_TEMPERATURE = 0
export const BEDROCK_MAX_TOKENS = 4096
export const BEDROCK_DEFAULT_CONTEXT = 200000
export const DEEP_SEEK_DEFAULT_TEMPERATURE = 1.0
export const AWS_INFERENCE_PROFILE_MAPPING: Record<string, string> = {}
export const BEDROCK_1M_CONTEXT_MODEL_IDS: string[] = []

export interface ModelInfo {
	maxTokens?: number
	contextWindow: number
	supportsImages?: boolean
	supportsComputerUse?: boolean
	supportsPromptCache: boolean
	inputPrice?: number
	outputPrice?: number
	cacheWritesPrice?: number
	cacheReadsPrice?: number
	description?: string
	supportsReasoningBudget?: boolean
	tiers?: any
	/**
	 * Extended capabilities for the model
	 */
	extended?: {
		/** Whether this model supports message streaming */
		streaming?: boolean
		/** Whether this model supports system prompts */
		systemPrompt?: boolean
		/** Whether this model supports tool calling */
		tools?: boolean
		/** Whether this model supports function calling (legacy) */
		functions?: boolean
	}
}

export const chutesDefaultModelInfo: ModelInfo = {
	maxTokens: 8192,
	contextWindow: 64000,
	supportsImages: true,
	supportsPromptCache: false,
	inputPrice: 0.27,
	outputPrice: 1.1,
}

export interface ProviderSettings {
	apiProvider: ApiProvider
	apiKey?: string
	apiModelId?: string
	openAiBaseUrl?: string
	openAiModelId?: string
	openAiStreamingEnabled?: boolean
	anthropicBaseUrl?: string
	anthropicApiKey?: string
	anthropicUseAuthToken?: boolean
	anthropicBeta1MContext?: boolean
	awsRegion?: string
	awsAccessKey?: string
	awsSecretKey?: string
	awsSessionToken?: string
	awsUseCrossRegionInference?: boolean
	awsCustomArn?: string
	awsUseApiKey?: boolean
	awsApiKey?: string
	awsUseProfile?: boolean
	awsProfile?: string
	awsBedrockEndpoint?: string
	awsBedrockEndpointEnabled?: boolean
	awsUsePromptCache?: boolean
	awsBedrock1MContext?: boolean
	awsModelContextWindow?: number
	vertexProjectId?: string
	vertexRegion?: string
	vertexJsonCredentials?: string
	vertexKeyFile?: string
	geminiApiKey?: string
	openRouterApiKey?: string
	openRouterModelId?: string
	openRouterModelInfo?: ModelInfo
	ollamaModelId?: string
	ollamaBaseUrl?: string
	lmStudioModelId?: string
	lmStudioBaseUrl?: string
	mistralApiKey?: string
	glamaApiKey?: string
	glamaModelId?: string
	glamaModelInfo?: ModelInfo
	deepSeekApiKey?: string
	deepSeekModelId?: string
	doubaoApiKey?: string
	doubaoModelId?: string
	moonshotApiKey?: string
	qwenCodeApiKey?: string
	qwenCodeModelId?: string
	xaiApiKey?: string
	groqApiKey?: string
	cerebrasApiKey?: string
	huggingFaceApiKey?: string
	huggingFaceModelId?: string
	chutesApiKey?: string
	chutesModelId?: string
	liteLLMBaseUrl?: string
	liteLLMModelId?: string
	sambaNovaApiKey?: string
	sambaNovaModelId?: string
	zaiApiKey?: string
	zaiModelId?: string
	fireworksApiKey?: string
	ioIntelligenceApiKey?: string
	ioIntelligenceModelId?: string
	rooApiKey?: string
	featherlessApiKey?: string
	featherlessModelId?: string
	vercelAiGatewayApiKey?: string
	vercelAiGatewayModelId?: string
	minimaxApiKey?: string
	minimaxGroupId?: string
	deepInfraApiKey?: string
	deepInfraModelId?: string
	vsCodeLmModelSelector?: { vendor: string; family: string }
	modelTemperature?: number
	modelMaxTokens?: number
}

export type Language = "en" | "zh-CN" | "ja" | "ko" | "es" | "fr" | "de" | "pt"

export function isLanguage(value: string): value is Language {
	return ["en", "zh-CN", "ja", "ko", "es", "fr", "de", "pt"].includes(value)
}

export type ReasoningEffort = "low" | "medium" | "high"
export type ReasoningEffortWithMinimal = "minimal" | ReasoningEffort

export type ToolName =
	| "write_to_file"
	| "read_file"
	| "list_files"
	| "search_files"
	| "execute_command"
	| "inspect_site"
	| "ask_followup_question"
	| "attempt_completion"

export type ToolProgressStatus = "loading" | "streaming" | "success" | "error" | "rejected"

export interface ToolGroup {
	name: string
	tools: ToolName[]
}

export type ClineAsk =
	| "command"
	| "completion_result"
	| "tool"
	| "api_req_failed"
	| "followup"
	| "api_req_retried"
