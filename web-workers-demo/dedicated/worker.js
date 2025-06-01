// Dedicated worker script
self.onmessage = function(e) {
    if (e.data.command === 'process') {
        processImage(e.data.imageData);
    }
};

function processImage(imageData) {
    const { width, height } = imageData;
    const totalPixels = width * height;
    let processedPixels = 0;
    const startTime = Date.now();

    try {
        // Simulate processing each pixel
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                // Simulate complex pixel manipulation
                simulatePixelProcessing();
                processedPixels++;

                // Update progress every 100,000 pixels
                if (processedPixels % 100000 === 0) {
                    const progress = Math.floor((processedPixels / totalPixels) * 100);
                    self.postMessage({ type: 'progress', data: progress });
                }
            }
        }

        // Send completion message
        self.postMessage({
            type: 'complete',
            data: {
                pixelsProcessed: processedPixels,
                timeSpent: Date.now() - startTime
            }
        });
    } catch (error) {
        self.postMessage({
            type: 'error',
            data: error.message
        });
    }
}

function simulatePixelProcessing() {
    // Simulate complex calculation for each pixel
    // In a real application, this would be actual image processing logic
    const dummy = Math.sin(Math.random() * Math.PI) * Math.cos(Math.random() * Math.PI);
}
