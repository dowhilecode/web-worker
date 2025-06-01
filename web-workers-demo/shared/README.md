# Shared Web Worker Demo - Multi-Window Chat

This demo illustrates the power of Shared Web Workers by implementing a real-time chat application that works across multiple browser windows.

## What This Demo Shows

The demo provides a side-by-side comparison of multi-window communication implemented with and without a Shared Worker:

1. **With Shared Worker (Left Side - Green)**
   - Real-time communication between windows
   - Direct message passing
   - Instant updates
   - Efficient connection management

2. **Without Shared Worker (Right Side - Red)**
   - LocalStorage-based communication
   - Polling mechanism
   - Delayed updates
   - Higher resource usage

## Files in this Demo

- `index.html` - The main HTML file with the chat interface
- `chat.js` - Main thread JavaScript that handles both communication methods
- `worker.js` - The Shared Worker script that manages inter-window communication

## How to Run

1. Start the server from the root directory:
   ```powershell
   node server.js
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3000/shared
   ```

## How to Test

1. **With Shared Worker (Left Side)**:
   - Open multiple browser windows
   - Type messages in different windows
   - Observe real-time message delivery
   - Check connection count and delivery times

2. **Without Shared Worker (Right Side)**:
   - Send messages between windows
   - Observe polling-based updates
   - Notice slightly delayed message delivery
   - Monitor active window count

3. **Developer Tools**:
   - Open browser's Developer Tools (F12)
   - Check Console for message delivery metrics
   - Monitor network and storage activity

## Key Points to Observe

1. **Communication Performance**:
   - Message delivery times
   - Update frequency
   - Resource utilization

2. **Scalability**:
   - Multiple window management
   - Connection handling
   - Memory usage

3. **User Experience**:
   - Real-time vs. polling updates
   - Message ordering
   - System notifications

This demo demonstrates why Shared Workers are valuable for coordinating communication between multiple browser contexts efficiently.
