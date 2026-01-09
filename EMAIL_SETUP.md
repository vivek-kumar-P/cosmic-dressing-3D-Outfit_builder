# Email Setup Guide

## Problem
Email not sending (500 error).

## Solution

### 1. Add Resend API Key
Get free key: https://resend.com → Sign Up → API Keys → Create Key

Add to `.env.local`:
```
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=onboarding@resend.dev
```

### 2. Restart Dev Server
```bash
Ctrl+C
npm run dev
```

### 3. Test Checkout
1. Go to http://localhost:3000
2. Add items → Checkout
3. Use your real email address
4. Click "Place Order"

### 4. Check Email
- Wait 2-5 minutes
- Check inbox for email from `onboarding@resend.dev`
- Email should contain order details, invoice, and tracking number

## Troubleshooting

**Still getting 500 error?**
- Check terminal logs for error message
- Verify API key is valid (starts with `re_`)
- Restart server after updating `.env.local`

**Email not arriving?**
- Check spam folder
- Verify email address used in checkout
- Check Resend dashboard at https://resend.com/emails

## Success Indicators
- Terminal shows: `[Email] ✅ Order confirmation sent successfully`
- Browser redirects to order confirmation page
- Email arrives in inbox within 5 minutes
