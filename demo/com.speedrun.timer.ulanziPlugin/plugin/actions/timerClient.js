/**
 * Speedrun Timer API Client
 * Communicates with the timer server at localhost:5010
 */

class TimerAPIClient {
  constructor(baseUrl = 'https://localhost:5010') {
    this.baseUrl = baseUrl;
    console.log('[TimerAPIClient] Initialized with baseUrl:', this.baseUrl);
  }

  /**
   * Send a command to the timer API
   * @param {number} timerId - Timer ID (1 or 2)
   * @param {number} commandType - Command type (0: Resume, 1: Pause, 2: Reset, 3: StartBoth)
   */
  async sendCommand(timerId, commandType) {
    const url = `${this.baseUrl}/api/timer`;
    const payload = {
      Id: timerId,
      Type: commandType
    };

    console.log('[TimerAPIClient] Sending command to:', url);
    console.log('[TimerAPIClient] Payload:', payload);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      console.log('[TimerAPIClient] Response status:', response.status);
      console.log('[TimerAPIClient] Response ok:', response.ok);

      if (!response.ok) {
        const error = await response.json();
        console.error('[TimerAPIClient] Server error:', error);
        throw new Error(error.error || 'Unknown error');
      }

      const result = await response.json();
      console.log('[TimerAPIClient] Success response:', result);
      return result;
    } catch (error) {
      console.error('[TimerAPIClient] Fetch error:', error);
      console.error('[TimerAPIClient] Error type:', error.name);
      console.error('[TimerAPIClient] Error message:', error.message);
      console.error('[TimerAPIClient] Error stack:', error.stack);
      throw error;
    }
  }

  /**
   * Start both timers
   */
  async startBoth() {
    return this.sendCommand(1, 3);  // Type: StartBoth
  }

  /**
   * Pause Player 1 timer
   */
  async pause1P() {
    return this.sendCommand(1, 1);  // Type: Pause
  }

  /**
   * Pause Player 2 timer
   */
  async pause2P() {
    return this.sendCommand(2, 1);  // Type: Pause
  }

  /**
   * Reset Player 1 timer
   */
  async reset1P() {
    return this.sendCommand(1, 2);  // Type: Reset
  }

  /**
   * Reset Player 2 timer
   */
  async reset2P() {
    return this.sendCommand(2, 2);  // Type: Reset
  }

  /**
   * Reset both timers
   */
  async resetBoth() {
    await this.reset1P();
    await this.reset2P();
  }

  /**
   * Resume Player 1 timer
   */
  async resume1P() {
    return this.sendCommand(1, 0);  // Type: Resume
  }

  /**
   * Resume Player 2 timer
   */
  async resume2P() {
    return this.sendCommand(2, 0);  // Type: Resume
  }
}
