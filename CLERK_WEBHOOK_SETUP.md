# Clerk Webhook Setup Guide

This guide explains how to configure Clerk webhooks to automatically track authentication events in your admin logs dashboard.

## Overview

The application has a webhook endpoint at `/api/webhooks/clerk` that receives and processes authentication events from Clerk. These events are automatically logged and viewable in the admin dashboard at `/admin/logs`.

## Webhook Events Tracked

The webhook handles the following Clerk events:
- `session.created` - User signs in
- `session.ended` - User signs out  
- `session.removed` - Session removed (forced logout)
- `session.revoked` - Session revoked (security action)
- `user.created` - New user registration

## Configuration Steps

### 1. Get Your Webhook Endpoint URL

Your webhook endpoint URL will be:
```
https://your-domain.vercel.app/api/webhooks/clerk
```

Replace `your-domain.vercel.app` with your actual Vercel deployment URL.

### 2. Configure Webhook in Clerk Dashboard

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Select your application
3. Navigate to **Webhooks** in the sidebar
4. Click **+ Add Endpoint**
5. Enter your webhook URL: `https://your-domain.vercel.app/api/webhooks/clerk`
6. Select the events to subscribe to:
   - ✅ `session.created`
   - ✅ `session.ended`
   - ✅ `session.removed`
   - ✅ `session.revoked`
   - ✅ `user.created`
7. Click **Create**

### 3. Get the Webhook Signing Secret

After creating the webhook:
1. Click on your newly created webhook endpoint
2. Copy the **Signing Secret** (starts with `whsec_...`)
3. Keep this secret safe - you'll need it for the next step

### 4. Add Secret to Vercel Environment Variables

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add a new variable:
   - **Name**: `CLERK_WEBHOOK_SECRET`
   - **Value**: Your webhook signing secret (e.g., `whsec_abc123...`)
   - **Environment**: Check all (Production, Preview, Development)
5. Click **Save**
6. Redeploy your application for the changes to take effect

### 5. Test the Webhook

1. In Clerk Dashboard, go back to your webhook
2. Click **Testing** tab
3. Select an event (e.g., `session.created`)
4. Click **Send Example**
5. You should see a `200 OK` response
6. Check `/admin/logs` in your app - you should see the test event

## Local Development Setup

For local testing with webhooks:

1. Install Clerk CLI:
   ```bash
   npm install -g @clerk/clerk-cli
   ```

2. Start local webhook forwarding:
   ```bash
   clerk listen --forward-to http://localhost:3000/api/webhooks/clerk
   ```

3. Add the webhook secret to `.env.local`:
   ```bash
   CLERK_WEBHOOK_SECRET=whsec_your_local_secret
   ```

## Verification

The webhook endpoint automatically:
- Verifies the signature using Svix
- Validates the webhook secret
- Logs events to the auth logger
- Returns appropriate status codes

## Security Features

✅ **Signature Verification**: Uses Svix to verify webhook authenticity  
✅ **Secret Validation**: Requires valid webhook secret  
✅ **Type Safety**: TypeScript definitions for all events  
✅ **Error Handling**: Graceful error handling and logging  
✅ **Rate Limiting**: Protected by server-side rate limiting  

## Troubleshooting

### Webhook Returns 400 Error
- Check that `CLERK_WEBHOOK_SECRET` is set correctly in Vercel
- Verify the secret matches the one in Clerk Dashboard
- Ensure you redeployed after adding the environment variable

### No Events Appearing in Logs
- Verify webhook is enabled in Clerk Dashboard
- Check the webhook URL is correct
- Test the webhook using Clerk's testing feature
- Check Vercel deployment logs for errors

### Events Not Tracked Locally
- Make sure you're using `clerk listen` for local development
- Check that webhook secret in `.env.local` matches
- Verify the forwarding URL is correct

## Alternative: Client-Side Tracking

The application also tracks events client-side using the `AuthEventTracker` component. This works independently of webhooks and will track:
- Sign-ins (when user authenticates)
- Sign-outs (when user logs out)

Client-side tracking is automatically enabled and requires no additional configuration.

## Admin Dashboard Access

To view tracked events:
1. Sign in with an admin account (role: `admin`)
2. Navigate to `/admin/logs`
3. View real-time authentication events, statistics, and search/filter logs

For demo purposes, you can run:
```bash
node scripts/populate-demo-logs.js
```

This will add sample authentication events to test the UI.
