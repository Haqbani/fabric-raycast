# Fabric AI for Raycast

Run Fabric AI patterns directly from Raycast to enhance your productivity with AI-powered text processing.

## Features

- **Browse Patterns**: Search and explore all available Fabric patterns with descriptions
- **Quick Execute**: Run any pattern on clipboard content or custom input
- **Pattern Shortcuts**: Direct commands for the most popular patterns
- **Favorites & Recents**: Quick access to your most-used patterns
- **Multiple Input Sources**: Clipboard, selected text, or manual input
- **Flexible Output**: Copy to clipboard or replace selected text

## Prerequisites

1. Install [Fabric CLI](https://github.com/danielmiessler/fabric):
   ```bash
   go install github.com/danielmiessler/fabric@latest
   ```

2. Configure Fabric with your API keys:
   ```bash
   fabric --setup
   ```

## Installation

1. Clone this repository
2. Navigate to the `fabric-ai` directory
3. Install dependencies:
   ```bash
   npm install
   ```
4. Build and import to Raycast:
   ```bash
   npm run build && npm run publish
   ```

## Available Commands

### Core Commands
- **Browse Fabric Patterns**: Search all patterns with categories and descriptions
- **Run Pattern**: Execute any pattern with custom options

### Quick Pattern Shortcuts
- **Summarize Text**: Create concise summaries
- **Extract Wisdom**: Extract key insights and wisdom
- **Improve Writing**: Enhance your text quality
- **Analyze Claims**: Fact-check and analyze claims
- **Create Quiz**: Generate quiz questions from content

## Usage Examples

### Summarize an Article
1. Copy article text to clipboard
2. Run "Summarize Text" command (⌘⇧S)
3. Summary is automatically copied to clipboard

### Analyze a Research Paper
1. Select text in your document
2. Run "Analyze Claims" command
3. Get fact-checked analysis instantly

### Improve Your Writing
1. Copy your draft text
2. Run "Improve Writing" command
3. Get enhanced version ready to paste

## Keyboard Shortcuts

- `⌘⇧S` - Summarize clipboard content
- `⌘⇧W` - Extract wisdom from clipboard
- `⌘⇧I` - Improve writing in clipboard
- `⌘F` - Toggle favorite pattern

## Configuration

Set your preferences in Raycast:
- Default AI model
- Output preferences
- Custom pattern paths

## Troubleshooting

### Fabric not found
Ensure Fabric is installed and available in your PATH:
```bash
which fabric
```

### Patterns not loading
Check your Fabric installation:
```bash
fabric --listpatterns
```

### API errors
Verify your API keys are configured:
```bash
fabric --setup
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT