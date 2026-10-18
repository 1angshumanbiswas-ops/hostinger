import { supabase } from '@/lib/customSupabaseClient';

export async function seedERPDatabase() {
  try {
    const { data, error } = await supabase.functions.invoke('seed-erp-database', {
      body: JSON.stringify({})
    });

    if (error) {
      console.error('Error seeding ERP database:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to seed ERP database:', error);
    throw error;
  }
}

export async function checkERPDataExists() {
  try {
    const [hrCheck, financeCheck, crmCheck, scmCheck] = await Promise.all([
      supabase.from('hr_metrics').select('id', { count: 'exact', head: true }),
      supabase.from('finance_metrics').select('id', { count: 'exact', head: true }),
      supabase.from('crm_metrics').select('id', { count: 'exact', head: true }),
      supabase.from('scm_metrics').select('id', { count: 'exact', head: true })
    ]);

    const hasData = (hrCheck.count || 0) > 0 || 
                    (financeCheck.count || 0) > 0 || 
                    (crmCheck.count || 0) > 0 || 
                    (scmCheck.count || 0) > 0;

    return hasData;
  } catch (error) {
    console.error('Error checking ERP data:', error);
    return false;
  }
}