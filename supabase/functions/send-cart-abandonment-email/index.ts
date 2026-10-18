import { corsHeaders } from "./cors.ts";

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      throw new Error("Missing RESEND_API_KEY environment variable.");
    }

    const { cartId, customerName, customerEmail, cartItems, cartTotal, recoveryLink, abandonedAt } = await req.json();

    const itemsHtml = (cartItems || []).map((item: any) => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name || item.title || 'Product'}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity || 1}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${item.price}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${(item.price * (item.quantity || 1)).toFixed(2)}</td>
      </tr>
    `).join('');

    const timeElapsed = Math.floor((new Date().getTime() - new Date(abandonedAt).getTime()) / (1000 * 60));
    const hours = Math.floor(timeElapsed / 60);
    const minutes = timeElapsed % 60;
    const timeString = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

    const htmlContent = `
      <div style="font-family: sans-serif; max-w-xl; margin: 0 auto; color: #333;">
        <h2 style="color: #2563eb;">Abandoned Cart Alert</h2>
        <p>A high-value cart was abandoned recently. Here are the details:</p>
        
        <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="margin-top: 0; font-size: 16px;">Customer Information</h3>
          <p style="margin: 4px 0;"><strong>Name:</strong> ${customerName || 'Guest'}</p>
          <p style="margin: 4px 0;"><strong>Email:</strong> ${customerEmail || 'Not provided'}</p>
          <p style="margin: 4px 0;"><strong>Time Elapsed:</strong> ${timeString}</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background: #f1f5f9;">
              <th style="padding: 8px; text-align: left;">Product</th>
              <th style="padding: 8px; text-align: center;">Qty</th>
              <th style="padding: 8px; text-align: right;">Price</th>
              <th style="padding: 8px; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" style="padding: 12px 8px; text-align: right; font-weight: bold;">Cart Total:</td>
              <td style="padding: 12px 8px; text-align: right; font-weight: bold; font-size: 18px; color: #16a34a;">$${cartTotal}</td>
            </tr>
          </tfoot>
        </table>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${recoveryLink}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
            Recover Cart Manually
          </a>
        </div>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
        <p style="font-size: 12px; color: #64748b; text-align: center;">
          ECom Revenue Recovery System &copy; ${new Date().getFullYear()}
        </p>
      </div>
    `;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`
      },
      body: JSON.stringify({
        from: 'Recovery <onboarding@resend.dev>',
        to: ['1angshuman.biswas@gmail.com'],
        subject: `⚠️ Abandoned Cart Alert: $${cartTotal} from ${customerName || 'Guest'}`,
        html: htmlContent
      })
    });

    const resData = await res.json();
    if (!res.ok) {
      throw new Error(resData.message || 'Failed to send email via Resend');
    }

    return new Response(
      JSON.stringify({ success: true, data: resData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});