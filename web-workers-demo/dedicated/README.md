# Dedicated Web Worker Demo - Image Processing

This demo showcases the performance benefits of using Dedicated Web Workers for CPU-intensive tasks by implementing a simulated image processing application.

## What This Demo Shows

The demo provides a side-by-side comparison of image processing performed with and without a Web Worker:

1. **With Web Worker (Left Side - Green)**
   - Processing runs in a background thread
   - UI remains responsive
   - Progress updates are smooth
   - Counter button works during processing

2. **Without Web Worker (Right Side - Red)**
   - Processing runs on the main thread
   - UI becomes frozen during processing
   - Progress updates are chunked
   - Counter button is unresponsive during processing

## Files in this Demo

- `index.html` - The main HTML file with the UI components
- `main.js` - Main thread JavaScript that handles UI and Web Worker communication
- `worker.js` - The Web Worker script that performs the image processing simulation

## How to Run

1. Start the server from the root directory:
   ```powershell
   node server.js
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3000/dedicated
   ```

## How to Test

1. **With Web Worker (Left Side)**:
   - Click "Start Processing"
   - While processing, click "Test UI Responsiveness"
   - Notice smooth progress updates and responsive counter

2. **Without Web Worker (Right Side)**:
   - Click "Start Processing"
   - Try clicking "Test UI Responsiveness"
   - Notice frozen UI and delayed progress updates

3. **Developer Tools**:
   - Open browser's Developer Tools (F12)
   - Check Console for performance metrics
   - Compare processing times and UI responsiveness

## Key Points to Observe

1. **Performance**:
   - Processing time comparison
   - UI responsiveness differences
   - Progress update behavior

2. **Resource Usage**:
   - CPU utilization
   - Main thread blocking
   - Background thread execution

3. **User Experience**:
   - Smooth vs. jerky updates
   - Interactive vs. frozen UI
   - Overall responsiveness

This demo clearly illustrates why Web Workers are essential for maintaining a responsive user interface while performing CPU-intensive tasks.
