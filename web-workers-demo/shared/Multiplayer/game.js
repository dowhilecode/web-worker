// Main game script
const playerId = Math.floor(Math.random() * 1000000);
let sharedWorker;

// Shared Worker Elements
const workerTimer = document.getElementById('worker-timer');
const workerProblem = document.getElementById('worker-problem');
const workerAnswer = document.getElementById('worker-answer');
const workerPlayerCount = document.getElementById('worker-player-count');
const workerScores = document.getElementById('worker-scores');
const workerStatus = document.getElementById('worker-status');

// LocalStorage Elements
const noworkerTimer = document.getElementById('noworker-timer');
const noworkerProblem = document.getElementById('noworker-problem');
const noworkerAnswer = document.getElementById('noworker-answer');
const noworkerPlayerCount = document.getElementById('noworker-player-count');
const noworkerScores = document.getElementById('noworker-scores');
const noworkerStatus = document.getElementById('noworker-status');

// LocalStorage keys
const LS_GAME_STATE = 'mathGame_state';
const LS_PLAYERS = 'mathGame_players';
const LS_LAST_UPDATE = 'mathGame_lastUpdate';

// Initialize Shared Worker
function initSharedWorker() {
    try {
        sharedWorker = new SharedWorker('worker.js');
        console.log('Shared Worker initialized');
        
        sharedWorker.port.onmessage = function(e) {
            const message = e.data;
            
            switch(message.type) {
                case 'gameState':
                    updateWorkerGameState(message.data);
                    break;
                case 'playerCount':
                    workerPlayerCount.textContent = message.data;
                    break;
                case 'correctAnswer':
                    handleWorkerCorrectAnswer(message.data);
                    break;
            }
        };
        
        sharedWorker.port.start();
    } catch (error) {
        console.error('Shared Worker initialization failed:', error);
        workerStatus.textContent = 'Error: Shared Worker not supported';
    }
}

// Initialize LocalStorage game
function initLocalStorageGame() {
    // Register this window
    const players = JSON.parse(localStorage.getItem(LS_PLAYERS) || '[]');
    if (!players.includes(playerId)) {
        players.push(playerId);
        localStorage.setItem(LS_PLAYERS, JSON.stringify(players));
    }
    
    // Setup storage event listener
    window.addEventListener('storage', handleStorageEvent);
    
    // Setup cleanup
    window.addEventListener('beforeunload', () => {
        const players = JSON.parse(localStorage.getItem(LS_PLAYERS) || '[]');
        localStorage.setItem(LS_PLAYERS, 
            JSON.stringify(players.filter(id => id !== playerId)));
    });
    
    // Start checking for updates
    setInterval(checkLocalStorageUpdates, 1000);
    updateNoWorkerPlayerCount();
}

// Update worker game state
function updateWorkerGameState(state) {
    workerTimer.textContent = `Time: ${state.timer}s`;
    workerProblem.textContent = state.problem || 'Waiting for new game...';
    updateWorkerScores(state.scores);
    
    if (!state.isActive) {
        workerStatus.textContent = 'Game Over! Click New Game to start again.';
    }
}

// Update local storage game state
function updateNoWorkerGameState(state) {
    noworkerTimer.textContent = `Time: ${state.timer}s`;
    noworkerProblem.textContent = state.problem || 'Waiting for new game...';
    updateNoWorkerScores(state.scores);
    
    if (!state.isActive) {
        noworkerStatus.textContent = 'Game Over! Click New Game to start again.';
    }
}

// Handle worker correct answer
function handleWorkerCorrectAnswer(data) {
    const { playerId: winnerId, gameState } = data;
    workerStatus.textContent = `Player ${winnerId} got it right!`;
    updateWorkerGameState(gameState);
}

