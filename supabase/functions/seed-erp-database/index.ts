import { corsHeaders } from "./cors.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const insertCounts = {
      hr_metrics: 0,
      finance_metrics: 0,
      finance_transactions: 0,
      crm_metrics: 0,
      leads: 0,
      scm_metrics: 0,
      orders_scm: 0,
      inventory: 0,
      manufacturing: 0
    };

    // Insert HR Metrics
    const { data: hrData, error: hrError } = await supabaseClient
      .from('hr_metrics')
      .insert([{
        total_staff: 1245,
        leave_requests: 42,
        attrition_risk: 'Low',
        attrition_status: 'Stable',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select();

    if (hrError) throw new Error(`HR Metrics: ${hrError.message}`);
    insertCounts.hr_metrics = hrData?.length || 0;

    // Insert Finance Metrics
    const { data: financeMetricsData, error: financeMetricsError } = await supabaseClient
      .from('finance_metrics')
      .insert([{
        total_revenue: 2500000,
        operational_expenses: 1200000,
        net_profit: 1300000,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select();

    if (financeMetricsError) throw new Error(`Finance Metrics: ${financeMetricsError.message}`);
    insertCounts.finance_metrics = financeMetricsData?.length || 0;

    // Insert Finance Transaction
    const { data: transactionData, error: transactionError } = await supabaseClient
      .from('finance_transactions')
      .insert([{
        transaction_date: '2026-04-10',
        description: 'Enterprise Software Licenses',
        category: 'Software',
        amount: -45000,
        created_at: new Date().toISOString()
      }])
      .select();

    if (transactionError) throw new Error(`Finance Transactions: ${transactionError.message}`);
    insertCounts.finance_transactions = transactionData?.length || 0;

    // Insert CRM Metrics
    const { data: crmMetricsData, error: crmMetricsError } = await supabaseClient
      .from('crm_metrics')
      .insert([{
        total_leads: 142,
        active_deals: 38,
        pipeline_value: 4500000,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select();

    if (crmMetricsError) throw new Error(`CRM Metrics: ${crmMetricsError.message}`);
    insertCounts.crm_metrics = crmMetricsData?.length || 0;

    // Insert Leads
    const { data: leadsData, error: leadsError } = await supabaseClient
      .from('leads')
      .insert([
        {
          client_name: 'Acme Corp',
          industry: 'Technology',
          status: 'Proposal',
          expected_value: 1200000,
          next_followup: '2026-04-15',
          created_at: new Date().toISOString()
        },
        {
          client_name: 'Global Logistics',
          industry: 'Supply Chain',
          status: 'Contacted',
          expected_value: 850000,
          next_followup: '2026-04-18',
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (leadsError) throw new Error(`Leads: ${leadsError.message}`);
    insertCounts.leads = leadsData?.length || 0;

    // Insert SCM Metrics
    const { data: scmMetricsData, error: scmMetricsError } = await supabaseClient
      .from('scm_metrics')
      .insert([{
        pending_orders: 45,
        inventory_level: 85,
        fulfillment_rate: 92,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select();

    if (scmMetricsError) throw new Error(`SCM Metrics: ${scmMetricsError.message}`);
    insertCounts.scm_metrics = scmMetricsData?.length || 0;

    // Insert Orders
    const { data: ordersData, error: ordersError } = await supabaseClient
      .from('orders_scm')
      .insert([
        {
          order_id: 'ORD-2026-001',
          item_description: 'Server Hardware Racks',
          status: 'Pending',
          logistics_partner: 'FedEx Express',
          created_at: new Date().toISOString()
        },
        {
          order_id: 'ORD-2026-002',
          item_description: 'Office Supplies Q2',
          status: 'Shipped',
          logistics_partner: 'DHL Global',
          created_at: new Date().toISOString()
        },
        {
          order_id: 'ORD-2026-003',
          item_description: 'Cloud Infrastructure Nodes',
          status: 'Delivered',
          logistics_partner: 'AWS Logistics',
          created_at: new Date().toISOString()
        },
        {
          order_id: 'ORD-2026-004',
          item_description: 'Marketing Materials',
          status: 'Cancelled',
          logistics_partner: 'UPS',
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (ordersError) throw new Error(`Orders: ${ordersError.message}`);
    insertCounts.orders_scm = ordersData?.length || 0;

    // Insert Inventory
    const { data: inventoryData, error: inventoryError } = await supabaseClient
      .from('inventory')
      .insert([
        {
          item_sku: 'SKU-INV01',
          current_stock: 450,
          location: 'Warehouse A',
          created_at: new Date().toISOString()
        },
        {
          item_sku: 'SKU-INV02',
          current_stock: 120,
          location: 'Warehouse B',
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (inventoryError) throw new Error(`Inventory: ${inventoryError.message}`);
    insertCounts.inventory = inventoryData?.length || 0;

    // Insert Manufacturing
    const { data: manufacturingData, error: manufacturingError } = await supabaseClient
      .from('manufacturing')
      .insert([{
        batch_id: 'BATCH-2026-01',
        status: 'QC',
        timeline: 'Week 14-16',
        created_at: new Date().toISOString()
      }])
      .select();

    if (manufacturingError) throw new Error(`Manufacturing: ${manufacturingError.message}`);
    insertCounts.manufacturing = manufacturingData?.length || 0;

    return new Response(
      JSON.stringify({
        success: true,
        message: 'ERP database seeded successfully',
        insertCounts,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Seed ERP Database Error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Failed to seed database',
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});