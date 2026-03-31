# 📊 How to View TabulariumAI Results

## 🎯 Current Situation

You successfully uploaded your document:

```
✅ SUCCESS!
Session: baacd851-2a2e-4119-8993-fef1d162899d
Workflow: autoredact
Status: Processing
```

**What's happening:**
1. ✅ Document uploaded to TabulariumAI
2. ⏳ TabulariumAI backend is processing (detecting SSNs, DOBs, etc.)
3. 📨 Will send results to callback URL when done

---

## ⚠️ **The Localhost Problem**

**Current callback URL:** `http://localhost:3000/callback`

**The issue:**
- TabulariumAI backend is at: `demobackend.tabulariumai.com`
- Your server is at: `localhost:3000` (your computer)
- **Remote servers can't reach localhost!**

This is like trying to mail a letter to "your house" without an address.

---

## 🔧 **Solutions**

### **Option 1: Check Server Logs** (Current Setup)

Watch for callbacks in real-time:

```bash
# In terminal
tail -f server.log | grep -i callback
```

If TabulariumAI sends a callback, you'll see:
```
Received callback for session: baacd851-2a2e-4119-8993-fef1d162899d
Callback data: {...}
```

---

### **Option 2: Use Ngrok** (Make Localhost Public)

Make your localhost publicly accessible:

```bash
# Install ngrok (if not installed)
brew install ngrok

# Start ngrok tunnel
ngrok http 3000

# You'll get a public URL like:
# https://abc123.ngrok.io -> http://localhost:3000
```

Then update `.env`:
```env
CALLBACK_URL="https://abc123.ngrok.io/callback"
```

Restart server:
```bash
kill $(cat .server.pid)
npm start > server.log 2>&1 &
echo $! > .server.pid
```

Now TabulariumAI can send callbacks to your local server!

---

### **Option 3: Production Setup**

In production, you would:

#### 1. **Deploy to a Cloud Server**
```bash
# Deploy to Heroku, AWS, Azure, etc.
https://your-app.herokuapp.com/callback
```

#### 2. **Store Results in Database**
```typescript
// When callback is received
app.post('/callback/autoredact/redact', async (req, res) => {
  const { session, data } = req.body;

  // Store in database
  await db.results.insert({
    session: session,
    workflow: 'autoredact',
    redactions: data.redactions,
    document_url: data.document_url,
    timestamp: new Date()
  });

  res.json({ success: true });
});
```

#### 3. **Create Results API**
```typescript
// Endpoint to retrieve results
app.get('/api/results/:session', async (req, res) => {
  const results = await db.results.findOne({
    session: req.params.session
  });

  res.json(results);
});
```

#### 4. **Build Results UI**
```html
<!-- Show redacted document -->
<div class="results">
  <h2>Redaction Results</h2>
  <p>Redacted Items: {{ redactions.length }}</p>
  <iframe src="{{ document_url }}" />
</div>
```

---

## 📋 **What Results Look Like**

When TabulariumAI finishes processing, they send:

```json
{
  "session": "baacd851-2a2e-4119-8993-fef1d162899d",
  "status": "completed",
  "redactions": [
    {
      "type": "SSN",
      "page": 3,
      "location": [100, 200, 300, 220],
      "original": "***-**-1234",
      "confidence": 0.95
    },
    {
      "type": "DOB",
      "page": 5,
      "location": [150, 300, 250, 320],
      "original": "**/**/****",
      "confidence": 0.89
    }
  ],
  "document_url": "https://storage.tabulariumai.com/redacted/doc123.pdf",
  "summary": {
    "total_redactions": 15,
    "ssn_count": 3,
    "dob_count": 2,
    "account_count": 10
  }
}
```

---

## 🧪 **For Testing: Mock Callback**

You can manually test the callback endpoint:

```bash
curl -X POST http://localhost:3000/callback/autoredact/redact?sn=baacd851-2a2e-4119-8993-fef1d162899d \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer test-token" \
  -d '{
    "status": "completed",
    "redactions": [
      {"type": "SSN", "page": 1, "confidence": 0.95}
    ],
    "document_url": "https://example.com/redacted.pdf"
  }'
```

Then check server logs:
```bash
tail -20 server.log
```

---

## 🎯 **Quick Actions**

### **Right Now (Demo Mode):**

1. **Check server logs:**
   ```bash
   tail -f server.log | grep callback
   ```

2. **Wait 30-60 seconds** for processing

3. **Watch for callback** (if backend can reach you)

### **For Production:**

1. **Use ngrok** (quick solution)
   ```bash
   ngrok http 3000
   # Update CALLBACK_URL in .env
   ```

2. **Or deploy to cloud** (proper solution)
   - Heroku, AWS, Azure, etc.
   - Set public callback URL
   - Store results in database

---

## 📞 **Getting Real Credentials**

The demo backend may have limitations. For full functionality:

1. **Sign up:** https://tabulariumai.com/platform
2. **Get API key** (not demo)
3. **Set production URLs** in `.env`
4. **Configure public callback URL**

See: [CREDENTIALS_SETUP.md](./CREDENTIALS_SETUP.md)

---

## 🔍 **Debugging**

### Check if callback was received:
```bash
# Search server logs
grep -r "baacd851-2a2e-4119-8993-fef1d162899d" server.log

# Check for any callback activity
grep -i "callback" server.log | tail -20
```

### Test callback endpoint:
```bash
curl http://localhost:3000/callback/autoredact/redact?sn=test
```

### Check server is listening:
```bash
lsof -i :3000
```

---

## ✅ **Summary**

**Why you can't see results:**
- ❌ TabulariumAI can't reach `localhost:3000` from the internet

**Solutions:**
- ✅ Use **ngrok** to expose localhost
- ✅ Deploy to **cloud server** with public URL
- ✅ Check **server logs** for any callbacks
- ✅ Get **production credentials** for full features

**Next steps:**
1. Try ngrok (fastest)
2. Or check server logs
3. Or get production setup

---

**Need help setting up?** See the documentation:
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- [CREDENTIALS_SETUP.md](./CREDENTIALS_SETUP.md)
- [SERVER_STATUS.md](./SERVER_STATUS.md)
