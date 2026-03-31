# Getting TabulariumAI Credentials

## 🔐 How to Get API Credentials

### Step 1: Create a TabulariumAI Account

1. **Visit TabulariumAI Platform:**
   - Go to: https://tabulariumai.com/platform#account

2. **Sign Up:**
   - Click "Sign Up" or "Get Started"
   - Provide your organization details
   - Select your use case (county recorder, title company, etc.)

3. **Choose a Subscription:**
   - Review the subscription tiers
   - Select based on your usage needs (pages per month)
   - Each subscription includes:
     - Dedicated API keys
     - Private storage
     - Role-based access control
     - Usage-based billing

### Step 2: Access Your API Key

Once your account is approved:

1. **Login to Dashboard:**
   - Navigate to https://tabulariumai.com/platform
   - Login with your credentials

2. **Find API Settings:**
   - Go to Account → API Keys
   - Or Settings → Integrations

3. **Generate API Key:**
   - Click "Generate New API Key"
   - Copy the key immediately (shown only once!)
   - Format: `orgid:long-alphanumeric-string`

### Step 3: Configure Your Environment

Update your `.env` file with the production credentials:

```env
# Production API Key (replace demo key)
API_KEY="your-org-id:your-actual-api-key"

# Production Callback URL (your server URL)
CALLBACK_URL="https://your-domain.com/callback"

# Production URLs (replace demo backend)
SESSION_URL="https://api.tabulariumai.com/v1"
INDEX_URL="https://api.tabulariumai.com/v1"
COMPUTE_URL="https://api.tabulariumai.com/v1"
RECORD_URL="https://api.tabulariumai.com/v1"
REDACT_URL="https://api.tabulariumai.com/v1"
REPROCESS_URL="https://api.tabulariumai.com/v1"
FEEDBACK_URL="https://api.tabulariumai.com/v1"
```

---

## 🧪 Demo vs Production

### Current Setup (Demo)

Your `.env` currently has:
```env
API_KEY="demo:123456789_abc"
SESSION_URL="https://demobackend.tabulariumai.com/v1"
```

**Demo Limitations:**
- ⚠️ Limited to sample documents
- ⚠️ May have rate limits
- ⚠️ Results may be mock data
- ⚠️ No production features

### Production Setup

```env
API_KEY="acme-county:a1b2c3d4e5f6g7h8i9j0"
SESSION_URL="https://api.tabulariumai.com/v1"
```

**Production Benefits:**
- ✅ Full document processing
- ✅ Real AI extraction
- ✅ All features enabled
- ✅ Production support
- ✅ SLA guarantees

---

## 🔒 Security Best Practices

### 1. Never Commit Credentials

Add to `.gitignore`:
```
.env
.env.local
.env.production
**/credentials.*
```

### 2. Use Environment-Specific Configs

```bash
# Development
.env.development

# Staging
.env.staging

# Production
.env.production
```

### 3. Rotate Keys Regularly

- Generate new API keys quarterly
- Revoke old keys immediately after rotation
- Track key usage in dashboard

### 4. Restrict Key Permissions

- Use different keys for different environments
- Set IP allowlists if available
- Enable webhook signature verification

---

## 🌐 Alternative: Using Demo Mode

If you don't have production credentials yet, you can test with the demo backend:

### Demo Limitations

The demo backend at `demobackend.tabulariumai.com`:
- ✅ Works for testing integration
- ✅ Returns sample responses
- ⚠️ May not process real documents
- ⚠️ Limited to specific document types

### When to Use Demo

- Initial development and testing
- CI/CD pipeline tests
- Learning the API
- Building proof-of-concepts

### When to Use Production

- Production deployments
- Real document processing
- Performance testing with real data
- Customer demonstrations

---

## 📞 Getting Support

### Contact TabulariumAI

**Sales & Account Setup:**
- Website: https://tabulariumai.com
- Email: sales@tabulariumai.com
- Request a demo or trial account

**Technical Support:**
- Check documentation: https://tabulariumai.com/resources
- API documentation: https://tabulariumai.com/resources#doc:agent_core
- Support email: support@tabulariumai.com

**Questions to Ask:**

1. What subscription tier do I need for my volume?
2. What's included in the trial period?
3. How do I get sandbox/staging credentials?
4. What are the rate limits per tier?
5. Is there an SLA for processing times?
6. What document types are supported?

---

## 🧪 Testing Before Production

### 1. Verify Demo Works

```bash
npm test
npm start

# Test with demo credentials
curl -X POST http://localhost:3000/index \
  -F "file=@test-document.pdf" \
  -F 'choice={"items":[{"service":"Recognition","level":3}]}'
```

### 2. Request Sandbox Credentials

- Ask TabulariumAI for sandbox/staging environment
- Test with real documents in non-prod environment
- Verify all workflows before going live

### 3. Monitor Usage

- Track API calls in TabulariumAI dashboard
- Monitor processing times
- Check error rates
- Review billing/usage reports

---

## ✅ Checklist

Before going to production:

- [ ] Obtained production API key from TabulariumAI
- [ ] Updated `.env` with production URLs
- [ ] Tested all workflows in sandbox
- [ ] Set up proper callback URL (accessible from TabulariumAI)
- [ ] Configured SSL/TLS for callbacks
- [ ] Set up monitoring and logging
- [ ] Reviewed security best practices
- [ ] Configured error handling
- [ ] Set up key rotation schedule
- [ ] Documented your API key location (password manager)

---

## 🚀 Next Steps After Setup

1. **Verify Connection:**
   ```bash
   npm start
   # Test with real document
   ```

2. **Monitor First Requests:**
   - Check TabulariumAI dashboard
   - Review processing logs
   - Verify callback receipts

3. **Scale Up:**
   - Adjust subscription tier as needed
   - Configure auto-scaling
   - Set up load balancing for callbacks

---

## 📚 Additional Resources

- Platform Overview: https://tabulariumai.com/platform
- API Documentation: https://tabulariumai.com/resources
- GitHub Repository: https://github.com/TabulariumAI/ai_agent_core
- Support Portal: (provided after signup)

---

**Need help?** Contact TabulariumAI support or refer to their documentation portal.
