/**
 * Timer Display Action Handler
 * Displays real-time timer data received via WebSocket
 */

class TimerDisplayAction {
  constructor(context, actionUUID, signalRClient) {
    this.context = context;
    this.actionUUID = actionUUID;
    this.signalRClient = signalRClient;
    this.unsubscribe = null;
    this.updateInterval = null;
    this.currentStopwatch = null;

    // Determine which timer this action displays
    this.timerId = this.getTimerId(actionUUID);

    console.log('[TimerDisplayAction] Created for timer', this.timerId);

    // Subscribe to timer updates
    this.subscribeToTimer();
  }

  /**
   * Get timer ID from action UUID
   */
  getTimerId(actionUUID) {
    if (actionUUID.includes('display1')) {
      return 1;
    } else if (actionUUID.includes('display2')) {
      return 2;
    }
    return 1; // Default to timer 1
  }

  /**
   * Subscribe to timer updates from SignalR
   */
  subscribeToTimer() {
    this.unsubscribe = this.signalRClient.subscribe(this.timerId, (stopwatch) => {
      console.log('[TimerDisplayAction] Received update for timer', this.timerId, ':', stopwatch);
      this.handleTimerUpdate(stopwatch);
    });
  }

  /**
   * Handle timer update
   */
  handleTimerUpdate(stopwatch) {
    this.currentStopwatch = stopwatch;

    // Clear existing interval
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }

    if (stopwatch.status === 0) {
      // Running - update display every 100ms
      this.updateDisplay();
      this.updateInterval = setInterval(() => {
        this.updateDisplay();
      }, 100);
    } else {
      // Paused or Reset - update once
      this.updateDisplay();
    }
  }

  /**
   * Update button display with current time
   */
  updateDisplay() {
    if (!this.currentStopwatch) {
      return;
    }

    const elapsed = this.signalRClient.calculateElapsedTime(this.currentStopwatch);
    const timeString = this.signalRClient.formatTime(elapsed);

    console.log('[TimerDisplayAction] Updating display:', timeString);

    // Create canvas to render timer text as image
    const canvas = document.createElement('canvas');
    canvas.width = 72;
    canvas.height = 72;
    const ctx = canvas.getContext('2d');

    // Draw background (solid black for better contrast)
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, 72, 72);

    // Split time string to fit on button
    const timeParts = timeString.split('.');
    const mainTime = timeParts[0];  // HH:MM:SS
    const millis = timeParts[1];    // mmm

    // Determine color based on timer status
    let mainColor, millisColor;
    if (this.currentStopwatch.status === 2) {
      // Reset - Yellow
      mainColor = '#FFFF00';
      millisColor = '#CCCC00';
    } else if (this.currentStopwatch.status === 0) {
      // Running - White
      mainColor = '#FFFFFF';
      millisColor = '#CCCCCC';
    } else if (this.currentStopwatch.status === 1) {
      // Paused - Red
      mainColor = '#FF0000';
      millisColor = '#CC0000';
    }

    // Draw main time with outline for better visibility
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Main time - larger and with stroke
    ctx.font = 'bold 13px monospace';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.strokeText(mainTime, 36, 30);
    ctx.fillStyle = mainColor;
    ctx.fillText(mainTime, 36, 30);

    // Milliseconds - smaller
    ctx.font = 'bold 10px monospace';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.strokeText('.' + millis, 36, 48);
    ctx.fillStyle = millisColor;
    ctx.fillText('.' + millis, 36, 48);

    // Convert canvas to base64
    const imageData = canvas.toDataURL('image/png').split(',')[1];

    // Update button with rendered image
    $UD.setBaseDataIcon(this.context, imageData);
  }

  /**
   * Clean up when action is removed
   */
  destroy() {
    console.log('[TimerDisplayAction] Destroying action for timer', this.timerId);

    // Unsubscribe from timer updates
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }

    // Clear update interval
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }
}
