# 🚀 Deploy to Render (5 minutes)

Your code is ready to deploy! Everything is configured.

**GitHub Repo:** https://github.com/amdv-og/ai_agent_core_deployed

## Quick Deploy Steps

### 1. Sign up/Login to Render
Go to: https://dashboard.render.com/register

- Sign in with GitHub (recommended)
- Authorize Render to access your repos

### 2. Create New Web Service
Click: https://dashboard.render.com/create?type=web

Or:
1. Click "New +" button
2. Select "Web Service"

### 3. Connect Your Repository
1. Find: **amdv-og/ai_agent_core_deployed**
2. Click "Connect"

### 4. Configure Service (Render auto-detects from render.yaml)
The `render.yaml` file configures everything automatically:

- **Name:** ai-agent-core
- **Runtime:** Node
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Plan:** Free

Just click **"Create Web Service"**

### 5. Wait for Deployment (~3-5 minutes)
- Render will install dependencies
- Start your server
- Give you a public URL like: `https://ai-agent-core.onrender.com`

### 6. Update CALLBACK_URL

Once deployed, Render will give you a URL (e.g., `https://ai-agent-core-xyz.onrender.com`)

**Important:** You need to update the CALLBACK_URL environment variable:

1. Go to your service dashboard
2. Click "Environment"
3. Find `CALLBACK_URL`
4. Change it to: `https://your-actual-url.onrender.com/callback`
5. Click "Save Changes"
6. Service will auto-redeploy

### 7. Test Your Deployment

Once deployed, open:
```
https://your-url.onrender.com/api/callbacks
```

You should see:
```json
{"total":0,"callbacks":[]}
```

### 8. Upload a Document

1. Open: `https://your-url.onrender.com/test-upload.html`
2. Upload a PDF with workflow: **autoredact**
3. Wait 30-60 seconds

### 9. Check Results

Open: `https://your-url.onrender.com/check-results.html`

Enter your session ID and click "Check Status"

You'll see:
- Callback data
- Redactions found
- **Document URL** - The redacted PDF!

---

## Troubleshooting

### Free Tier Limitations
- Render free tier spins down after 15 min of inactivity
- First request after spin-down takes ~30-60 seconds to wake up
- This is normal for free tier

### If deployment fails:
1. Check build logs in Render dashboard
2. Verify Node version: 22.x
3. Check that `npm install` succeeded

### If callbacks don't arrive:
1. Verify CALLBACK_URL in Environment settings
2. Make sure it ends with `/callback`
3. Check service logs for incoming requests

---

## Alternative: One-Click Deploy

Click this button (once you're logged into Render):

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/amdv-og/ai_agent_core_deployed)

---

## Environment Variables (Pre-configured)

All environment variables are set in `render.yaml`:

- `API_KEY`: Demo credentials
- `CALLBACK_URL`: Your Render URL (update after deploy)
- `SESSION_URL`: TabulariumAI backend
- `INDEX_URL`: TabulariumAI backend
- `FEEDBACK_URL`: TabulariumAI backend
- `COMPUTE_URL`: TabulariumAI backend
- `RECORD_URL`: TabulariumAI backend
- `REDACT_URL`: TabulariumAI backend
- `REPROCESS_URL`: TabulariumAI backend

---

## Next Steps

After successful deployment:

1. **Get production credentials:**
   - Sign up: https://tabulariumai.com/platform
   - Replace `API_KEY` in Render environment variables

2. **Add database:**
   - Replace `ResultsStore` in-memory storage
   - Use Render PostgreSQL add-on

3. **Monitor:**
   - View logs in Render dashboard
   - Set up alerts for errors

---

## Cost

- **Free tier:** Perfect for testing
  - 750 hours/month
  - Spins down after inactivity
  - $0/month

- **Paid tier ($7/month):**
  - Always running
  - No spin-down
  - Faster performance

---

## Need Help?

Open the Render dashboard and check:
- **Logs:** See realtime server output
- **Events:** Deployment history
- **Metrics:** CPU/Memory usage
- **Environment:** Update variables
