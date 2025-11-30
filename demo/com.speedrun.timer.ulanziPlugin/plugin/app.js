/**
 * Speedrun Timer Plugin - Main Application
 * Controls speedrun event timers via localhost:5010 API
 */

// Initialize the Timer API Client
const timerAPI = new TimerAPIClient('http://localhost:5010');

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
  const actionUUID = jsn.action;

  // Create new action instance if it doesn't exist
  if (!ACTION_CACHES[context]) {
    ACTION_CACHES[context] = new TimerAction(context, actionUUID, timerAPI);
  }

  console.log('Action added:', actionUUID, 'Context:', context);
});

/**
 * When a button is pressed
 */
$UD.onRun(jsn => {
  const context = jsn.context;
  const actionUUID = jsn.action;

  // Get or create action instance
  let instance = ACTION_CACHES[context];
  if (!instance) {
    instance = new TimerAction(context, actionUUID, timerAPI);
    ACTION_CACHES[context] = instance;
  }

  // Execute the action
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
