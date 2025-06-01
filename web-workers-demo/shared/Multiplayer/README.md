# Multiplayer Math Game - Shared Worker Demo

This demo showcases a real-time multiplayer math game implemented with and without a Shared Worker to demonstrate the benefits of shared state and real-time communication between browser windows.

## What This Demo Shows

The demo provides a side-by-side comparison of two identical math games:

1. **With Shared Worker (Left Side - Green)**
   - Real-time synchronization
   - Instant score updates
   - Accurate game timer
   - Efficient player management

2. **Without Shared Worker (Right Side - Red)**
   - LocalStorage-based synchronization
   - Polling for updates
   - Less accurate timer
   - Higher resource usage

## Features

- Real-time math problems
- Multiplayer scoring system
- Game timer
- Player count tracking
- Instant feedback on answers

## Files in this Demo

- `index.html` - The main game interface
- `game.js` - Main thread JavaScript handling both implementations
- `worker.js` - The Shared Worker script for real-time gameplay

## How to Run

1. Start the server from the root directory:
   ```powershell
   node server.js
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3000/shared/Multiplayer
   ```

## How to Test

1. **With Shared Worker (Left Side)**:
   - Open multiple windows
   - Start a new game
   - Submit answers in different windows
   - Observe real-time updates
   - Watch the synchronized timer

2. **Without Shared Worker (Right Side)**:
   - Test the same features
   - Notice the slight delays
   - Observe polling-based updates
   - Compare timer accuracy

3. **Things to Compare**:
   - Response time for answers
   - Score update speed
   - Timer synchronization
   - Player count accuracy

## Key Points to Observe

1. **Performance**:
   - Answer response time
   - State synchronization speed
   - Resource usage

2. **Accuracy**:
   - Timer synchronization
   - Score updates
   - Player counting

3. **User Experience**:
   - Real-time vs polling updates
   - Gameplay smoothness
   - Multi-window coordination

This demo clearly shows why Shared Workers are valuable for real-time multiplayer web applications.
