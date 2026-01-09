import { NextRequest, NextResponse } from 'next/server';
import { sendOrderConfirmationEmail } from '@/lib/emails/send-email';

export const runtime = 'nodejs';

interface OrderConfirmationRequest {
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

export async function POST(request: NextRequest) {
  try {
    console.log('[API Route] Received email request');
    
    let body: OrderConfirmationRequest;
    try {
      body = await request.json();
      console.log('[API Route] Request body parsed:', {
        orderId: body.orderId,
        orderNumber: body.orderNumber,
        customerEmail: body.customerEmail,
        itemCount: body.items?.length || 0,
      });
    } catch (parseError) {
      console.error('[API Route] Failed to parse request body:', parseError);
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid JSON in request body',
          details: parseError instanceof Error ? parseError.message : String(parseError),
        },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!body.orderId || !body.orderNumber || !body.customerEmail) {
      console.error('[API Route] Missing required fields:', {
        hasOrderId: !!body.orderId,
        hasOrderNumber: !!body.orderNumber,
        hasCustomerEmail: !!body.customerEmail,
      });
      return NextResponse.json(
        { error: 'Missing required fields: orderId, orderNumber, customerEmail' },
        { status: 400 }
      );
    }

    console.log('[API Route] Validation passed, calling sendOrderConfirmationEmail');

    // Send email
    const result = await sendOrderConfirmationEmail({
      orderId: body.orderId,
      orderNumber: body.orderNumber,
      customerName: body.customerName || 'Valued Customer',
      customerEmail: body.customerEmail,
      items: body.items || [],
      subtotal: body.subtotal || 0,
      shipping: body.shipping || 0,
      tax: body.tax || 0,
      total: body.total || 0,
      shippingAddress: body.shippingAddress,
      trackingNumber: body.trackingNumber,
    });

    console.log('[API Route] sendOrderConfirmationEmail returned:', {
      success: result.success,
      messageId: result.messageId,
      error: result.error?.substring(0, 100),
    });

    if (result.success) {
      console.log('[API Route] Email sent successfully');
      return NextResponse.json({
        success: true,
        message: 'Order confirmation email sent successfully',
        messageId: result.messageId,
      });
    } else {
      console.error('[API Route] Email sending failed:', result.error);
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Failed to send email',
          details: result.details,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('[API Route] UNHANDLED ERROR in send-order-confirmation:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      errorType: error?.constructor?.name,
    });
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
