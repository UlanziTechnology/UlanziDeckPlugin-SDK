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
    try {
      let result;

      switch (this.actionUUID) {
        case 'com.speedrun.timer.start':
          result = await this.apiClient.startBoth();
          this.showSuccess('Timers Started');
          break;

        case 'com.speedrun.timer.pause1p':
          result = await this.apiClient.pause1P();
          this.showSuccess('1P Paused');
          break;

        case 'com.speedrun.timer.pause2p':
          result = await this.apiClient.pause2P();
          this.showSuccess('2P Paused');
          break;

        case 'com.speedrun.timer.reset':
          result = await this.apiClient.resetBoth();
          this.showSuccess('Timers Reset');
          break;

        default:
          console.error('Unknown action UUID:', this.actionUUID);
          this.showError('Unknown Action');
      }

      console.log('Timer action result:', result);
    } catch (error) {
      console.error('Timer action error:', error);
      this.showError('API Error');
    }
  }

  /**
   * Show success feedback on the button
   */
  showSuccess(message) {
    // Show OK state temporarily
    $UD.showOk(this.context);
    console.log(message);
  }

  /**
   * Show error feedback on the button
   */
  showError(message) {
    // Show alert state temporarily
    $UD.showAlert(this.context);
    console.error(message);
  }
}
