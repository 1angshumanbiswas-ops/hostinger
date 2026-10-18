import { supabase } from '@/lib/customSupabaseClient';

export class AlertService {
  static async sendAlert(customerId, caseId, alertType, message) {
    try {
      const { data, error } = await supabase
        .from('alerts')
        .insert({
          customer_id: customerId,
          case_id: caseId,
          alert_type: alertType,
          message: message,
          sent_at: new Date().toISOString(),
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      console.log(`Alert sent: ${alertType} to customer ${customerId}`);
      return { success: true, data };
    } catch (err) {
      console.error('Error sending alert:', err);
      return { success: false, error: err.message };
    }
  }

  static async sendFraudAlert(customer, fraudCase, alertType = 'Email') {
    const templates = {
      unusual_amount: `Unusual transaction detected on your account. Amount: $${fraudCase.transactions?.amount}. Please verify if this was you.`,
      rapid_transfers: `Multiple rapid transactions detected on your account. Please review your recent activity.`,
      location_mismatch: `Transaction detected from unusual location: ${fraudCase.transactions?.location}. Please verify.`,
      velocity_check: `High transaction volume detected on your account. Please contact us if this wasn't you.`
    };

    const alertReason = fraudCase.alert_reason || '';
    const reasonKey = alertReason.split(';')[0]?.trim();
    const message = templates[reasonKey] || `Suspicious activity detected on your account. Case ID: ${fraudCase.id}`;

    return await this.sendAlert(
      customer.id,
      fraudCase.id,
      alertType,
      message
    );
  }

  static async sendCustomAlert(customerId, alertType, message) {
    return await this.sendAlert(customerId, null, alertType, message);
  }

  static getAlertTemplates() {
    return {
      unusual_amount: 'Unusual transaction amount detected',
      rapid_transfers: 'Multiple rapid transactions detected',
      location_mismatch: 'Transaction from unusual location',
      velocity_check: 'High transaction volume detected',
      account_locked: 'Your account has been temporarily locked',
      case_resolved: 'Fraud investigation resolved'
    };
  }
}