/**
 * Speedrun Timer Plugin - Main Application
 * Controls speedrun event timers via localhost:5010 API
 */

// Initialize the Timer API Client
const timerAPI = new TimerAPIClient('https://localhost:5010');

// Cache for action instances
const ACTION_CACHES = {};

// Connect to UlanziDeck
$UD.connect('com.speedrun.timer');

$UD.onConnected(conn => {
  console.log('Speedrun Timer Plugin Connected');
});

/**
 * When an action is added to a button
 */
$UD.onAdd(jsn => {
  const context = jsn.context;
  const actionUUID = jsn.uuid;  // Use uuid instead of action
  const settings = jsn.param || {};

  console.log('[App] Action added:', actionUUID, 'Context:', context);
  console.log('[App] Settings:', settings);

  // Update API base URL if custom URL is set
  if (settings.serverUrl) {
    timerAPI.baseUrl = settings.serverUrl;
    console.log('[App] Using custom server URL:', settings.serverUrl);
  }

  // Create new action instance if it doesn't exist
  if (!ACTION_CACHES[context]) {
    ACTION_CACHES[context] = new TimerAction(context, actionUUID, timerAPI);
    console.log('[App] Created new TimerAction instance');
  } else {
    console.log('[App] TimerAction instance already exists');
  }
});

/**
 * When a button is pressed
 */
$UD.onRun(jsn => {
  console.log('[App] Button pressed:', jsn);
  const context = jsn.context;

  console.log('[App] Context:', context);

  // Get existing action instance (must be created in onAdd)
  let instance = ACTION_CACHES[context];

  if (!instance) {
    console.error('[App] No action instance found for context:', context);
    console.error('[App] Available contexts:', Object.keys(ACTION_CACHES));
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
      delete ACTION_CACHES[context];
      console.log('Action cleared:', context);
    }
  }
});

/**
 * Handle settings updates from the property inspector
 */
$UD.onParamFromPlugin(jsn => {
  const context = jsn.context;
  const settings = jsn.param || {};

  console.log('[App] Settings updated:', context, settings);

  // Update server URL dynamically
  if (settings.serverUrl) {
    timerAPI.baseUrl = settings.serverUrl;
    console.log('[App] Server URL updated to:', settings.serverUrl);
  } else {
    timerAPI.baseUrl = 'https://localhost:5010';
    console.log('[App] Server URL reset to default');
  }

  // Update the action instance's API client if it exists
  if (ACTION_CACHES[context]) {
    ACTION_CACHES[context].apiClient = timerAPI;
    console.log('[App] Action instance API client updated');
  }
});

console.log('Speedrun Timer Plugin Initialized');
