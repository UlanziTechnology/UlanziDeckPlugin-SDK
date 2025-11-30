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
    if (actionUUID.includes('timer1p')) {
      return 1;
    } else if (actionUUID.includes('timer2p')) {
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

    if (stopwatch.Status === 0) {
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

    // Update button with icon path and time text
    const iconPath = this.timerId === 1 ? 'assets/icons/display1p.png' : 'assets/icons/display2p.png';
    $UD.setPathIcon(this.context, iconPath, timeString);
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
