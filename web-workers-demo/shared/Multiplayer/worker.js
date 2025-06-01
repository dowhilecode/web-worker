// Shared Worker for Math Game
const connections = new Set();
let gameState = {
    isActive: false,
    problem: null,
    answer: null,
    timer: 60,
    scores: {},
    lastUpdateTime: Date.now()
};

// Game loop interval
let gameInterval = null;

// Generate a random math problem
function generateProblem() {
    const num1 = Math.floor(Math.random() * 20) + 1;
    const num2 = Math.floor(Math.random() * 20) + 1;
    const operators = ['+', '-', '*'];
    const operator = operators[Math.floor(Math.random() * operators.length)];
    
    let answer;
    switch(operator) {
        case '+': answer = num1 + num2; break;
        case '-': answer = num1 - num2; break;
        case '*': answer = num1 * num2; break;
    }
    
    return {
        problem: `${num1} ${operator} ${num2} = ?`,
        answer: answer
    };
}

// Broadcast game state to all connections
function broadcast(data) {
    connections.forEach(port => {
        try {
            port.postMessage(data);
        } catch (error) {
            console.error('Error sending message to port:', error);
            connections.delete(port);
        }
    });
}

// Start a new game
function startNewGame() {
    const problem = generateProblem();
    gameState = {
        isActive: true,
        problem: problem.problem,
        answer: problem.answer,
        timer: 60,
        scores: gameState.scores,
        lastUpdateTime: Date.now()
    };
    
    clearInterval(gameInterval);
    gameInterval = setInterval(updateGame, 1000);
    
    broadcast({
        type: 'gameState',
        data: gameState
    });
}

// Update game state
function updateGame() {
    if (gameState.isActive) {
        gameState.timer--;
        
        if (gameState.timer <= 0) {
            gameState.isActive = false;
            clearInterval(gameInterval);
        }
        
        broadcast({
            type: 'gameState',
            data: gameState
        });
    }
}

// Handle connections from different windows
self.onconnect = function(e) {
    const port = e.ports[0];
    connections.add(port);
    
    // Send initial game state
    port.postMessage({
        type: 'gameState',
        data: gameState
    });
    
    // Update player count
    broadcast({
        type: 'playerCount',
        data: connections.size
    });
    
    port.start();
    
    // Handle messages from this connection
    port.onmessage = function(e) {
        const message = e.data;
        
        switch(message.type) {
            case 'startGame':
                startNewGame();
                break;
                
            case 'answer':
                if (gameState.isActive && message.answer === gameState.answer) {
                    // Update score
                    gameState.scores[message.playerId] = 
                        (gameState.scores[message.playerId] || 0) + 1;
                    
                    // Generate new problem
                    const problem = generateProblem();
                    gameState.problem = problem.problem;
                    gameState.answer = problem.answer;
                    
                    // Broadcast updated state
                    broadcast({
                        type: 'correctAnswer',
                        data: {
                            playerId: message.playerId,
                            gameState: gameState
                        }
                    });
                }
                break;
        }
    };
    
    // Handle disconnection
    port.onmessageerror = function() {
        connections.delete(port);
        broadcast({
            type: 'playerCount',
            data: connections.size
        });
    };
};
