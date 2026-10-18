export const marketData = {
  globalAbandonmentRate: 70.22,
  industries: [
    { id: 'general', name: 'General E-commerce', rate: 70.22, defaultAov: 120 },
    { id: 'fashion', name: 'Fashion', rate: 84.6, defaultAov: 150 },
    { id: 'luxury', name: 'Luxury', rate: 82.8, defaultAov: 800 }
  ],
  devices: [
    { id: 'all', name: 'All Devices', orderShare: 100, rate: 70.22 },
    { id: 'mobile', name: 'Mobile', orderShare: 69, rate: 85.0 },
    { id: 'desktop', name: 'Desktop', orderShare: 31, rate: 61.0 }
  ],
  triggers: [
    { name: 'Extra Costs', value: 48, fill: 'hsl(var(--chart-1))' },
    { name: 'Sustainability', value: 33, fill: 'hsl(var(--chart-2))' },
    { name: 'Other', value: 19, fill: 'hsl(var(--chart-3))' }
  ],
  sources: [
    { name: 'Baymard Institute', url: 'https://baymard.com/lists/cart-abandonment-rate' },
    { name: 'Clickpost', url: 'https://www.clickpost.ai' },
    { name: 'Statista', url: 'https://www.statista.com' },
    { name: 'Shiprocket', url: 'https://www.shiprocket.in' },
    { name: 'DHL', url: 'https://www.dhl.com' }
  ]
};

export const getIndustryById = (id) => marketData.industries.find(ind => ind.id === id) || marketData.industries[0];
export const getDeviceById = (id) => marketData.devices.find(dev => id === dev.id) || marketData.devices[0];