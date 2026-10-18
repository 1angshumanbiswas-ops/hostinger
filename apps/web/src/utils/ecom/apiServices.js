// Mock API Services for external integrations

export class BaymardBenchmarksAPI {
  static async fetchIndustryData() {
    // Mocking response
    return new Promise((resolve) => setTimeout(() => resolve({
      globalRate: 70.22,
      industries: {
        Fashion: 84.6,
        Luxury: 82.8,
        Electronics: 72.1,
        Travel: 81.3
      },
      devices: { Mobile: 85.0, Desktop: 68.3 },
      triggers: [
        { cause: 'Extra costs too high', percentage: 48 },
        { cause: 'Account creation required', percentage: 24 },
        { cause: 'Delivery too slow', percentage: 22 },
        { cause: 'Sustainability concerns', percentage: 33 }
      ]
    }), 500));
  }
}

export class ShopifyAPI {
  constructor(apiKey, shopUrl) {
    this.apiKey = apiKey;
    this.shopUrl = shopUrl;
  }
  async testConnection() {
    return new Promise(resolve => setTimeout(() => resolve({ success: true }), 1000));
  }
  async fetchProducts() { return []; }
}

export class WooCommerceAPI {
  constructor(consumerKey, consumerSecret, url) {
    this.key = consumerKey;
    this.secret = consumerSecret;
    this.url = url;
  }
  async testConnection() {
    return new Promise(resolve => setTimeout(() => resolve({ success: true }), 1000));
  }
}

export class AirtableAPI {
  constructor(apiKey, baseId) {
    this.apiKey = apiKey;
    this.baseId = baseId;
  }
  async testConnection() {
    return new Promise(resolve => setTimeout(() => resolve({ success: true }), 1000));
  }
}

export class GroqAPI {
  constructor(apiKey) { this.apiKey = apiKey; }
  async generateText(prompt) {
    return new Promise(resolve => setTimeout(() => resolve(`Generated via Groq: ${prompt}`), 1000));
  }
}

export class OpenRouterAPI {
  constructor(apiKey) { this.apiKey = apiKey; }
  async generateText(prompt) {
    return new Promise(resolve => setTimeout(() => resolve(`Generated via OpenRouter: ${prompt}`), 1000));
  }
}