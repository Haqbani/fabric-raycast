# Fabric AI for Raycast

A Raycast extension that integrates [Fabric](https://github.com/danielmiessler/fabric) AI patterns directly into your workflow.

## Features

- **Browse Patterns**: Search and execute from 50+ AI patterns
- **Quick Commands**: Direct access to common patterns like:
  - Summarize Text
  - Extract Wisdom
  - Improve Writing
  - Analyze Claims
  - Create Presentations
  - And many more...
- **Flexible Input**: Works with clipboard content or selected text
- **Customizable**: Configure AI models, temperature, and output preferences

## Prerequisites

- [Raycast](https://raycast.com/) installed
- [Fabric CLI](https://github.com/danielmiessler/fabric) installed and configured
- Node.js 16+ and npm

## Installation

### Option 1: Local Development Mode

1. Clone this repository:
```bash
git clone https://github.com/yourusername/fabric-raycast.git
cd fabric-raycast
```

2. Install dependencies:
```bash
cd fabric-ai
npm install
```

3. Build the extension:
```bash
npm run build
```

4. Add to Raycast:
   - Open Raycast preferences (⌘,)
   - Go to Extensions tab
   - Click "+" → "Add Script Directory"
   - Select the `fabric-ai` folder
   - Click "Open"

### Option 2: Import Extension

1. In Raycast, press ⌘⇧P
2. Search for "Import Extension"
3. Navigate to the `fabric-ai` folder
4. Click "Import"

## Configuration

After installation, configure the extension in Raycast preferences:

1. Open Raycast preferences (⌘,)
2. Find "Fabric AI" in Extensions
3. Configure:
   - **Fabric CLI Path**: Path to your Fabric installation (e.g., `/Users/yourusername/go/bin/fabric`)
   - **Default AI Model**: Your preferred model (e.g., `gpt-4`)
   - **Temperature**: Control randomness (0.0-2.0)
   - **Default Output Mode**: Clipboard or replace selection

## Usage

1. **Browse All Patterns**:
   - Search "Browse Fabric Patterns" in Raycast
   - Browse by category or search
   - Select a pattern to execute

2. **Quick Pattern Access**:
   - Search for specific patterns like "Summarize Text" or "Extract Wisdom"
   - The extension will use your clipboard content or selected text

3. **Run Custom Pattern**:
   - Search "Run Pattern" for flexible pattern execution
   - Choose any pattern and provide custom input

## Available Patterns

The extension includes shortcuts for popular patterns:

- **Analysis**: Analyze Claims, Analyze Paper, Analyze Threat Report
- **Creation**: Create Quiz, Create Presentation, Create Keynote, Create Mermaid Diagram
- **Writing**: Improve Writing, Write Essay, Write LaTeX
- **Extraction**: Extract Wisdom, Extract Insights, Extract References, Extract Predictions
- **Summarization**: Summarize Text, Create Summary, Summarize Newsletter

## Troubleshooting

### "Fabric CLI not installed" Error

1. Ensure Fabric is installed: `which fabric`
2. Set the correct path in extension preferences
3. Common paths:
   - `/usr/local/bin/fabric`
   - `/Users/yourusername/go/bin/fabric`
   - `/opt/homebrew/bin/fabric`

### Extension Not Appearing

1. Restart Raycast (⌘Q and reopen)
2. Check Raycast Developer Console (⌘⇧P → "Open Developer Console")
3. Rebuild the extension: `npm run build`

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build extension
npm run build

# Lint code
npm run lint
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Credits

- Built for [Raycast](https://raycast.com/)
- Powered by [Fabric](https://github.com/danielmiessler/fabric) by Daniel Miessler