/**
 * Timer Action Handler
 * Manages individual timer button actions
 */

class TimerAction {
  constructor(context, actionUUID, apiClient) {
    this.context = context;
    this.actionUUID = actionUUID;
    this.apiClient = apiClient;
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
