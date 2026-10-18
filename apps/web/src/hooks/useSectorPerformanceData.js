import { useState, useEffect, useCallback } from 'react';
import { fetchTopBSEStocks, SECTOR_MAPPING } from '@/utils/FreeFinancialDataSourcesIntegration';
import { getMockSectorPerformance } from '@/utils/StockDashboardMockData';

// Updated predefined sectors without Consumer, with IT after Banking
export const PREDEFINED_SECTORS = [
  { sectorName: 'Banking', changePercent: 0, status: 'neutral' },
  { sectorName: 'IT', changePercent: 0, status: 'neutral' },
  { sectorName: 'Automobile', changePercent: 0, status: 'neutral' },
  { sectorName: 'Pharma', changePercent: 0, status: 'neutral' },
  { sectorName: 'Energy', changePercent: 0, status: 'neutral' },
  { sectorName: 'FMCG', changePercent: 0, status: 'neutral' },
  { sectorName: 'Metals', changePercent: 0, status: 'neutral' },
  { sectorName: 'Realty', changePercent: 0, status: 'neutral' },
  { sectorName: 'Telecom', changePercent: 0, status: 'neutral' },
  { sectorName: 'Utilities', changePercent: 0, status: 'neutral' },
  { sectorName: 'Cement', changePercent: 0, status: 'neutral' },
  { sectorName: 'Chemicals', changePercent: 0, status: 'neutral' },
  { sectorName: 'Textiles', changePercent: 0, status: 'neutral' }
];

export const useSectorPerformanceData = () => {
  const [sectors, setSectors] = useState(PREDEFINED_SECTORS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSectors = useCallback(async (force = false) => {
    setLoading(true);
    try {
      const stocks = await fetchTopBSEStocks(force);
      if (!stocks || stocks.length === 0) throw new Error('No stocks data returned');

      const result = [];
      Object.entries(SECTOR_MAPPING).forEach(([sectorName, { symbols }]) => {
        const sectorStocks = stocks.filter(s => symbols.includes(s.symbol));
        if (sectorStocks.length > 0) {
          const avgChange = sectorStocks.reduce((sum, s) => sum + s.changePercent, 0) / sectorStocks.length;
          result.push({
            sectorName,
            changePercent: Number(avgChange.toFixed(2)),
            status: avgChange > 0.05 ? 'positive' : avgChange < -0.05 ? 'negative' : 'neutral'
          });
        } else {
          result.push({ sectorName, changePercent: 0, status: 'neutral' });
        }
      });

      // Ensure all predefined sectors are included
      PREDEFINED_SECTORS.forEach(predefined => {
        if (!result.find(r => r.sectorName === predefined.sectorName)) {
          result.push({ ...predefined });
        }
      });

      setSectors(result.sort((a,b) => b.changePercent - a.changePercent));
      setError(null);
    } catch (err) {
      console.warn('[useSectorPerformanceData] Fetch failed, falling back to mock data:', err);
      try {
        const mockSectors = await getMockSectorPerformance();
        setSectors(mockSectors);
      } catch (mockErr) {
        setSectors(PREDEFINED_SECTORS);
      }
      setError(err.message || 'Failed to load sector data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSectors();
  }, [fetchSectors]);

  return { sectors, loading, error, refreshSectors: fetchSectors };
};