/**
 * Speedrun Timer Plugin - Main Application
 * Controls speedrun event timers via localhost:5010 API
 */

const STORAGE_KEY = 'speedrun-timer-server-url';
const DEFAULT_URL = 'https://localhost:5010';

// Load server URL from localStorage (global setting)
function loadServerUrl() {
  const savedUrl = localStorage.getItem(STORAGE_KEY);
  return savedUrl || DEFAULT_URL;
}

// Initialize the Timer API Client with saved URL
const timerAPI = new TimerAPIClient(loadServerUrl());

// Initialize SignalR Client for WebSocket connection
const signalRClient = new SignalRClient(loadServerUrl());

// Cache for action instances
const ACTION_CACHES = {};

// Connect to UlanziDeck
$UD.connect('com.speedrun.timer');

$UD.onConnected(async conn => {
  console.log('Speedrun Timer Plugin Connected');
  console.log('[App] Server URL:', timerAPI.baseUrl);

  // Connect to SignalR for real-time timer updates
  try {
    await signalRClient.connect();
    console.log('[App] SignalR connected');
  } catch (error) {
    console.error('[App] SignalR connection failed:', error);
  }
});

/**
 * When an action is added to a button
 */
$UD.onAdd(jsn => {
  const context = jsn.context;
  const actionUUID = jsn.uuid;  // Use uuid instead of action

  console.log('[App] Action added:', actionUUID, 'Context:', context);

  // Create new action instance if it doesn't exist
  if (!ACTION_CACHES[context]) {
    // Check if this is a display action (shows timer) or control action (starts/pauses/resets timer)
    if (actionUUID.includes('display')) {
      ACTION_CACHES[context] = new TimerDisplayAction(context, actionUUID, signalRClient);
      console.log('[App] Created new TimerDisplayAction instance');
    } else {
      ACTION_CACHES[context] = new TimerAction(context, actionUUID, timerAPI);
      console.log('[App] Created new TimerAction instance');
    }
  } else {
    console.log('[App] Action instance already exists');
  }
});

/**
 * When a button is pressed
 */
$UD.onRun(jsn => {
  console.log('[App] Button pressed:', jsn);
  const context = jsn.context;
  const actionUUID = jsn.uuid;

  console.log('[App] Context:', context);

  // Get existing action instance (must be created in onAdd)
  let instance = ACTION_CACHES[context];

  if (!instance) {
    console.error('[App] No action instance found for context:', context);
    console.error('[App] Available contexts:', Object.keys(ACTION_CACHES));
    return;
  }

  // Display actions don't need to execute on button press (they auto-update)
  if (actionUUID.includes('display')) {
    console.log('[App] Display action pressed - no action needed');
    return;
  }

  console.log('[App] Using existing TimerAction instance');

  // Execute the action
  console.log('[App] Executing action...');
  instance.execute();
});

/**
 * When an action is removed from a button
 */
$UD.onClear(jsn => {
  if (jsn.param) {
    for (let i = 0; i < jsn.param.length; i++) {
      const context = jsn.param[i].context;
      const instance = ACTION_CACHES[context];

      // Clean up TimerDisplayAction instances
      if (instance && instance.destroy) {
        instance.destroy();
      }

      delete ACTION_CACHES[context];
      console.log('Action cleared:', context);
    }
  }
});

/**
 * Handle settings updates from the Settings button
 * This is triggered when user changes URL in Settings Property Inspector
 */
$UD.onParamFromPlugin(jsn => {
  const settings = jsn.param || {};

  console.log('[App] Settings notification received:', settings);

  // Reload server URL from localStorage (global setting)
  const newUrl = loadServerUrl();
  timerAPI.baseUrl = newUrl;

  console.log('[App] Server URL updated to:', timerAPI.baseUrl);

  // All action instances share the same timerAPI object, so they're automatically updated
});

console.log('Speedrun Timer Plugin Initialized');
