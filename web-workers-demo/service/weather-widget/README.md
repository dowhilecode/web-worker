# Weather Widget - Service Worker Demo

This demo showcases a weather widget implementation comparing the behavior with and without a Service Worker, demonstrating offline capabilities and caching strategies.

## What This Demo Shows

The demo provides a side-by-side comparison of weather data handling:

1. **With Service Worker (Left Side - Green)**
   - Offline data access
   - Fast loading from cache
   - Smooth offline-online transitions
   - Background sync capabilities

2. **Without Service Worker (Right Side - Red)**
   - Network-dependent updates
   - No offline support
   - Standard browser caching only
   - Fails when offline

## Features

- Current weather display
- 5-day forecast
- Detailed weather metrics
- Online/Offline indicators
- Cache management
- Performance metrics

## Files in this Demo

- `index.html` - The main weather widget interface
- `weather-app.js` - Main application logic
- `service-worker.js` - Service Worker for offline support
- `offline.json` - Fallback data for offline mode

## How to Run

1. Start the server from the root directory:
   ```powershell
   node server.js
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3000/service/weather-widget
   ```

## How to Test

1. **With Service Worker (Left Side)**:
   - Load the page normally
   - Toggle offline mode
   - Refresh to see cached data
   - Clear cache and observe behavior
   - Check loading times

2. **Without Service Worker (Right Side)**:
   - Observe standard loading
   - Test offline behavior
   - Compare loading times
   - Notice lack of offline support

3. **Testing Controls**:
   - Use "Refresh Weather" to update data
   - Try "Toggle Online/Offline" to simulate connection changes
   - Use "Clear Cache" to reset cached data

## Key Points to Observe

1. **Offline Capability**:
   - Data availability without network
   - Cache management
   - Offline indicators

2. **Performance**:
   - Loading time comparison
   - Cache hit/miss behavior
   - Resource management

3. **User Experience**:
   - Smooth offline transitions
   - Update indicators
   - Error handling

This demo illustrates why Service Workers are essential for creating reliable, offline-capable web applications, particularly for weather apps where users might need information in areas with poor connectivity.
