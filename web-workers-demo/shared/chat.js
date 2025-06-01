// Chat application main script
let sharedWorker;
const userId = Math.floor(Math.random() * 1000000);
const STORAGE_KEY = 'chat_messages';
let lastStorageCheck = Date.now();

// Worker elements
const workerChatBox = document.getElementById('workerChatBox');
const workerMessageInput = document.getElementById('workerMessageInput');
const workerStats = document.getElementById('workerStats');

// No-worker elements
const noWorkerChatBox = document.getElementById('noWorkerChatBox');
const noWorkerMessageInput = document.getElementById('noWorkerMessageInput');
const noWorkerStats = document.getElementById('noWorkerStats');

// Initialize shared worker
function initSharedWorker() {
    try {
        sharedWorker = new SharedWorker('worker.js');
        console.log('Shared Worker initialized');
        
        sharedWorker.port.onmessage = function(e) {
            const message = e.data;
            const startTime = message.timestamp;
            const deliveryTime = Date.now() - startTime;
            
            displayWorkerMessage(message);
            updateWorkerStats(message.connectedPorts, deliveryTime);
            console.log('Worker Message Delivery Time:', deliveryTime + 'ms');
        };
        
        sharedWorker.port.start();
        
        sharedWorker.port.postMessage({
            type: 'connect',
            userId: userId,
            timestamp: Date.now()
        });
    } catch (error) {
        console.error('Shared Worker initialization failed:', error);
        workerChatBox.innerHTML = '<div class="system">Error: Shared Worker not supported</div>';
    }
}

// Initialize localStorage-based chat
function initLocalStorageChat() {
    window.addEventListener('storage', handleStorageEvent);
    updateNoWorkerStats();
    setInterval(checkNewMessages, 1000);
    console.log('LocalStorage chat initialized');
    
    // Register window
    const windows = JSON.parse(localStorage.getItem('active_windows') || '[]');
    windows.push(userId);
    localStorage.setItem('active_windows', JSON.stringify(windows));
    
    // Cleanup on window close
    window.addEventListener('beforeunload', () => {
        const windows = JSON.parse(localStorage.getItem('active_windows') || '[]');
        localStorage.setItem('active_windows', 
            JSON.stringify(windows.filter(id => id !== userId)));
    });
}

// Display message in worker chat
function displayWorkerMessage(message) {
    const messageElement = document.createElement('div');
    if (message.type === 'system') {
        messageElement.className = 'message system';
        messageElement.textContent = message.data;
    } else {
        messageElement.className = 'message';
        const sender = message.senderId === userId ? 'You' : `User ${message.senderId}`;
        messageElement.textContent = `${sender}: ${message.data}`;
    }
    workerChatBox.appendChild(messageElement);
    workerChatBox.scrollTop = workerChatBox.scrollHeight;
}

// Display message in no-worker chat
function displayNoWorkerMessage(message) {
    const messageElement = document.createElement('div');
    if (message.type === 'system') {
        messageElement.className = 'message system';
        messageElement.textContent = message.data;
    } else {
        messageElement.className = 'message';
        const sender = message.senderId === userId ? 'You' : `User ${message.senderId}`;
        messageElement.textContent = `${sender}: ${message.data}`;
    }
    noWorkerChatBox.appendChild(messageElement);
    noWorkerChatBox.scrollTop = noWorkerChatBox.scrollHeight;
}

// Send message using worker
function sendWorkerMessage() {
    const text = workerMessageInput.value.trim();
    if (text) {
        sharedWorker.port.postMessage({
            type: 'message',
            data: text,
            userId: userId,
            timestamp: Date.now()
        });
        workerMessageInput.value = '';
    }
}

// Send message using localStorage
function sendNoWorkerMessage() {
    const text = noWorkerMessageInput.value.trim();
    if (text) {
        const message = {
            type: 'message',
            data: text,
            senderId: userId,
            timestamp: Date.now()
        };
        
        const messages = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        messages.push(message);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
        
        displayNoWorkerMessage(message);
        noWorkerMessageInput.value = '';
    }
}

// Handle storage events for no-worker chat
function handleStorageEvent(e) {
    if (e.key === STORAGE_KEY) {
        const messages = JSON.parse(e.newValue || '[]');
        const newMessages = messages.filter(m => m.timestamp > lastStorageCheck);
        
        newMessages.forEach(message => {
            const deliveryTime = Date.now() - message.timestamp;
            console.log('LocalStorage Message Delivery Time:', deliveryTime + 'ms');
            displayNoWorkerMessage(message);
        });
        
        if (newMessages.length > 0) {
            lastStorageCheck = newMessages[newMessages.length - 1].timestamp;
            updateNoWorkerStats(newMessages[newMessages.length - 1].timestamp);
        }
    } else if (e.key === 'active_windows') {
        updateNoWorkerStats();
    }
}

// Check for new messages (no-worker)
function checkNewMessages() {
    const messages = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const newMessages = messages.filter(m => m.timestamp > lastStorageCheck);
    
    newMessages.forEach(message => {
        if (message.senderId !== userId) {
            const deliveryTime = Date.now() - message.timestamp;
            console.log('LocalStorage Message Delivery Time:', deliveryTime + 'ms');
            displayNoWorkerMessage(message);
        }
    });
    
    if (newMessages.length > 0) {
        lastStorageCheck = newMessages[newMessages.length - 1].timestamp;
        updateNoWorkerStats(newMessages[newMessages.length - 1].timestamp);
    }
}

// Update worker stats
function updateWorkerStats(connectedPorts, deliveryTime) {
    workerStats.innerHTML = `
        Connected Windows: ${connectedPorts}
        <br>
        Message Delivery Time: ${deliveryTime}ms
    `;
}

// Update no-worker stats
function updateNoWorkerStats(timestamp) {
    const windows = JSON.parse(localStorage.getItem('active_windows') || '[]');
    const deliveryTime = timestamp ? Date.now() - timestamp : '--';
    
    noWorkerStats.innerHTML = `
        Active Windows: ${windows.length}
        <br>
        Message Delivery Time: ${deliveryTime === '--' ? '--' : deliveryTime + 'ms'}
    `;
}

// Open new window
function openNewWindow() {
    window.open(location.href, '_blank');
}

// Handle Enter key in message inputs
workerMessageInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') sendWorkerMessage();
});

noWorkerMessageInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') sendNoWorkerMessage();
});

// Initialize both chat systems
initSharedWorker();
initLocalStorageChat();
