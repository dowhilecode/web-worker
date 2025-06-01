// Weather Widget Application
const WEATHER_API_URL = 'https://api.weatherapi.com/v1/forecast.json?key=YOUR_API_KEY&q=London&days=5';
const MOCK_API_URL = 'https://dummyjson.com/posts/1'; // We'll use this for demo purposes

// DOM Elements - Worker Version
const workerWeather = document.getElementById('worker-weather');
const workerForecast = document.getElementById('worker-forecast');
const workerStatus = document.getElementById('worker-status');
const workerLastUpdated = document.getElementById('worker-last-updated');
const workerOfflineMessage = document.getElementById('worker-offline-message');

// DOM Elements - No Worker Version
const noworkerWeather = document.getElementById('noworker-weather');
const noworkerForecast = document.getElementById('noworker-forecast');
const noworkerStatus = document.getElementById('noworker-status');
const noworkerLastUpdated = document.getElementById('noworker-last-updated');
const noworkerOfflineMessage = document.getElementById('noworker-offline-message');

// Sample weather data for demo
const sampleWeather = {
    current: {
        temp_c: 22,
        condition: {
            text: 'Partly cloudy',
            icon: '//cdn.weatherapi.com/weather/64x64/day/116.png'
        },
        wind_kph: 15,
        humidity: 65,
        feelslike_c: 23
    },
    forecast: {
        forecastday: [
            { date: '2025-06-01', day: { maxtemp_c: 23, mintemp_c: 15 } },
            { date: '2025-06-02', day: { maxtemp_c: 25, mintemp_c: 16 } },
            { date: '2025-06-03', day: { maxtemp_c: 24, mintemp_c: 14 } },
            { date: '2025-06-04', day: { maxtemp_c: 22, mintemp_c: 13 } },
            { date: '2025-06-05', day: { maxtemp_c: 21, mintemp_c: 12 } }
        ]
    }
};

// Register Service Worker
async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register('service-worker.js');
            console.log('Weather Widget Service Worker registered:', registration);
            return true;
        } catch (error) {
            console.error('Service Worker registration failed:', error);
            return false;
        }
    }
    return false;
}

// Fetch weather with Service Worker
async function fetchWeatherWithWorker() {
    const startTime = performance.now();
    
    try {
        const response = await fetch(MOCK_API_URL);
        // In real app, we'd use the actual weather data
        // For demo, we'll use our sample data
        renderWeather(workerWeather, workerForecast, sampleWeather);
        updateLastUpdated(workerLastUpdated);
    } catch (error) {
        console.error('Failed to fetch weather:', error);
        // Service Worker should provide cached data
        renderWeather(workerWeather, workerForecast, sampleWeather);
    }
    
    const loadTime = Math.round(performance.now() - startTime);
    updateWorkerStatus(loadTime);
}

// Fetch weather without Service Worker
async function fetchWeatherWithoutWorker() {
    const startTime = performance.now();
    
    try {
        const response = await fetch(MOCK_API_URL);
        // For demo, use sample data
        renderWeather(noworkerWeather, noworkerForecast, sampleWeather);
        updateLastUpdated(noworkerLastUpdated);
    } catch (error) {
        console.error('Failed to fetch weather:', error);
        noworkerWeather.innerHTML = '<div class="error">Unable to load weather data</div>';
        noworkerForecast.innerHTML = '';
    }
    
    const loadTime = Math.round(performance.now() - startTime);
    updateNoWorkerStatus(loadTime);
}

// Render weather data
function renderWeather(weatherContainer, forecastContainer, data) {
    // Render current weather
    weatherContainer.innerHTML = `
        <div class="temperature">${data.current.temp_c}°C</div>
        <div class="condition">${data.current.condition.text}</div>
        <div class="details">
            <div class="detail-item">
                Feels like: ${data.current.feelslike_c}°C
            </div>
            <div class="detail-item">
                Wind: ${data.current.wind_kph} km/h
            </div>
            <div class="detail-item">
                Humidity: ${data.current.humidity}%
            </div>
        </div>
    `;
    
    // Render forecast
    forecastContainer.innerHTML = data.forecast.forecastday
        .map(day => `
            <div class="forecast-day">
                <div>${formatDate(day.date)}</div>
                <div>${day.day.maxtemp_c}°C</div>
                <div>${day.day.mintemp_c}°C</div>
            </div>
        `).join('');
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
}

// Update last updated timestamp
function updateLastUpdated(element) {
    const now = new Date();
    element.textContent = `Last updated: ${now.toLocaleTimeString()}`;
}

// Update worker status
function updateWorkerStatus(loadTime) {
    const cacheStatus = navigator.serviceWorker.controller ? 'Cached' : 'Not cached';
    workerStatus.innerHTML = `
        Loading time: ${loadTime}ms<br>
        Cache status: ${cacheStatus}<br>
        Network status: ${navigator.onLine ? 'Online' : 'Offline'}
    `;
}

// Update no-worker status
function updateNoWorkerStatus(loadTime) {
    noworkerStatus.innerHTML = `
        Loading time: ${loadTime}ms<br>
        Cache status: Browser cache only<br>
        Network status: ${navigator.onLine ? 'Online' : 'Offline'}
    `;
}

// Refresh weather data
function refreshWeather() {
    fetchWeatherWithWorker();
    fetchWeatherWithoutWorker();
}

// Toggle online/offline status
function toggleConnection() {
    const event = new Event(navigator.onLine ? 'offline' : 'online');
    window.dispatchEvent(event);
}

// Clear all caches
async function clearAllCaches() {
    if ('caches' in window) {
        try {
            const cacheNames = await caches.keys();
            await Promise.all(cacheNames.map(name => caches.delete(name)));
            console.log('All caches cleared');
            alert('All caches cleared. Refresh to see the effect.');
        } catch (error) {
            console.error('Error clearing caches:', error);
        }
    }
}

// Handle online/offline status
function updateOnlineStatus() {
    if (navigator.onLine) {
        workerOfflineMessage.style.display = 'none';
        noworkerOfflineMessage.style.display = 'none';
    } else {
        workerOfflineMessage.style.display = 'block';
        noworkerOfflineMessage.style.display = 'block';
    }
    refreshWeather();
}

// Event listeners
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

// Initialize
async function init() {
    const hasServiceWorker = await registerServiceWorker();
    console.log('Service Worker support:', hasServiceWorker ? 'Yes' : 'No');
    refreshWeather();
}

init();
