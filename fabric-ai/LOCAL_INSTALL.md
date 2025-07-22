# Local Installation Instructions

Since the extension requires a valid Raycast author account for publishing, here's how to install it locally for development:

## Option 1: Development Mode (Recommended)

1. Open Raycast
2. Press `⌘,` to open preferences
3. Go to Extensions tab
4. Click the "+" button
5. Select "Add Script Directory"
6. Navigate to `/Users/mohammedalhaqbani/Downloads/Manual Library/Projects/fabric-raycast/fabric-ai`
7. Click "Open"

The extension will now be available in development mode.

## Option 2: Build and Load

1. Build the extension without publishing:
   ```bash
   cd fabric-ai
   npx ray build -e dist --skip-types
   ```

2. In Raycast:
   - Press `⌘⇧P` to open command palette
   - Type "Import Extension"
   - Navigate to the `fabric-ai` folder
   - Select it to import

## Option 3: Create Local Store Entry

1. Edit package.json to use your Raycast username:
   ```json
   "author": "your-raycast-username",
   ```

2. Then publish normally:
   ```bash
   npm run publish
   ```

## Using the Extension

Once installed, you can:

1. **Browse Patterns**: Search "Browse Fabric Patterns" in Raycast
2. **Run Pattern**: Search "Run Pattern" for flexible execution
3. **Quick Commands**: Use shortcuts like:
   - "Summarize Text"
   - "Extract Wisdom"
   - "Improve Writing"
   - And 17 more pattern shortcuts

## Troubleshooting

If commands don't appear:
1. Restart Raycast: `⌘Q` then reopen
2. Check that Fabric CLI is installed: `which fabric`
3. Verify extension is listed in Raycast preferences

## Configuration

After installation, configure the extension in Raycast preferences:
- Default AI model
- Temperature settings
- Custom Fabric path (if needed)