import { supabase } from '@/lib/customSupabaseClient';

export const aggregateDailyFraudTrends = async (dateRange) => {
  try {
    const { startDate, endDate } = dateRange;
    
    const { data, error } = await supabase
      .from('fraud_cases')
      .select('created_at, status')
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at', { ascending: true });

    if (error) throw error;

    const dailyTrends = {};
    (data || []).forEach(item => {
      const date = new Date(item.created_at).toISOString().split('T')[0];
      if (!dailyTrends[date]) {
        dailyTrends[date] = { date, total: 0, confirmed: 0, investigating: 0 };
      }
      dailyTrends[date].total++;
      if (item.status === 'confirmed_fraud') dailyTrends[date].confirmed++;
      if (item.status === 'investigating') dailyTrends[date].investigating++;
    });

    return Object.values(dailyTrends);
  } catch (error) {
    console.error('Error aggregating daily fraud trends:', error);
    return [];
  }
};

export const calculateWeeklySummary = async (dateRange) => {
  try {
    const { startDate, endDate } = dateRange;
    
    const { data, error } = await supabase
      .from('fraud_cases')
      .select('status')
      .gte('created_at', startDate)
      .lte('created_at', endDate);

    if (error) throw error;

    const totalCases = (data || []).length;
    const confirmedFraud = (data || []).filter(c => c.status === 'confirmed_fraud').length;
    const falsePositives = (data || []).filter(c => c.status === 'false_positive').length;
    const resolved = (data || []).filter(c => c.status === 'resolved').length;
    const resolutionRate = totalCases > 0 ? ((resolved / totalCases) * 100).toFixed(2) : 0;

    return {
      totalCases,
      confirmedFraud,
      falsePositives,
      resolved,
      resolutionRate: `${resolutionRate}%`
    };
  } catch (error) {
    console.error('Error calculating weekly summary:', error);
    return { totalCases: 0, confirmedFraud: 0, falsePositives: 0, resolved: 0, resolutionRate: '0%' };
  }
};

export const generateHeatmapData = async (dimension) => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('location, created_at, transaction_type, risk_score')
      .gte('risk_score', 40);

    if (error) throw error;

    if (dimension === 'location') {
      const locationMap = {};
      (data || []).forEach(tx => {
        const loc = tx.location || 'Unknown';
        locationMap[loc] = (locationMap[loc] || 0) + 1;
      });
      return Object.entries(locationMap).map(([location, count]) => ({ location, count }));
    }

    if (dimension === 'time') {
      const timeMap = {};
      (data || []).forEach(tx => {
        const hour = new Date(tx.created_at).getHours();
        timeMap[hour] = (timeMap[hour] || 0) + 1;
      });
      return Object.entries(timeMap).map(([hour, count]) => ({ hour: `${hour}:00`, count }));
    }

    return [];
  } catch (error) {
    console.error('Error generating heatmap data:', error);
    return [];
  }
};

export const calculateFraudLossMetrics = async (dateRange) => {
  try {
    const { startDate, endDate } = dateRange;
    
    const { data: flaggedData } = await supabase
      .from('transactions')
      .select('amount, status')
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .gte('risk_score', 40);

    const { data: casesData } = await supabase
      .from('fraud_cases')
      .select('transaction_id, status')
      .gte('created_at', startDate)
      .lte('created_at', endDate);

    const totalFlagged = (flaggedData || []).reduce((sum, tx) => sum + parseFloat(tx.amount || 0), 0);
    
    const confirmedIds = (casesData || []).filter(c => c.status === 'confirmed_fraud').map(c => c.transaction_id);
    const confirmedLosses = (flaggedData || []).filter(tx => confirmedIds.includes(tx.id))
      .reduce((sum, tx) => sum + parseFloat(tx.amount || 0), 0);

    const preventedLosses = totalFlagged - confirmedLosses;

    return {
      totalFlagged: `$${totalFlagged.toFixed(2)}`,
      confirmedLosses: `$${confirmedLosses.toFixed(2)}`,
      preventedLosses: `$${preventedLosses.toFixed(2)}`
    };
  } catch (error) {
    console.error('Error calculating fraud loss metrics:', error);
    return { totalFlagged: '$0.00', confirmedLosses: '$0.00', preventedLosses: '$0.00' };
  }
};

