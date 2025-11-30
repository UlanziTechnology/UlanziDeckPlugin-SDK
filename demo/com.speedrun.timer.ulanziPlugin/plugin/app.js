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

  console.log('[App] Action added:', actionUUID, 'Context:', context);

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

  console.log('Settings updated:', context, settings);
});

console.log('Speedrun Timer Plugin Initialized');
