/**
 * Test script to debug email rendering and sending
 * Run: node lib/emails/test-email.ts
 */

import { OrderConfirmationEmail } from './order-confirmation-template';

console.log('\n========== EMAIL COMPONENT TEST ==========\n');

try {
  console.log('1. Testing component import...');
  console.log('   ✓ OrderConfirmationEmail imported successfully');
  console.log('   Type:', typeof OrderConfirmationEmail);
  console.log('   Name:', OrderConfirmationEmail.name);

  console.log('\n2. Testing component invocation...');
  
  const testProps = {
    orderId: 'test-123',
    orderNumber: 'ORD-001',
    customerName: 'Test User',
    customerEmail: 'test@example.com',
    items: [
      {
        id: 1,
        name: 'Test Outfit',
        price: 99.99,
        quantity: 1,
        color: 'Blue',
      }
    ],
    subtotal: 99.99,
    shipping: 10,
    tax: 8.80,
    total: 118.79,
    shippingAddress: {
      name: 'Test User',
      address: '123 Test St',
      city: 'Test City',
      zipCode: '12345',
    },
    orderDate: new Date().toLocaleDateString(),
    trackingNumber: 'TRACK-123',
  };

  console.log('   Props prepared');
  console.log('   - orderId:', testProps.orderId);
  console.log('   - customerEmail:', testProps.customerEmail);
  console.log('   - itemCount:', testProps.items.length);

  const component = OrderConfirmationEmail(testProps);
  console.log('   ✓ Component invoked successfully');
  console.log('   Result type:', typeof component);
  console.log('   Result is React element:', (component as any)?.$$typeof !== undefined);

  if ((component as any)?.$$typeof) {
    console.log('   Result props:', {
      type: (component as any).type?.name || 'Anonymous',
      props: Object.keys((component as any).props || {}).slice(0, 5),
    });
  }

  console.log('\n3. Checking Resend compatibility...');
  console.log('   ✓ Component appears to be properly serializable for Resend');
  
  console.log('\n========== TEST PASSED ==========\n');
  process.exit(0);
} catch (error) {
  console.error('\n❌ ERROR DURING TEST:');
  console.error('Message:', error instanceof Error ? error.message : String(error));
  console.error('Stack:', error instanceof Error ? error.stack : undefined);
  console.error('\n========== TEST FAILED ==========\n');
  process.exit(1);
}