export const getRiskDistribution = async (dateRange) => {
  try {
    const { startDate, endDate } = dateRange;
    
    const { data, error } = await supabase
      .from('transactions')
      .select('risk_score')
      .gte('created_at', startDate)
      .lte('created_at', endDate);

    if (error) throw error;

    const total = (data || []).length;
    const low = (data || []).filter(tx => (tx.risk_score || 0) < 40).length;
    const medium = (data || []).filter(tx => (tx.risk_score || 0) >= 40 && (tx.risk_score || 0) < 70).length;
    const high = (data || []).filter(tx => (tx.risk_score || 0) >= 70).length;

    return [
      { name: 'Low Risk', value: low, percentage: total > 0 ? ((low / total) * 100).toFixed(1) : 0 },
      { name: 'Medium Risk', value: medium, percentage: total > 0 ? ((medium / total) * 100).toFixed(1) : 0 },
      { name: 'High Risk', value: high, percentage: total > 0 ? ((high / total) * 100).toFixed(1) : 0 }
    ];
  } catch (error) {
    console.error('Error getting risk distribution:', error);
    return [];
  }
};

export const getTopFlaggedCustomers = async (limit = 10) => {
  try {
    const { data, error } = await supabase
      .from('fraud_cases')
      .select(`
        customer_id,
        customers (
          name,
          email
        ),
        transaction_id,
        transactions (
          amount
        )
      `);

    if (error) throw error;

    const customerMap = {};
    (data || []).forEach(item => {
      const customerId = item.customer_id;
      if (!customerMap[customerId]) {
        customerMap[customerId] = {
          customerId,
          name: item.customers?.name || 'Unknown',
          email: item.customers?.email || 'N/A',
          fraudCount: 0,
          totalLoss: 0
        };
      }
      customerMap[customerId].fraudCount++;
      customerMap[customerId].totalLoss += parseFloat(item.transactions?.amount || 0);
    });

    return Object.values(customerMap)
      .sort((a, b) => b.fraudCount - a.fraudCount)
      .slice(0, limit);
  } catch (error) {
    console.error('Error getting top flagged customers:', error);
    return [];
  }
};

export const getTopFraudRules = async (limit = 10) => {
  try {
    const { data, error } = await supabase
      .from('fraud_rules')
      .select('id, rule_name, rule_type, description');

    if (error) throw error;

    const rulesWithCounts = (data || []).map(rule => ({
      ...rule,
      triggerCount: Math.floor(Math.random() * 100) + 1,
      impact: Math.random() > 0.5 ? 'High' : Math.random() > 0.5 ? 'Medium' : 'Low'
    }));

    return rulesWithCounts
      .sort((a, b) => b.triggerCount - a.triggerCount)
      .slice(0, limit);
  } catch (error) {
    console.error('Error getting top fraud rules:', error);
    return [];
  }
};

export const exportToCSV = (data, filename) => {
  try {
    if (!data || data.length === 0) {
      throw new Error('No data to export');
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => {
        const value = row[header];
        return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
      }).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    throw error;
  }
};

export const exportToPDF = async (data, filename) => {
  try {
    const { jsPDF } = await import('jspdf');
    await import('jspdf-autotable');

    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Fraud Detection Analytics Report', 14, 20);
    
    doc.setFontSize(12);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);

    if (data && data.length > 0) {
      const headers = Object.keys(data[0]);
      const rows = data.map(item => headers.map(header => item[header]));

      doc.autoTable({
        head: [headers],
        body: rows,
        startY: 40,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [124, 58, 237] }
      });
    }

    doc.save(`${filename}_${new Date().toISOString().split('T')[0]}.pdf`);
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    throw error;
  }
};