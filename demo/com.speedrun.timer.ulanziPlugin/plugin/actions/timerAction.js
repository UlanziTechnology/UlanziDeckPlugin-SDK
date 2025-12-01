/**
 * Timer Action Handler
 * Manages individual timer button actions
 */

class TimerAction {
  constructor(context, actionUUID, apiClient, signalRClient) {
    this.context = context;
    this.actionUUID = actionUUID;
    this.apiClient = apiClient;
    this.signalRClient = signalRClient;
    this.unsubscribe = null;
    this.updateInterval = null;
    this.currentStopwatch = null;

    // Start 버튼인 경우 타이머 1 데이터 구독
    if (this.actionUUID === 'com.speedrun.timer.start') {
      this.subscribeToTimer();
    }
  }

  /**
   * Subscribe to timer 1 updates
   */
  subscribeToTimer() {
    this.unsubscribe = this.signalRClient.subscribe(1, (stopwatch) => {
      this.handleTimerUpdate(stopwatch);
    });
  }

  /**
   * Handle timer update
   */
  handleTimerUpdate(stopwatch) {
    console.log('[TimerAction] Timer update received:', stopwatch);
    this.currentStopwatch = stopwatch;

    // Clear existing interval
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }

    if (stopwatch.status === 0) {
      // Running - update display every 100ms
      console.log('[TimerAction] Timer is running, starting interval');
      this.updateDisplay();
      this.updateInterval = setInterval(() => {
        this.updateDisplay();
      }, 100);
    } else {
      // Paused or Reset - update once
      console.log('[TimerAction] Timer is paused/reset, updating once');
      this.updateDisplay();
    }
  }

  /**
   * Update button display with current time
   */
  updateDisplay() {
    if (!this.currentStopwatch) {
      console.log('[TimerAction] No stopwatch data');
      return;
    }

    const elapsed = this.signalRClient.calculateElapsedTime(this.currentStopwatch);
    const timeString = this.signalRClient.formatTime(elapsed);

    console.log('[TimerAction] Rendering timer:', timeString);

    // Create canvas to render timer text as image
    const canvas = document.createElement('canvas');
    canvas.width = 72;
    canvas.height = 72;
    const ctx = canvas.getContext('2d');

    // Draw background (dark gradient)
    const gradient = ctx.createLinearGradient(0, 0, 0, 72);
    gradient.addColorStop(0, '#2a2a2a');
    gradient.addColorStop(1, '#1a1a1a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 72, 72);

    // Draw timer text
    ctx.fillStyle = '#00FF00';  // Green for running timer
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Split time string to fit on button
    const timeParts = timeString.split('.');
    const mainTime = timeParts[0];  // HH:MM:SS
    const millis = timeParts[1];    // mmm

    // Draw main time
    ctx.fillText(mainTime, 36, 32);

    // Draw milliseconds smaller
    ctx.font = 'bold 8px monospace';
    ctx.fillText('.' + millis, 36, 48);

    // Convert canvas to base64
    const imageData = canvas.toDataURL('image/png').split(',')[1];

    console.log('[TimerAction] Image data length:', imageData.length);

    // Update button with rendered image
    $UD.setBaseDataIcon(this.context, imageData);
  }

  /**
   * Execute the timer action based on UUID
   */
  async execute() {
    console.log('[TimerAction] Executing action:', this.actionUUID);
    console.log('[TimerAction] Context:', this.context);

    try {
      let result;

      switch (this.actionUUID) {
        case 'com.speedrun.timer.start':
          console.log('[TimerAction] Calling startBoth()...');
          result = await this.apiClient.startBoth();
          console.log('[TimerAction] startBoth() result:', result);
          this.showSuccess('Timers Started');
          break;

        case 'com.speedrun.timer.pause1p':
          console.log('[TimerAction] Calling pause1P()...');
          result = await this.apiClient.pause1P();
          console.log('[TimerAction] pause1P() result:', result);
          this.showSuccess('1P Paused');
          break;

        case 'com.speedrun.timer.pause2p':
          console.log('[TimerAction] Calling pause2P()...');
          result = await this.apiClient.pause2P();
          console.log('[TimerAction] pause2P() result:', result);
          this.showSuccess('2P Paused');
          break;

        case 'com.speedrun.timer.reset':
          console.log('[TimerAction] Calling resetBoth()...');
          result = await this.apiClient.resetBoth();
          console.log('[TimerAction] resetBoth() result:', result);
          this.showSuccess('Timers Reset');
          break;

        default:
          console.error('[TimerAction] Unknown action UUID:', this.actionUUID);
          this.showError('Unknown Action');
      }

      console.log('[TimerAction] Action completed successfully');
    } catch (error) {
      console.error('[TimerAction] Error executing action:', error);
      console.error('[TimerAction] Error stack:', error.stack);
      this.showError('API Error');
    }
  }

  /**
   * Show success feedback on the button
   */
  showSuccess(message) {
    console.log('[SUCCESS]', message);

    // Change button to success state (state 1) for Start and Pause buttons
    if (this.actionUUID !== 'com.speedrun.timer.reset') {
      $UD.setStateIcon(this.context, 1);

      // Reset to normal state after 1 second
      setTimeout(() => {
        $UD.setStateIcon(this.context, 0);
      }, 1000);
    }
  }

  /**
   * Show error feedback on the button
   */
  showError(message) {
    console.error('[ERROR]', message);

    // Keep button in normal state (state 0) on error
    if (this.actionUUID !== 'com.speedrun.timer.reset') {
      $UD.setStateIcon(this.context, 0);
    }
  }
}
