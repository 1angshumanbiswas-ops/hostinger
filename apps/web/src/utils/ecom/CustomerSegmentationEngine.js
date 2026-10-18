export class CustomerSegmentationEngine {
  static calculateCustomerLTV(orders) {
    if (!orders || orders.length === 0) return 0;
    return orders.reduce((sum, order) => sum + (parseFloat(order.total_value) || 0), 0);
  }

  static identifyVIPCustomers(ltv, threshold = 500) {
    return ltv >= threshold;
  }

  static segmentByValue(ltv, orderCount) {
    if (orderCount === 0) return 'New';
    if (ltv >= 500) return 'VIP';
    if (ltv >= 200) return 'Loyal';
    return 'Regular';
  }

  static generatePersonalizationContext(segment) {
    const contexts = {
      'New': { tone: 'welcoming', offer_level: 'free_shipping', language: 'Welcome to our family!' },
      'VIP': { tone: 'exclusive', offer_level: 'high_discount', language: 'As one of our most valued customers...' },
      'Loyal': { tone: 'appreciative', offer_level: 'medium_discount', language: 'Thanks for coming back!' },
      'Regular': { tone: 'friendly', offer_level: 'low_discount', language: 'We noticed you left something behind.' }
    };
    return contexts[segment] || contexts['Regular'];
  }

  static applySegmentationToMessages(segment, baseMessage) {
    const context = this.generatePersonalizationContext(segment);
    return `[${context.tone.toUpperCase()} TONE] ${context.language} ${baseMessage} [Offer: ${context.offer_level}]`;
  }
}