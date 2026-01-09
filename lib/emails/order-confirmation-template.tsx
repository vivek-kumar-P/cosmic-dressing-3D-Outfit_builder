import * as React from 'react';

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  color?: string;
}

interface ShippingAddress {
  name: string;
  address: string;
  city: string;
  zipCode: string;
}

interface OrderConfirmationEmailProps {
  orderNumber: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress?: ShippingAddress;
  orderDate: string;
  trackingNumber?: string;
}

export function OrderConfirmationEmail({
  orderNumber,
  orderId,
  customerName,
  customerEmail,
  items,
  subtotal,
  shipping,
  tax,
  total,
  shippingAddress,
  orderDate,
  trackingNumber,
}: OrderConfirmationEmailProps) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', backgroundColor: '#0a0a1a', color: '#ffffff', padding: '20px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '2px solid #00C4B4', paddingBottom: '20px' }}>
        <h1 style={{ color: '#00C4B4', fontSize: '28px', margin: '0 0 10px 0' }}>COSMIC OUTFITS</h1>
        <p style={{ color: '#999', margin: '0', fontSize: '14px' }}>Thank you for your purchase!</p>
      </div>

      {/* Order Confirmation */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#00C4B4', fontSize: '20px', marginBottom: '15px' }}>Order Confirmed</h2>
        <p style={{ margin: '8px 0', color: '#ccc' }}>
          <strong>Hi {customerName},</strong>
        </p>
        <p style={{ margin: '8px 0', color: '#ccc' }}>
          We&apos;ve received your order and will process it shortly. Your cosmic fashion journey is about to begin!
        </p>
      </div>

      {/* Order Details */}
      <div style={{ backgroundColor: '#1a1a1a', padding: '20px', borderRadius: '8px', marginBottom: '30px', border: '1px solid #333' }}>
        <h3 style={{ color: '#00C4B4', fontSize: '16px', marginBottom: '15px', marginTop: '0' }}>Order Details</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <td style={{ padding: '8px 0', color: '#999' }}>Order Number:</td>
              <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 'bold' }}>{orderNumber}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <td style={{ padding: '8px 0', color: '#999' }}>Order ID:</td>
              <td style={{ padding: '8px 0', textAlign: 'right', fontSize: '12px' }}>{orderId}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <td style={{ padding: '8px 0', color: '#999' }}>Order Date:</td>
              <td style={{ padding: '8px 0', textAlign: 'right' }}>{orderDate}</td>
            </tr>
            {trackingNumber && (
              <tr>
                <td style={{ padding: '8px 0', color: '#999' }}>Tracking Number:</td>
                <td style={{ padding: '8px 0', textAlign: 'right' }}>{trackingNumber}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Items */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ color: '#00C4B4', fontSize: '16px', marginBottom: '15px', marginTop: '0' }}>Items Ordered</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #00C4B4' }}>
              <th style={{ textAlign: 'left', padding: '10px 0', color: '#00C4B4', fontWeight: 'bold' }}>Item</th>
              <th style={{ textAlign: 'center', padding: '10px 0', color: '#00C4B4', fontWeight: 'bold' }}>Qty</th>
              <th style={{ textAlign: 'right', padding: '10px 0', color: '#00C4B4', fontWeight: 'bold' }}>Price</th>
              <th style={{ textAlign: 'right', padding: '10px 0', color: '#00C4B4', fontWeight: 'bold' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #333' }}>
                <td style={{ padding: '12px 0', color: '#ccc' }}>
                  {item.name}
                  {item.color && <span style={{ color: '#999', fontSize: '12px' }}> ({item.color})</span>}
                </td>
                <td style={{ textAlign: 'center', padding: '12px 0', color: '#ccc' }}>{item.quantity}</td>
                <td style={{ textAlign: 'right', padding: '12px 0', color: '#ccc' }}>${item.price.toFixed(2)}</td>
                <td style={{ textAlign: 'right', padding: '12px 0', color: '#ccc' }}>${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div style={{ backgroundColor: '#1a1a1a', padding: '20px', borderRadius: '8px', marginBottom: '30px', border: '1px solid #333' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <td style={{ padding: '8px 0', color: '#999' }}>Subtotal:</td>
              <td style={{ padding: '8px 0', textAlign: 'right', color: '#ccc' }}>${subtotal.toFixed(2)}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <td style={{ padding: '8px 0', color: '#999' }}>Shipping:</td>
              <td style={{ padding: '8px 0', textAlign: 'right', color: '#ccc' }}>${shipping.toFixed(2)}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <td style={{ padding: '8px 0', color: '#999' }}>Tax:</td>
              <td style={{ padding: '8px 0', textAlign: 'right', color: '#ccc' }}>${tax.toFixed(2)}</td>
            </tr>
            <tr>
              <td style={{ padding: '12px 0', fontWeight: 'bold', fontSize: '16px' }}>Total:</td>
              <td style={{ padding: '12px 0', textAlign: 'right', fontWeight: 'bold', fontSize: '16px', color: '#00C4B4' }}>${total.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Shipping Address */}
      {shippingAddress && (
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ color: '#00C4B4', fontSize: '16px', marginBottom: '15px', marginTop: '0' }}>Shipping Address</h3>
          <div style={{ backgroundColor: '#1a1a1a', padding: '20px', borderRadius: '8px', border: '1px solid #333' }}>
            <p style={{ margin: '0 0 5px 0', color: '#ccc' }}>
              <strong>{shippingAddress.name}</strong>
            </p>
            <p style={{ margin: '0 0 5px 0', color: '#ccc' }}>{shippingAddress.address}</p>
            <p style={{ margin: '0', color: '#ccc' }}>
              {shippingAddress.city}, {shippingAddress.zipCode}
            </p>
          </div>
        </div>
      )}

      {/* Customer Email */}
      <div style={{ marginBottom: '30px', backgroundColor: '#1a1a1a', padding: '20px', borderRadius: '8px', border: '1px solid #333' }}>
        <p style={{ margin: '0', color: '#999' }}>
          <strong>Email:</strong> {customerEmail}
        </p>
      </div>

      {/* Footer */}
      <div style={{ borderTop: '1px solid #333', paddingTop: '20px', textAlign: 'center', color: '#666', fontSize: '12px' }}>
        <p style={{ margin: '8px 0' }}>Thank you for shopping with Cosmic Outfits!</p>
        <p style={{ margin: '8px 0' }}>If you have any questions, please contact our support team.</p>
        <p style={{ margin: '8px 0', color: '#00C4B4' }}>
          <a href="https://cosmic-outfits.com" style={{ color: '#00C4B4', textDecoration: 'none' }}>
            Visit Our Website
          </a>
        </p>
      </div>
    </div>
  );
}
