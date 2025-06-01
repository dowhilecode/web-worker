# Service Worker Demo - Offline-Capable News App

This demo showcases the capabilities of Service Workers by implementing a news application with offline support, caching, and push notifications.

## What This Demo Shows

The demo provides a side-by-side comparison of a news application with and without a Service Worker:

1. **With Service Worker (Left Side - Green)**
   - Offline content access
   - Fast loading from cache
   - Push notification support
   - Background sync capabilities

2. **Without Service Worker (Right Side - Red)**
   - Network-dependent content
   - No offline support
   - Standard browser caching only
   - No push notifications

## Files in this Demo

- `index.html` - The main HTML file with the news interface
- `app.js` - Main thread JavaScript that handles the application logic
- `service-worker.js` - The Service Worker script for offline support and caching

## How to Run

1. Start the server from the root directory:
   ```powershell
   node server.js
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3000/service
   ```

## How to Test

1. **With Service Worker (Left Side)**:
   - Load the page normally
   - Enable push notifications
   - Toggle offline mode
   - Reload to see cached content
   - Clear cache and observe behavior

2. **Without Service Worker (Right Side)**:
   - Observe standard network requests
   - Test offline behavior
   - Notice lack of push notifications
   - Compare loading times

3. **Testing Controls**:
   - Use "Toggle Online/Offline" button
   - Try "Clear All Caches" button
   - Click "Reload Page" to test caching

## Key Points to Observe

1. **Offline Capabilities**:
   - Content availability without network
   - Cache management
   - Update mechanisms

2. **Performance**:
   - Loading times comparison
   - Network request handling
   - Resource management

3. **Features**:
   - Push notification support
   - Cache strategies
   - Network status handling

4. **Developer Tools**:
   - Network tab behavior
   - Cache storage content
   - Service Worker status

This demo illustrates why Service Workers are essential for creating reliable, offline-capable web applications with modern features like push notifications.
