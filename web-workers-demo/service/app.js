// Main application script
const workerArticles = document.getElementById('worker-articles');
const noWorkerArticles = document.getElementById('no-worker-articles');
const workerOfflineMessage = document.getElementById('worker-offline-message');
const noWorkerOfflineMessage = document.getElementById('no-worker-offline-message');
const notificationButton = document.getElementById('worker-notification-button');
const workerStatus = document.getElementById('worker-status');
const noWorkerStatus = document.getElementById('no-worker-status');
const DUMMY_POST_URL = 'https://dummyjson.com/posts?limit=3&skip=10&select=title,body';
// Sample news articles
const sampleArticles = {
    posts: [
        {
            id: 1,
            title: 'Understanding Service Workers',
            body: 'Service Workers provide powerful offline capabilities...'
        },
        {
            id: 2,
            title: 'The Future of Progressive Web Apps',
            body: 'Progressive Web Apps are changing how we build applications...'
        },
        {
            id: 3,
            title: 'Web Development Trends 2025',
            body: 'New technologies are shaping the future of web development...'
        }
    ]
};

// Register Service Worker
async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register('service-worker.js');
            console.log('Service Worker registered:', registration);
            initializePushNotifications(registration);
            return true;
        } catch (error) {
            console.error('Service Worker registration failed:', error);
            return false;
        }
    }
    return false;
}

// Initialize Push Notifications
async function initializePushNotifications(registration) {
    if ('Notification' in window) {
        notificationButton.addEventListener('click', async () => {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                notificationButton.textContent = 'Push Notifications Enabled';
                notificationButton.disabled = true;
                
                try {
                    const subscription = await registration.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: urlBase64ToUint8Array(
                            'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U'
                        )
                    });
                    console.log('Push notification subscription:', subscription);
                } catch (error) {
                    console.error('Push notification subscription failed:', error);
                }
            }
        });
    }
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

// Display articles with Service Worker
async function displayArticlesWithWorker() {
    const startTime = performance.now();
    
    try {
        // First try to fetch from network
        const response = await fetch(DUMMY_POST_URL);
        
        const articles = await response.json();
        console.log('Network fetch successful', articles);
        renderArticles(workerArticles, articles);
    } catch (error) {
        // If network fails, display cached articles
        console.log('Network fetch failed, using cached content');
        renderArticles(workerArticles, sampleArticles);
    }
    
    const loadTime = Math.round(performance.now() - startTime);
    updateWorkerStatus(loadTime);
}

// Display articles without Service Worker
async function displayArticlesWithoutWorker() {
    const startTime = performance.now();
    
    try {
        // Direct network request
        const response = await fetch(DUMMY_POST_URL);
        const articles = await response.json();
        renderArticles(noWorkerArticles, articles);
    } catch (error) {
        // If network fails, show error
        console.error('Failed to fetch articles:', error);
        noWorkerArticles.innerHTML = '<div class="article">Unable to load content. Please check your connection.</div>';
    }
    
    const loadTime = Math.round(performance.now() - startTime);
    updateNoWorkerStatus(loadTime);
}

// Render articles
function renderArticles(container, articles) {
    if(articles.length !== 0) {
    container.innerHTML = articles.posts.map(article => `
        <div class="article">
            <h3>${article.title}</h3>
            <p>${article.body}</p>
        </div>
    `).join('');
    }
}

// Update status for worker version
function updateWorkerStatus(loadTime) {
    const cacheStatus = navigator.serviceWorker.controller ? 'Cached' : 'Not cached';
    workerStatus.innerHTML = `
        Loading time: ${loadTime}ms<br>
        Cache status: ${cacheStatus}<br>
        Network status: ${navigator.onLine ? 'Online' : 'Offline'}
    `;
}

// Update status for no-worker version
function updateNoWorkerStatus(loadTime) {
    noWorkerStatus.innerHTML = `
        Loading time: ${loadTime}ms<br>
        Cache status: Browser cache only<br>
        Network status: ${navigator.onLine ? 'Online' : 'Offline'}
    `;
}

// Toggle online/offline status
function toggleConnection() {
    // This is a simulation - in real world, you'd test with browser dev tools
    
    const event = new Event(navigator.onLine ? 'offline' : 'online');
    console.log('current network status: ', navigator.onLine, event);
    window.dispatchEvent(event);
}

// Clear all caches
async function clearAllCaches() {
    if ('caches' in window) {
        try {
            const cacheNames = await caches.keys();
            await Promise.all(cacheNames.map(name => caches.delete(name)));
            console.log('All caches cleared');
            alert('All caches cleared. Reload the page to see the effect.');
        } catch (error) {
            console.error('Error clearing caches:', error);
        }
    }
}

// Reload page
function reloadPage() {
    location.reload();
}

// Handle offline/online status
function updateOnlineStatus() {
    if (navigator.onLine) {
        workerOfflineMessage.style.display = 'none';
        noWorkerOfflineMessage.style.display = 'none';
    } else {
        workerOfflineMessage.style.display = 'block';
        noWorkerOfflineMessage.style.display = 'block';
    }
    displayArticlesWithWorker();
    displayArticlesWithoutWorker();
}

// Event listeners
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

// Initialize the application
async function init() {
    const hasServiceWorker = await registerServiceWorker();
    console.log('Service Worker support:', hasServiceWorker ? 'Yes' : 'No');
    
    // Initial display
    displayArticlesWithWorker();
    displayArticlesWithoutWorker();
    updateOnlineStatus();
}

init();