// Update worker scores display
function updateWorkerScores(scores) {
    if (!scores || Object.keys(scores).length === 0) {
        workerScores.textContent = 'No scores yet';
        return;
    }
    
    workerScores.innerHTML = Object.entries(scores)
        .map(([id, score]) => `Player ${id}: ${score}`)
        .join('<br>');
}

// Update no-worker scores display
function updateNoWorkerScores(scores) {
    if (!scores || Object.keys(scores).length === 0) {
        noworkerScores.textContent = 'No scores yet';
        return;
    }
    
    noworkerScores.innerHTML = Object.entries(scores)
        .map(([id, score]) => `Player ${id}: ${score}`)
        .join('<br>');
}

// Start worker game
function startWorkerGame() {
    if (sharedWorker) {
        sharedWorker.port.postMessage({ type: 'startGame' });
    }
}

// Start no-worker game
function startNoWorkerGame() {
    const gameState = {
        isActive: true,
        problem: generateProblem(),
        timer: 60,
        scores: {},
        lastUpdateTime: Date.now()
    };
    
    localStorage.setItem(LS_GAME_STATE, JSON.stringify(gameState));
    localStorage.setItem(LS_LAST_UPDATE, Date.now().toString());
    updateNoWorkerGameState(gameState);
}

// Generate problem for no-worker game
function generateProblem() {
    const num1 = Math.floor(Math.random() * 20) + 1;
    const num2 = Math.floor(Math.random() * 20) + 1;
    const operators = ['+', '-', '*'];
    const operator = operators[Math.floor(Math.random() * operators.length)];
    
    return `${num1} ${operator} ${num2} = ?`;
}

// Handle storage events for no-worker game
function handleStorageEvent(e) {
    if (e.key === LS_GAME_STATE) {
        const gameState = JSON.parse(e.newValue);
        updateNoWorkerGameState(gameState);
    } else if (e.key === LS_PLAYERS) {
        updateNoWorkerPlayerCount();
    }
}

// Check for local storage updates
function checkLocalStorageUpdates() {
    const lastUpdate = parseInt(localStorage.getItem(LS_LAST_UPDATE) || '0');
    const gameState = JSON.parse(localStorage.getItem(LS_GAME_STATE) || 'null');
    
    if (gameState && gameState.isActive) {
        gameState.timer = Math.max(0, gameState.timer - 
            Math.floor((Date.now() - lastUpdate) / 1000));
            
        if (gameState.timer <= 0) {
            gameState.isActive = false;
        }
        
        localStorage.setItem(LS_GAME_STATE, JSON.stringify(gameState));
        localStorage.setItem(LS_LAST_UPDATE, Date.now().toString());
        updateNoWorkerGameState(gameState);
    }
}

// Update no-worker player count
function updateNoWorkerPlayerCount() {
    const players = JSON.parse(localStorage.getItem(LS_PLAYERS) || '[]');
    noworkerPlayerCount.textContent = players.length;
}

// Handle worker answer input
workerAnswer.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const answer = parseInt(workerAnswer.value);
        if (!isNaN(answer)) {
            // send the meessage to the shared worker
            sharedWorker.port.postMessage({
                type: 'answer',
                answer: answer,
                playerId: playerId
            });
            console.log(`Worker Answer Submitted: ${answer}`);
            workerAnswer.value = '';
        }
    }
});

// Handle no-worker answer input
noworkerAnswer.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const answer = parseInt(noworkerAnswer.value);
        if (!isNaN(answer)) {
            // Handle answer checking locally
            const gameState = JSON.parse(localStorage.getItem(LS_GAME_STATE) || 'null');
            if (gameState && gameState.isActive) {
                // In a real implementation, you'd need to handle answer validation
                noworkerStatus.textContent = 'Answer submitted!';
                console.log(`Non-Worker Answer Submitted: ${answer}`);
                noworkerAnswer.value = '';
            }
        }
    }
});

// Open new window
function openNewWindow() {
    window.open(location.href, '_blank');
}

// Initialize
initSharedWorker();
initLocalStorageGame();
