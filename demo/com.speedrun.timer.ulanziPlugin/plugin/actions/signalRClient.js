/**
 * SignalR WebSocket Client
 * Manages WebSocket connection to the timer server and receives real-time timer updates
 */

class SignalRClient {
  constructor(baseUrl = 'https://localhost:5010') {
    this.baseUrl = baseUrl;
    this.connection = null;
    this.isConnected = false;
    this.listeners = {
      1: [], // Timer 1 listeners
      2: []  // Timer 2 listeners
    };
    this.timerData = {
      1: null,
      2: null
    };

    console.log('[SignalRClient] Initialized with baseUrl:', this.baseUrl);
  }

  /**
   * Connect to SignalR Hub
   */
  async connect() {
    if (this.isConnected) {
      console.log('[SignalRClient] Already connected');
      return;
    }

    try {
      // Use the same base URL from global settings
      const signalRUrl = this.baseUrl + '/runtimer';
      console.log('[SignalRClient] Connecting to:', signalRUrl);

      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(signalRUrl, {
          skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets
        })
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: () => 2000  // Retry every 2 seconds
        })
        .build();

      // Register event handlers
      this.connection.on('ServerResponseStatus', (stopwatch) => {
        this.handleTimerUpdate(stopwatch);
      });

      this.connection.onreconnecting((error) => {
        console.log('[SignalRClient] Reconnecting:', error);
        this.isConnected = false;
      });

      this.connection.onreconnected((connectionId) => {
        console.log('[SignalRClient] Reconnected:', connectionId);
        this.isConnected = true;
        // Request timer status for both timers after reconnection
        this.requestTimerStatus(1);
        this.requestTimerStatus(2);
      });

      this.connection.onclose((error) => {
        console.log('[SignalRClient] Connection closed:', error);
        this.isConnected = false;
      });

      // Start connection
      await this.connection.start();
      this.isConnected = true;
      console.log('[SignalRClient] Connected successfully');

      // Request initial timer status for both timers
      await this.requestTimerStatus(1);
      await this.requestTimerStatus(2);

    } catch (error) {
      console.error('[SignalRClient] Connection failed:', error);
      this.isConnected = false;
      throw error;
    }
  }

  /**
   * Disconnect from SignalR Hub
   */
  async disconnect() {
    if (this.connection) {
      await this.connection.stop();
      this.isConnected = false;
      console.log('[SignalRClient] Disconnected');
    }
  }

  /**
   * Request timer status from server
   * @param {number} timerId - Timer ID (1 or 2)
   */
  async requestTimerStatus(timerId) {
    if (!this.isConnected || !this.connection) {
      console.warn('[SignalRClient] Not connected, cannot request timer status');
      return;
    }

    try {
      await this.connection.invoke('ServerSendStatus', timerId);
      console.log('[SignalRClient] Requested status for timer', timerId);
    } catch (error) {
      console.error('[SignalRClient] Failed to request timer status:', error);
    }
  }

  /**
   * Handle timer update from server
   * @param {Object} stopwatch - Stopwatch data
   */
  handleTimerUpdate(stopwatch) {
    console.log('[SignalRClient] Timer update received:', stopwatch);

    const timerId = stopwatch.id;  // lowercase
    this.timerData[timerId] = stopwatch;

    // Notify all listeners for this timer
    if (this.listeners[timerId]) {
      console.log('[SignalRClient] Notifying', this.listeners[timerId].length, 'listeners for timer', timerId);
      this.listeners[timerId].forEach(callback => {
        try {
          callback(stopwatch);
        } catch (error) {
          console.error('[SignalRClient] Error in listener callback:', error);
        }
      });
    }
  }

  /**
   * Subscribe to timer updates
   * @param {number} timerId - Timer ID (1 or 2)
   * @param {Function} callback - Callback function to receive updates
   * @returns {Function} Unsubscribe function
   */
  subscribe(timerId, callback) {
    if (!this.listeners[timerId]) {
      this.listeners[timerId] = [];
    }

    this.listeners[timerId].push(callback);
    console.log('[SignalRClient] Subscribed to timer', timerId);

    // If we already have data, send it immediately
    if (this.timerData[timerId]) {
      callback(this.timerData[timerId]);
    }

    // Return unsubscribe function
    return () => {
      const index = this.listeners[timerId].indexOf(callback);
      if (index > -1) {
        this.listeners[timerId].splice(index, 1);
        console.log('[SignalRClient] Unsubscribed from timer', timerId);
      }
    };
  }

  /**
   * Calculate current elapsed time based on timer status
   * @param {Object} stopwatch - Stopwatch data
   * @returns {number} Elapsed time in milliseconds
   */
  calculateElapsedTime(stopwatch) {
    if (stopwatch.status === 2) {
      // Reset - return zero
      return 0;
    } else if (stopwatch.status === 1) {
      // Paused - return time difference between finish and start
      const start = new Date(stopwatch.startTime);
      const finish = new Date(stopwatch.finishTime);
      return finish - start;
    } else if (stopwatch.status === 0) {
      // Running - return time difference between now and start
      const start = new Date(stopwatch.startTime);
      const now = new Date();
      return now - start;
    }
    return 0;
  }

  /**
   * Format elapsed time to HH:MM:SS.mmm
   * @param {number} ms - Milliseconds
   * @returns {string} Formatted time string
   */
  formatTime(ms) {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = ms % 1000;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(3, '0')}`;
  }
}
