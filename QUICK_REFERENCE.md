# AI Agent Core - Quick Reference

## 🚀 Getting Started in 60 Seconds

```bash
# 1. Clone & Install
git clone https://github.com/TabulariumAI/ai_agent_core.git
cd ai_agent_core
npm install

# 2. Run Tests
npm test

# 3. Start Server
npm start
```

**Server URL:** http://localhost:3000

---

## 📡 API Endpoints Quick Reference

| Workflow | Endpoint | Purpose |
|----------|----------|---------|
| **Index** | `POST /index` | Extract metadata |
| **Calc** | `POST /calc` | Calculate fees |
| **Redact** | `POST /redact` | Manual redaction |
| **AutoRedact** | `POST /autoredact` | Auto redaction |
| **AutoRecord** | `POST /autorecord` | Full automation |
| **Provision** | `POST /provision` | Document prep |
| **Endorse** | `POST /endorse` | Add stamps |
| **Reprocess** | `POST /reprocess` | Re-analyze |

---

## 🧪 Quick Test Commands

### Test Index Endpoint
```bash
curl -X POST http://localhost:3000/index \
  -F "file=@document.pdf" \
  -F 'choice={"items":[{"service":"Recognition","level":3}]}'
```

### Test Fee Calculation
```bash
curl -X POST http://localhost:3000/calc \
  -F "file=@deed.pdf" \
  -F 'choice={"items":[{"service":"Compute","level":2}]}'
```

### Test Auto-Redaction
```bash
curl -X POST http://localhost:3000/autoredact \
  -F "file=@sensitive.pdf" \
  -F 'choice={"items":[{"service":"AutoRedact","level":3}]}'
```

---

## 📝 Choice Parameter Format

```json
{
  "items": [
    {
      "service": "ServiceName",
      "level": 1-3
    }
  ]
}
```

**Service Names:**
- `Recognition` - Document recognition/OCR
- `Compute` - Fee calculation
- `Redact` - Redaction
- `AutoRedact` - Auto redaction
- `AutoRecord` - Full automation
- `Provision` - Document prep
- `Endorse` - Endorsements
- `Reprocess` - Reprocessing

**Levels:**
- `1` - Basic (fastest)
- `2` - Standard (balanced)
- `3` - Advanced (most accurate)

---

## 🔐 Environment Setup

Create `.env.local`:

```env
# Required
API_KEY="your-org:your-key"
CALLBACK_URL="http://localhost:3000/callback"

# Backend URLs
SESSION_URL="https://api.tabulariumai.com/v1"
INDEX_URL="https://api.tabulariumai.com/v1"
COMPUTE_URL="https://api.tabulariumai.com/v1"
RECORD_URL="https://api.tabulariumai.com/v1"
REDACT_URL="https://api.tabulariumai.com/v1"
REPROCESS_URL="https://api.tabulariumai.com/v1"
FEEDBACK_URL="https://api.tabulariumai.com/v1"
```

---

## 📊 Common Response Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad request (invalid parameters) |
| 404 | Not found |
| 500 | Server error |

---

## 🧩 TypeScript Examples

### Simple Index Request
```typescript
import FormData from 'form-data';
import fs from 'fs';
import axios from 'axios';

const form = new FormData();
form.append('file', fs.createReadStream('deed.pdf'));
form.append('choice', JSON.stringify({
  items: [{ service: 'Recognition', level: 3 }]
}));

const response = await axios.post(
  'http://localhost:3000/index',
  form,
  { headers: form.getHeaders() }
);

console.log('Session:', response.data.session);
```

### Handle Callback Results
```typescript
app.post('/index/callback', (req, res) => {
  const { session, metadata } = req.body;

  // Process results
  console.log('Grantor:', metadata.indexes.find(i => i.name === 'grantor')?.value);
  console.log('Grantee:', metadata.indexes.find(i => i.name === 'grantee')?.value);

  res.status(200).json({});
});
```

