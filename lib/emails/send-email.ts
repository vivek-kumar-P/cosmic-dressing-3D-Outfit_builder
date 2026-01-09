import { Resend } from 'resend';
import { OrderConfirmationEmail } from './order-confirmation-template';

// Lazy initialization of Resend client to avoid build-time errors
let resend: Resend | null = null;

function getResendClient() {
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY || '');
  }
  return resend;
}

export interface SendOrderConfirmationEmailParams {
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    color?: string;
  }[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress?: {
    name: string;
    address: string;
    city: string;
    zipCode: string;
  };
  trackingNumber?: string;
}

export async function sendOrderConfirmationEmail(params: SendOrderConfirmationEmailParams) {
  try {
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

    console.log('[Email] Starting order confirmation email process', {
      orderId: params.orderId,
      to: params.customerEmail,
      apiKeyExists: !!process.env.RESEND_API_KEY,
      apiKeyIsValid: process.env.RESEND_API_KEY !== 'your_resend_api_key_here',
      fromEmail,
    });

    // Check if API key is configured
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'your_resend_api_key_here') {
      const errorMsg = 'RESEND_API_KEY is not configured. Please set a valid Resend API key in .env.local';
      console.error('[Email]', errorMsg);
      return {
        success: false,
        error: errorMsg,
      };
    }

    const orderDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Build the email props first and validate they're serializable
    const emailProps = {
      orderId: params.orderId,
      orderNumber: params.orderNumber,
      customerName: params.customerName,
      customerEmail: params.customerEmail,
      items: params.items,
      subtotal: params.subtotal,
      shipping: params.shipping,
      tax: params.tax,
      total: params.total,
      shippingAddress: params.shippingAddress,
      orderDate,
      trackingNumber: params.trackingNumber,
    };

    console.log('[Email] Email props prepared:', {
      orderId: params.orderId,
      itemCount: params.items.length,
      customerName: params.customerName,
    });

    // Call the component function directly
    let emailComponent;
    try {
      emailComponent = OrderConfirmationEmail(emailProps);
      console.log('[Email] Component rendered successfully');
      console.log('[Email] Component type:', typeof emailComponent);
      console.log('[Email] Component is React element:', (emailComponent as any)?.$$typeof !== undefined);
    } catch (renderError) {
      console.error('[Email] Component rendering failed:', {
        error: renderError instanceof Error ? renderError.message : String(renderError),
        stack: renderError instanceof Error ? renderError.stack : undefined,
      });
      throw new Error(`Component rendering failed: ${renderError instanceof Error ? renderError.message : String(renderError)}`);
    }

    // Send email to the exact user's email address
    let response;
    try {
      console.log('[Email] Attempting to send with Resend API...');
      const resendClient = getResendClient();
      response = await resendClient.emails.send({
        from: fromEmail,
        to: params.customerEmail, // Email sent to exact customer email
        subject: `Order Confirmation - ${params.orderNumber} | Cosmic Outfits`,
        react: emailComponent,
      });
      console.log('[Email] Resend API call completed');
      console.log('[Email] Response data:', {
        hasError: !!response.error,
        hasData: !!response.data,
        dataKeys: response.data ? Object.keys(response.data) : [],
      });
    } catch (apiError) {
      console.error('[Email] Resend API call failed:', {
        error: apiError instanceof Error ? apiError.message : String(apiError),
        stack: apiError instanceof Error ? apiError.stack : undefined,
        errorType: apiError?.constructor?.name,
      });
      throw new Error(`Resend API error: ${apiError instanceof Error ? apiError.message : String(apiError)}`);
    }

    // Check if email sending was successful
    if (response.error) {
      console.error('[Email] Resend returned error:', response.error);
      throw new Error(`Resend error: ${response.error.message}`);
    }

    const messageId = response.data?.id || 'unknown';

    console.log('[Email] ✅ Order confirmation sent successfully:', {
      orderId: params.orderId,
      to: params.customerEmail,
      messageId: messageId,
    });

    return { success: true, messageId: messageId };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    console.error('[Email] FAILED TO SEND ORDER CONFIRMATION:', {
      orderId: params.orderId,
      to: params.customerEmail,
      error: errorMessage,
      stack: errorStack,
      errorType: error?.constructor?.name,
    });

    return {
      success: false,
      error: errorMessage,
      details: errorStack,
    };
  }
}

// Invoice generation helper
export function generateInvoiceText(params: SendOrderConfirmationEmailParams): string {
  const lines = [
    '═══════════════════════════════════════════',
    '                    INVOICE',
    '                 COSMIC OUTFITS',
    '═══════════════════════════════════════════',
    '',
    `Order Number:        ${params.orderNumber}`,
    `Order ID:            ${params.orderId}`,
    `Date:                ${new Date().toLocaleDateString()}`,
    `Invoice Date:        ${new Date().toLocaleDateString()}`,
    '',
    `Bill To:`,
    `${params.customerName}`,
    `${params.customerEmail}`,
    '',
    ...(params.shippingAddress
      ? [
          `Ship To:`,
          `${params.shippingAddress.name}`,
          `${params.shippingAddress.address}`,
          `${params.shippingAddress.city}, ${params.shippingAddress.zipCode}`,
          ''
        ]
      : []),
    '───────────────────────────────────────────',
    'ITEM DETAILS',
    '───────────────────────────────────────────',
    '',
    ...params.items.map((item) => [
      `${item.name}${item.color ? ` (${item.color})` : ''}`,
      `  Quantity: ${item.quantity}`,
      `  Unit Price: $${item.price.toFixed(2)}`,
      `  Total: $${(item.price * item.quantity).toFixed(2)}`,
      ''
    ].join('\n')),
    '───────────────────────────────────────────',
    'TOTALS',
    '───────────────────────────────────────────',
    `Subtotal:            $${params.subtotal.toFixed(2)}`,
    `Shipping:            $${params.shipping.toFixed(2)}`,
    `Tax:                 $${params.tax.toFixed(2)}`,
    '───────────────────────────────────────────',
    `TOTAL DUE:           $${params.total.toFixed(2)}`,
    '═══════════════════════════════════════════',
    '',
    'Thank you for your purchase!',
    'Your order has been received and will be processed shortly.',
    '',
    'For questions about this invoice, please contact:',
    'support@cosmic-outfits.com',
    '',
    `Invoice Generated: ${new Date().toLocaleString()}`,
  ].join('\n');

  return lines;
}
