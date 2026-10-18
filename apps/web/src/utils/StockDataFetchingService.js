class CircuitBreaker {
  constructor(failureThreshold = 3, resetTimeout = 30000) {
    this.failureThreshold = failureThreshold;
    this.resetTimeout = resetTimeout;
    this.failures = 0;
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    this.nextAttempt = null;
  }

  recordFailure() {
    this.failures += 1;
    if (this.failures >= this.failureThreshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.resetTimeout;
      console.warn(`[CircuitBreaker] Opened. Reset in ${this.resetTimeout}ms`);
    }
  }

  recordSuccess() {
    this.failures = 0;
    this.state = 'CLOSED';
  }

  canAttempt() {
    if (this.state === 'CLOSED') return true;
    if (this.state === 'OPEN') {
      if (Date.now() >= this.nextAttempt) {
        this.state = 'HALF_OPEN';
        return true;
      }
      return false;
    }
    return this.state === 'HALF_OPEN';
  }
}

const circuitBreaker = new CircuitBreaker();

export const fetchWithTimeout = async (url, options = {}, timeout = 5000) => {
  if (!circuitBreaker.canAttempt()) {
    throw new Error('Circuit breaker is OPEN. Request blocked.');
  }

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    circuitBreaker.recordSuccess();
    return await response.json();
  } catch (error) {
    clearTimeout(id);
    circuitBreaker.recordFailure();
    throw error;
  }
};

export const retryFetch = async (url, options = {}, maxRetries = 3, delay = 1000) => {
  let lastError;
  for (let i = 0; i < maxRetries; i++) {
    try {
      console.log(`[StockDataFetchingService] Attempt ${i + 1} for ${url}`);
      return await fetchWithTimeout(url, options);
    } catch (error) {
      lastError = error;
      console.warn(`[StockDataFetchingService] Fetch failed: ${error.message}. Retrying in ${delay}ms...`);
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  throw lastError;
};