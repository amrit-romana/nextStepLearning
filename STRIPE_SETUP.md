# Stripe Integration Setup

## Overview
Stripe has been integrated into the tutoring platform for secure payment processing. The integration includes:

- **Frontend**: Stripe React components for card input
- **Backend**: Payment intent creation and webhook handling
- **Database**: Automatic enrollment activation upon successful payment

## Environment Variables

Add the following to your `.env.local`:

```env
# Stripe Publishable Key (visible to client)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here

# Stripe Secret Key (server-side only)
STRIPE_SECRET_KEY=sk_test_your_key_here

# Webhook Secret (from Stripe Dashboard)
STRIPE_WEBHOOK_SECRET=whsec_test_your_webhook_secret_here
```

## Setup Instructions

### 1. Get Stripe Keys
1. Go to [https://dashboard.stripe.com](https://dashboard.stripe.com)
2. Navigate to Developers > API Keys
3. Copy your publishable and secret keys
4. Add them to `.env.local`

### 2. Set Up Webhooks
1. In Stripe Dashboard, go to Developers > Webhooks
2. Click "Add endpoint"
3. Set endpoint URL to: `https://yourdomain.com/api/payment/webhook`
4. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy the webhook signing secret and add to `.env.local`

### 3. Test Stripe Integration

**Test Card Numbers:**
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Requires authentication: `4000 0000 0000 3220`

Use any future expiry date and any CVC (e.g., 123)

## Payment Flow

1. User clicks "Enroll Now" on dashboard pricing
2. User enters card details on payment page
3. System creates Stripe PaymentIntent
4. Stripe processes payment
5. On success:
   - Webhook triggered
   - Entrance number generated
   - Enrollment marked as active
   - User redirected to dashboard
6. Paid classes now appear as cards in dashboard

## API Routes

### POST `/api/payment/create-payment-intent`
Creates a Stripe PaymentIntent for the enrollment.

**Request Body:**
```json
{
  "enrollmentId": "uuid",
  "amount": 98,
  "subject": "Mathematics"
}
```

**Response:**
```json
{
  "clientSecret": "pi_xxxxx"
}
```

### POST `/api/payment/webhook`
Handles Stripe webhook events for payment confirmation.

## Files Modified/Created

- `/src/app/dashboard/payment/[id]/page.tsx` - Payment form with Stripe UI
- `/src/app/api/payment/create-payment-intent/route.ts` - PaymentIntent creation
- `/src/app/api/payment/webhook/route.ts` - Webhook handler
- `/src/app/dashboard/page.tsx` - Shows pricing when no active classes
- `.env.local` - Stripe configuration keys

## Testing Payments

For development, use Stripe's test mode with the test card numbers listed above. Ensure:

1. Webhook endpoint is properly configured
2. STRIPE_WEBHOOK_SECRET is set correctly
3. Test mode is enabled in Stripe Dashboard
4. No real payments occur during testing

## Production Setup

Before going live:

1. Switch to live API keys in Stripe Dashboard
2. Update environment variables with live keys
3. Re-configure webhook endpoint for production URL
4. Test full payment flow end-to-end
5. Enable 3D Secure if needed
6. Review Stripe's security best practices

## Troubleshooting

**"Stripe not loaded" error:**
- Check NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is set
- Verify key is correct (should start with `pk_`)

**Webhook not triggering:**
- Verify webhook secret in .env.local
- Check Stripe Dashboard webhook logs
- Ensure endpoint is reachable

**Payment fails:**
- Check browser console for errors
- Verify test card number
- Check Stripe Dashboard for payment status
