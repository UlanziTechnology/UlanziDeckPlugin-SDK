# Speedrun Timer Plugin for UlanziDeck

A UlanziDeck plugin to control speedrun event timers via HTTP API.

## Features

This plugin provides 4 button actions to control speedrun timers:

1. **Start** - Start both timers (1P and 2P)
2. **Pause 1P** - Pause Player 1 timer
3. **Pause 2P** - Pause Player 2 timer
4. **Reset** - Reset both timers

## Requirements

- UlanziDeck software version 6.1 or higher
- Timer server running on `http://localhost:5010`
- Timer server must implement the `/api/timer` endpoint

## API Specification

The plugin communicates with a timer server using the following API:

**Endpoint:** `POST http://localhost:5010/api/timer`

**Request Body:**
```json
{
  "Id": 1,      // Timer ID (1 or 2)
  "Type": 3     // Command Type (0-3)
}
```

**Command Types:**
- `0` - Resume: Resume the timer
- `1` - Pause: Pause the timer
- `2` - Reset: Reset the timer
- `3` - StartBoth: Start both timers

## Installation

1. Copy the `com.speedrun.timer.ulanziPlugin` folder to your UlanziDeck plugins directory
2. Restart UlanziDeck
3. The "Speedrun Timer" category will appear in the actions list

## Button Actions

### Start Button (▶ Start)
- Sends: `{ "Id": 1, "Type": 3 }`
- Action: Starts both 1P and 2P timers simultaneously

### 1P Pause Button (⏸ 1P Pause)
- Sends: `{ "Id": 1, "Type": 1 }`
- Action: Pauses Player 1 timer

### 2P Pause Button (⏸ 2P Pause)
- Sends: `{ "Id": 2, "Type": 1 }`
- Action: Pauses Player 2 timer

### Reset Button (↺ Reset)
- Sends: `{ "Id": 1, "Type": 2 }` followed by `{ "Id": 2, "Type": 2 }`
- Action: Resets both timers to 00:00:00

## Icon Requirements

The following icon files are required in the `assets/icons/` directory:

- `start.png` - Start button icon (72x72px, transparent PNG)
- `pause1p.png` - Pause 1P button icon (72x72px, transparent PNG)
- `pause2p.png` - Pause 2P button icon (72x72px, transparent PNG)
- `reset.png` - Reset button icon (72x72px, transparent PNG)
- `plugin.png` - Main plugin icon (72x72px, transparent PNG)
- `category.png` - Category icon (72x72px, transparent PNG)

### Recommended Icon Designs

- **Start**: Green play/triangle symbol ▶
- **Pause 1P**: Yellow/orange pause symbol with "1P" text ⏸
- **Pause 2P**: Yellow/orange pause symbol with "2P" text ⏸
- **Reset**: Blue circular arrow symbol ↺
- **Plugin/Category**: Stopwatch or timer icon 🕐

## Testing

To test the plugin without a real timer server, you can create a simple mock server:

```javascript
// mock-server.js
const http = require('http');

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/api/timer') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      const data = JSON.parse(body);
      console.log('Received:', data);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        message: `Timer ${data.Id} updated with type ${data.Type}`
      }));
    });
  }
});

server.listen(5010, () => {
  console.log('Mock timer server running on http://localhost:5010');
});
```

Run with: `node mock-server.js`

## Troubleshooting

### Plugin doesn't appear in UlanziDeck
- Verify the plugin folder is in the correct location
- Check that all required files exist
- Restart UlanziDeck

### Buttons show error (red alert)
- Ensure the timer server is running on `http://localhost:5010`
- Check server console for errors
- Verify the API endpoint is `/api/timer`

### No response from buttons
- Open browser console in UlanziDeck developer mode
- Check for JavaScript errors
- Verify network connectivity to localhost:5010

## Development

### File Structure
```
com.speedrun.timer.ulanziPlugin/
├── manifest.json                 # Plugin configuration
├── en.json                       # English localization
├── ko.json                       # Korean localization
├── README.md                     # This file
├── assets/
│   └── icons/                    # Icon images
├── libs/
│   └── js/                       # Common libraries
└── plugin/
    ├── app.html                  # Main HTML entry point
    ├── app.js                    # Main plugin logic
    └── actions/
        ├── timerClient.js        # API client
        └── timerAction.js        # Action handlers
```

### Modifying API URL

To change the API server URL, edit `plugin/app.js`:

```javascript
const timerAPI = new TimerAPIClient('http://your-server:port');
```

## License

This plugin is licensed under AGPL 3.0.

## Author

Speedrun Timer Plugin
Version 1.0.0

## Support

For issues and questions, please refer to the main UlanziDeck Plugin SDK documentation.
