class WebSocketService {
  private ws: WebSocket | null = null;
  private messageCallbacks: ((message: any) => void)[] = [];

  connect(userId: string) {
    try {
      this.ws = new WebSocket(`ws://localhost:8080/?userId=${userId}`);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
      };

      this.ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        this.messageCallbacks.forEach((callback) => callback(message));
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        // Attempt to reconnect after 5 seconds
        setTimeout(() => this.connect(userId), 5000);
      };
    } catch (error) {
      console.error('WebSocket connection error:', error);
    }
  }

  sendMessage(message: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected');
    }
  }

  onMessage(callback: (message: any) => void) {
    this.messageCallbacks.push(callback);
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const webSocketService = new WebSocketService();
