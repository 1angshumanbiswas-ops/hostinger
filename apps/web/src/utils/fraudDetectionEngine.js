import { supabase } from '@/lib/customSupabaseClient';

export class FraudDetectionEngine {
  static async calculateRiskScore(transaction, customer, rules) {
    let riskScore = 0;
    const alerts = [];

    const activeRules = rules.filter(r => r.enabled);

    for (const rule of activeRules) {
      switch (rule.rule_type) {
        case 'unusual_amount':
          const unusualAmountCheck = await this.checkUnusualAmount(
            transaction,
            customer,
            rule.threshold_value
          );
          if (unusualAmountCheck.flagged) {
            riskScore += 25;
            alerts.push(unusualAmountCheck.reason);
          }
          break;

        case 'rapid_transfers':
          const rapidTransfersCheck = await this.checkRapidTransfers(
            transaction,
            customer,
            rule.threshold_value
          );
          if (rapidTransfersCheck.flagged) {
            riskScore += 30;
            alerts.push(rapidTransfersCheck.reason);
          }
          break;

        case 'location_mismatch':
          const locationCheck = this.checkLocationMismatch(
            transaction,
            customer,
            rule.threshold_value
          );
          if (locationCheck.flagged) {
            riskScore += 20;
            alerts.push(locationCheck.reason);
          }
          break;

        case 'velocity_check':
          const velocityCheck = await this.checkVelocity(
            transaction,
            customer,
            rule.threshold_value
          );
          if (velocityCheck.flagged) {
            riskScore += 35;
            alerts.push(velocityCheck.reason);
          }
          break;
      }
    }

    return {
      riskScore: Math.min(riskScore, 100),
      alerts,
      level: this.getRiskLevel(riskScore)
    };
  }

  static async checkUnusualAmount(transaction, customer, threshold) {
    const avgAmount = customer.average_transaction_amount || 0;
    const multiplier = avgAmount > 0 ? transaction.amount / avgAmount : 0;

    if (multiplier > 3 || transaction.amount > threshold) {
      return {
        flagged: true,
        reason: `Transaction amount ($${transaction.amount}) is ${multiplier.toFixed(1)}x the average ($${avgAmount})`
      };
    }

    return { flagged: false };
  }

  static async checkRapidTransfers(transaction, customer, maxCount) {
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from('transactions')
      .select('id')
      .eq('customer_id', customer.id)
      .gte('timestamp', tenMinutesAgo);

    if (error) {
      console.error('Error checking rapid transfers:', error);
      return { flagged: false };
    }

    const count = data?.length || 0;

    if (count >= maxCount) {
      return {
        flagged: true,
        reason: `${count} transactions detected within 10 minutes`
      };
    }

    return { flagged: false };
  }

  static checkLocationMismatch(transaction, customer, threshold) {
    if (!transaction.location) {
      return { flagged: false };
    }

    const unusualLocations = ['Nigeria', 'Russia', 'China', 'Unknown'];
    const isUnusual = unusualLocations.some(loc => 
      transaction.location.toLowerCase().includes(loc.toLowerCase())
    );

    if (isUnusual) {
      return {
        flagged: true,
        reason: `Transaction from unusual location: ${transaction.location}`
      };
    }

    return { flagged: false };
  }

  static async checkVelocity(transaction, customer, threshold) {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from('transactions')
      .select('amount')
      .eq('customer_id', customer.id)
      .gte('timestamp', oneHourAgo);

    if (error) {
      console.error('Error checking velocity:', error);
      return { flagged: false };
    }

    const totalAmount = (data || []).reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const withCurrent = totalAmount + parseFloat(transaction.amount);

    if (withCurrent > threshold) {
      return {
        flagged: true,
        reason: `Total transaction volume of $${withCurrent.toFixed(2)} in past hour exceeds threshold`
      };
    }

    return { flagged: false };
  }

  static getRiskLevel(score) {
    if (score >= 70) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  }

  static async createFraudCase(transaction, customer, riskScore, alerts) {
    try {
      const { data, error } = await supabase
        .from('fraud_cases')
        .insert({
          transaction_id: transaction.id,
          customer_id: customer.id,
          risk_score: riskScore,
          alert_reason: alerts.join('; '),
          status: 'investigating',
          priority: riskScore >= 70 ? 'high' : riskScore >= 40 ? 'medium' : 'low'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error creating fraud case:', err);
      return null;
    }
  }
}