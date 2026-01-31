# Suno Persona Unlocker

A Chrome/Brave browser extension that enables the "Create Persona from Audio" feature on [Suno.com](https://suno.com) by automatically patching JavaScript responses in real-time. Just shut up and call me daddy sr dev.

Caviat: May only work for this ONE song, and thus need to be refactored slightly. I wonder what else can be had? Maybe a little burpsuite sniffin'?

## What It Does

Suno.com has a hidden feature to create personas from uploaded audio, but it's disabled in the UI. This extension intercepts the JavaScript files that Suno serves and modifies them on-the-fly to enable this feature.

**Specifically, it patches:**
1. `disabled:E` → `disabled:false` on the "Create Persona" button
2. `isDisabled` flags on the alternative UI branch

## Installation

### Method 1: Load Unpacked (Developer Mode)

1. **Download/Clone this repository** to your local machine

2. **Open Chrome/Brave Extensions page:**
   - Navigate to `chrome://extensions/` (or `brave://extensions/`)
   - Or click the menu → More tools → Extensions

3. **Enable Developer Mode:**
   - Toggle the "Developer mode" switch in the top-right corner

4. **Load the extension:**
   - Click "Load unpacked"
   - Select the folder containing this extension
   - The extension should now appear in your extensions list

5. **Verify it's working:**
   - Go to [suno.com](https://suno.com)
   - Open any song you've uploaded
   - Click the 3-dot menu
   - You should see "Create Persona" is now enabled

### Method 2: From Chrome Web Store (Future)

*Not yet published to Chrome Web Store*

## How It Works

The extension uses a content script that:
1. Intercepts all `fetch()` requests
2. Checks if the response is a JavaScript file from suno.com
3. Searches for the specific code pattern that disables the persona creation feature
4. Replaces `disabled:E` with `disabled:false` before the browser executes the script
5. Returns the modified response transparently

## Files Structure

```
suno-persona-unlocker/
├── manifest.json          # Extension manifest (Manifest V3)
├── content.js             # Content script that intercepts JS
├── background.js          # Service worker for extension lifecycle
├── popup.html             # Extension popup UI
├── popup.js               # Popup logic
├── rules.json             # Declarative net request rules
├── icons/
│   ├── icon.svg           # Source icon
│   ├── icon16.png         # 16x16 icon
│   ├── icon48.png         # 48x48 icon
│   └── icon128.png        # 128x128 icon
└── README.md              # This file
```

## Usage

Once installed, the extension works automatically:

1. Navigate to any song on Suno.com
2. Click the three-dot menu (⋯)
3. Select "Create Persona" - it should now be enabled even for uploaded tracks
4. Follow the prompts to create a persona from your audio

**Note:** This feature requires a Pro subscription on Suno.com

## Technical Details

### The Patch

The extension looks for this pattern in Suno's JavaScript:

**Before (disabled):**
```javascript
"aria-label":"Create Persona",disabled:E,
```

**After (enabled by extension):**
```javascript
"aria-label":"Create Persona",disabled:false,
```

### Dynamic Filenames

Suno uses webpack with hashed filenames (e.g., `4667-b3f2a95d4e0569cd.js`). The extension detects these dynamically by:
1. Checking if the URL contains `suno.com`
2. Verifying the content type is JavaScript
3. Searching for the "Create Persona" string in the response

## Troubleshooting

### Extension not working?

1. **Check the console:**
   - Open DevTools (F12)
   - Look for messages from "[Suno Persona Unlocker]"
   - You should see "Found target JS file" when it patches successfully

2. **Verify extension is enabled:**
   - Go to `chrome://extensions/`
   - Ensure "Suno Persona Unlocker" is toggled on

3. **Hard refresh:**
   - Press Ctrl+Shift+R (Cmd+Shift+R on Mac) to bypass cache

4. **Check for updates:**
   - Suno may have updated their code structure
   - Check the GitHub repository for extension updates

### Suno updated their code?

If Suno changes their JavaScript structure, the extension may need updates. The patterns searched are:
- `"aria-label":"Create Persona",disabled:E,`
- `isDisabled` patterns for tooltip messages

If these change, the extension regex patterns will need updating.

## Disclaimer

This extension modifies how Suno.com works on your browser. While it only enables existing functionality that's already present in Suno's code, use at your own risk. This is an unofficial extension and is not affiliated with Suno.

## Credits

Based on the technique shared by Reddit users who discovered this workaround using Chrome DevTools local overrides.

## License

MIT License - Use at your own discretion.