---

## 🐍 Python Example

```python
import requests

files = {'file': open('document.pdf', 'rb')}
data = {
    'choice': '{"items":[{"service":"Recognition","level":3}]}'
}

response = requests.post(
    'http://localhost:3000/index',
    files=files,
    data=data
)

print(f"Session: {response.json()['session']}")
```

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Specific test file
npm test -- src/tests/integration/indexController.test.ts

# With coverage
npm test -- --coverage
```

**Current Status:** ✅ 50/51 tests passing (98%)

---

## 📁 Project Structure

```
src/
├── api/              REST controllers
├── application/      Business logic
├── core/             Domain entities
├── infrastructure/   External clients
└── tests/            Test suites
```

---

## 🛠️ Development Commands

```bash
npm start         # Production server
npm run dev       # Dev with auto-reload
npm run build     # Compile TypeScript
npm test          # Run tests
```

---

## 📚 Full Documentation

| Document | What's Inside |
|----------|---------------|
| [README.md](./README.md) | Project overview & quick start |
| [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) | Complete API reference |
| [TESTING_GUIDE.md](./TESTING_GUIDE.md) | Testing instructions |
| [CREDENTIALS_SETUP.md](./CREDENTIALS_SETUP.md) | Get API credentials |
| [openapi.yaml](./openapi.yaml) | OpenAPI specification |
| [postman-collection.json](./postman-collection.json) | Postman tests |

---

## 🎯 Common Use Cases

### Extract Deed Information
```bash
curl -X POST http://localhost:3000/index \
  -F "file=@deed.pdf" \
  -F 'choice={"items":[{"service":"Recognition","level":3}]}'
```

### Calculate Recording Fees
```bash
curl -X POST http://localhost:3000/calc \
  -F "file=@deed.pdf" \
  -F 'choice={"items":[{"service":"Compute","level":2}]}'
```

### Redact Sensitive Information
```bash
curl -X POST http://localhost:3000/autoredact \
  -F "file=@document.pdf" \
  -F 'choice={"items":[{"service":"AutoRedact","level":3}]}'
```

### Complete Recording Workflow
```bash
curl -X POST http://localhost:3000/autorecord \
  -F "file=@deed.pdf" \
  -F 'choice={"items":[{"service":"AutoRecord","level":3}]}'
```

---

## 🆘 Troubleshooting

### Server won't start
```bash
# Check if port 3000 is in use
lsof -i :3000

# Kill existing process
kill -9 $(lsof -t -i:3000)

# Try again
npm start
```

### Tests failing
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm test
```

### API returning 404
- Verify server is running on port 3000
- Check endpoint URL (e.g., `/index` not `/index/`)
- Ensure file is attached with key `file`

### Invalid choice error
- Verify JSON format: `{"items":[{...}]}`
- Check service name spelling
- Ensure level is 1, 2, or 3

---

## 💡 Pro Tips

1. **Use level 3 for production** - Most accurate results
2. **Test with demo credentials first** - Before production
3. **Implement callback handlers** - Don't poll for results
4. **Validate file types** - PDF, TIFF recommended
5. **Monitor API usage** - Check TabulariumAI dashboard

---

## 🔗 Quick Links

- **Platform:** https://tabulariumai.com/platform
- **Documentation:** https://tabulariumai.com/resources
- **GitHub:** https://github.com/TabulariumAI/ai_agent_core
- **Support:** support@tabulariumai.com

---

## 🎓 Learning Path

1. ✅ Install and run tests
2. ✅ Start local server
3. ✅ Test with sample documents
4. ✅ Review API documentation
5. ✅ Get production credentials
6. ✅ Build your integration
7. ✅ Deploy to production

---

**Need help?** Check the full [API Documentation](./API_DOCUMENTATION.md) or [Testing Guide](./TESTING_GUIDE.md)

🚀 **Happy coding!**
