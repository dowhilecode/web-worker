// Main thread script
const worker = new Worker('worker.js');

// Elements for Worker version
const workerProgress = document.getElementById('workerProgress');
const workerStatus = document.getElementById('workerStatus');
const workerCounter = document.getElementById('workerCounter');

// Elements for No-Worker version
const noWorkerProgress = document.getElementById('noWorkerProgress');
const noWorkerStatus = document.getElementById('noWorkerStatus');
const noWorkerCounter = document.getElementById('noWorkerCounter');

// Counters for UI responsiveness test
const counters = {
    worker: 0,
    noWorker: 0
};

// Listen for messages from the worker
worker.onmessage = function(e) {
    const { type, data } = e.data;
    //console.log(`Worker Message Received - Type: ${type}`, data);
    
    switch(type) {
        case 'progress':
            workerProgress.value = data;
            workerStatus.textContent = `Processing: ${data}%`;
            break;
        case 'complete':
            workerStatus.textContent = `Processing complete! Processed ${data.pixelsProcessed} pixels in ${data.timeSpent}ms`;
            console.log('Worker Processing Complete:', data);
            break;
        case 'error':
            workerStatus.textContent = `Error: ${data}`;
            console.error('Worker Error:', data);
            break;
    }
};

// Function to start processing with Web Worker
function startProcessing() {
    console.log('Starting processing with Web Worker...');
    workerStatus.textContent = 'Starting processing...';
    workerProgress.value = 0;

    for(let totalImages = 1; totalImages < 21; totalImages++) {
        worker.postMessage({
            command: 'process',
            imageData: {
                width: 3840,
                height: 2160
            }
        });

        console.log(`${totalImages} iterated.`);
    }
}

// Function to simulate processing without Web Worker
function startProcessingNoWorker() {
    console.log('Starting processing without Web Worker...');
    noWorkerStatus.textContent = 'Starting processing...';
    noWorkerProgress.value = 0;
    
    const startTime = Date.now();
    const imageData = {
        width: 3840,
        height: 2160
    };
    
    const totalPixels = imageData.width * imageData.height;
    let processedPixels = 0;
    
    // This will block the main thread
    for(let totalImages = 1; totalImages < 21; totalImages++) {

        for (let y = 0; y < imageData.height; y++) {
            for (let x = 0; x < imageData.width; x++) {
                // Simulate pixel processing
                simulatePixelProcessing();
                processedPixels++;
                
                // Update progress every 100,000 pixels
                if (processedPixels % 100000 === 0) {
                    const progress = Math.floor((processedPixels / totalPixels) * 100);
                    noWorkerProgress.value = progress;
                    noWorkerStatus.textContent = `Processing: ${progress}%`;
                    //console.log(`Main Thread Processing: ${progress}%`);
                }
            }
        }

        console.log(`${totalImages} iterated.`);

    }
    
    const timeSpent = Date.now() - startTime;
    noWorkerStatus.textContent = `Processing complete! Processed ${processedPixels} pixels in ${timeSpent}ms`;
    console.log('Main Thread Processing Complete:', { pixelsProcessed: processedPixels, timeSpent });
}

// Function to simulate complex calculation
function simulatePixelProcessing() {
    const dummy = Math.sin(Math.random() * Math.PI) * Math.cos(Math.random() * Math.PI);
}

// Function to demonstrate UI responsiveness
function performUITask(type) {
    counters[type]++;
    const counterElement = type === 'worker' ? workerCounter : noWorkerCounter;
    counterElement.textContent = `UI Counter: ${counters[type]}`;
    console.log(`UI Counter:`, counters[type]);
}
