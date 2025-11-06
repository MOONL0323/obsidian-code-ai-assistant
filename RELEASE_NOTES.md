# Release v1.0.0

First stable release of Code AI Assistant for Obsidian.

## Features

### AI Integration
- OpenAI support (GPT-4, GPT-4o, GPT-4o-mini, GPT-3.5-turbo)
- Anthropic support (Claude 3.5 Sonnet, Claude 3 Opus, Claude 3 Haiku)
- Streaming response with real-time display
- Token counting and cost estimation
- Chat history management

### Repository Management
- Local Git repository integration (using simple-git)
- GitLab API support
- File tree browser with filtering
- Branch management and switching
- Multi-language code file reading

### User Interface
- Clean chat interface
- Comprehensive settings panel
- Ribbon icon for quick access
- Command palette integration
- Chinese and English language support

## Installation

1. Download `code-ai-assistant.zip` from the release assets
2. Extract to your Obsidian vault's plugin directory: `<vault>/.obsidian/plugins/code-ai-assistant/`
3. Reload Obsidian or press `Ctrl+R`
4. Enable the plugin in Settings -> Community plugins

## Configuration

1. Open Settings -> Code AI Assistant
2. Choose AI Provider (OpenAI or Anthropic)
3. Enter your API Key
4. Select a model (recommended: gpt-4o-mini or claude-3-5-sonnet)
5. Optionally configure GitLab integration

## Usage

- Click the chat icon in the ribbon to open the AI chat interface
- Or use Command Palette: "Open AI Chat"
- Start chatting with AI about your code!

## Requirements

- Obsidian v0.15.0 or higher
- Valid API key for OpenAI or Anthropic

## Known Issues

None at this time.

## Feedback

If you encounter any issues or have suggestions, please:
- Open an issue on [GitHub](https://github.com/MOONL0323/obsidian-code-ai-assistant/issues)
- Include your Obsidian version and error logs if applicable

## What's Next

Future releases will include:
- Additional AI providers (Gemini, DeepSeek, Ollama)
- Code review functionality
- Documentation generation
- Architecture diagram generation

---

Thank you for using Code AI Assistant!
