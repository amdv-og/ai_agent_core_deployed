# AI Agent Core - API Documentation

## 📖 Overview

The AI Agent Core provides a RESTful API for document processing workflows powered by TabulariumAI. This API enables automated indexing, fee calculation, redaction, and recording of official documents.

**Base URL:** `http://localhost:3000` (configurable)

**Backend:** TabulariumAI Platform (`https://demobackend.tabulariumai.com/v1`)

---

## 🔐 Authentication

All requests to TabulariumAI backend require an API key configured in `.env`:

```env
API_KEY="your-org-id:your-api-key"
```

The API key is automatically included in requests to TabulariumAI.

---

## 📡 API Endpoints

### Endpoint Pattern

Each workflow has **two endpoints**:

1. **Initiation Endpoint:** `POST /[workflow]`
   - Accepts document upload
   - Starts processing
   - Returns session ID

2. **Callback Endpoint:** `POST /[workflow]/callback`
   - Receives results from TabulariumAI
   - Processes completion
   - Returns acknowledgment

---

## 🔄 Workflows

### 1. Index - Document Indexing

**Extract metadata** from documents (names, dates, amounts, etc.)

#### POST /index

**Description:** Start document indexing workflow

**Request:**
```bash
curl -X POST http://localhost:3000/index \
  -F "file=@document.pdf" \
  -F 'choice={"items":[{"service":"Recognition","level":3}]}'
```

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| file | File | Yes | Document to index (PDF, TIFF, etc.) |
| choice | JSON | Yes | Indexing options (see Choice Schema) |

**Response (200 OK):**
```json
{
  "session": "abc123-session-id"
}
```

**Errors:**
- `400 Bad Request` - Missing file or invalid choice
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Processing error

#### POST /index/callback

**Description:** Receive indexing results from TabulariumAI

**Request Body:**
```json
{
  "session": "abc123-session-id",
  "metadata": {
    "heading": {
      "title": "Deed of Trust",
      "class": "Deed",
      "explanation": "Real property transfer document"
    },
    "indexes": [
      {
        "name": "grantor",
        "value": "John Smith",
        "page": "1",
        "aspect": "party",
        "source": "text",
        "explanation": "Person transferring property"
      }
    ],
    "secrets": [],
    "fees": []
  }
}
```

---

### 2. Calc - Fee Calculation

**Calculate recording fees** based on document type and jurisdiction

#### POST /calc

**Description:** Calculate fees for document recording

**Request:**
```bash
curl -X POST http://localhost:3000/calc \
  -F "file=@deed.pdf" \
  -F 'choice={"items":[{"service":"Compute","level":2}]}'
```

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| file | File | Yes | Document for fee calculation |
| choice | JSON | Yes | Calculation parameters |

**Response (200 OK):**
```json
{
  "session": "def456-session-id"
}
```

#### POST /calc/callback

**Request Body:**
```json
{
  "session": "def456-session-id",
  "fees": [
    {
      "name": "Recording Fee",
      "amount": 25.00,
      "explanation": "Base recording fee for first page",
      "formula": "pages * rate"
    },
    {
      "name": "State Tax",
      "amount": 0.55,
      "explanation": "Documentary transfer tax",
      "formula": "consideration * 0.0011"
    }
  ],
  "total": 25.55
}
```

---

### 3. Redact - Manual Redaction

**Redact sensitive information** with AI assistance

#### POST /redact

**Description:** Start manual redaction workflow

**Request:**
```bash
curl -X POST http://localhost:3000/redact \
  -F "file=@document.pdf" \
  -F 'choice={"items":[{"service":"Redact","level":1}]}'
```

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| file | File | Yes | Document to redact |
| choice | JSON | Yes | Redaction targets (SSN, DOB, etc.) |

**Response (200 OK):**
```json
{
  "session": "ghi789-session-id"
}
```

#### POST /redact/callback

**Request Body:**
```json
{
  "session": "ghi789-session-id",
  "redactions": [
    {
      "type": "SSN",
      "page": 1,
      "coordinates": [100, 200, 300, 220],
      "value": "***-**-1234",
      "confidence": 0.95
    }
  ],
  "document_url": "https://storage.tabulariumai.com/redacted/doc123.pdf"
}
```

---

### 4. AutoRedact - Automated Redaction

**Fully automated** redaction of protected information

#### POST /autoredact

**Description:** Automatically detect and redact sensitive data

**Request:**
```bash
curl -X POST http://localhost:3000/autoredact \
  -F "file=@document.pdf" \
  -F 'choice={"items":[{"service":"AutoRedact","level":3}]}'
```

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| file | File | Yes | Document to auto-redact |
| choice | JSON | Yes | Redaction settings |

**Auto-detected types:**
- Social Security Numbers (SSN)
- Date of Birth (DOB)
- Account Numbers
- Driver's License Numbers
- Phone Numbers
- Email Addresses

---

### 5. AutoRecord - Automated Recording

**End-to-end workflow** from intake to recording

#### POST /autorecord

**Description:** Complete automated recording workflow

**Request:**
```bash
curl -X POST http://localhost:3000/autorecord \
  -F "file=@deed.pdf" \
  -F 'choice={"items":[{"service":"AutoRecord","level":3}]}'
```

**Workflow Steps:**
1. Document recognition & classification
2. Metadata extraction (indexing)
3. Fee calculation
4. Auto-redaction (if needed)
5. Endorsement generation
6. Final recording package

---

### 6. Provision - Document Provisioning

**Prepare documents** for recording

#### POST /provision

**Description:** Provision and prepare documents

**Request:**
```bash
curl -X POST http://localhost:3000/provision \
  -F "file=@document.pdf" \
  -F 'choice={"items":[{"service":"Provision","level":2}]}'
```

---

### 7. Endorse - Add Endorsements

**Generate official stamps** and certifications

#### POST /endorse

**Description:** Add recording endorsements

**Request:**
```bash
curl -X POST http://localhost:3000/endorse \
  -F "file=@document.pdf" \
  -F 'choice={"items":[{"service":"Endorse","level":1}]}'
```

**Endorsement Types:**
- Recording stamp
- Book & page reference
- Recording date/time
- Recorder signature
- Official seal

---

### 8. Reprocess - Segment Reprocessing

**Re-analyze specific segments** of a document

#### POST /reprocess

**Description:** Reprocess a specific document segment

**Request:**
```bash
curl -X POST http://localhost:3000/reprocess \
  -F "file=@document.pdf" \
  -F "notice=segment-id-123" \
  -F 'choice={"items":[{"service":"Reprocess","level":2}]}'
```

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| file | File | Yes | Original document |
| notice | String | Yes | Segment identifier |
| choice | JSON | Yes | Reprocessing options |

---

## 📋 Common Schemas

### Choice Schema

```typescript
interface Choice {
  items: ChoiceItem[];
}

interface ChoiceItem {
  service: string;  // Service name (e.g., "Recognition")
  level: number;    // Processing level (1-3)
}
```

**Service Types:**
- `Recognition` - Document recognition/OCR
- `Compute` - Fee calculation
- `Redact` - Redaction
- `AutoRedact` - Automated redaction
- `AutoRecord` - Full automation
- `Provision` - Document preparation
- `Endorse` - Endorsement generation
- `Reprocess` - Segment reprocessing

**Levels:**
- `1` - Basic processing
- `2` - Standard processing
- `3` - Advanced processing (highest accuracy)

### MetaData Schema

```typescript
interface MetaData {
  heading: MetaHeader;
  secrets: Secret[];
  indexes: Index[];
  legals?: LegalRecord[];
  chain?: ChainRecord[];
  pages?: Pages;
  fee_factors?: FeeFactor[];
  fees?: FeeItem[];
  funds?: FundItem[];
  gaps?: [string, string, string][];
  gap_level?: string;
  anomalies?: [string, string][];
}

interface MetaHeader {
  title: string;
  secondary_titles?: string[];
  class: string;
  explanation: string;
  number?: string;
  date?: string;
  total?: number;
}

interface Index {
  name: string;        // Field name (e.g., "grantor")
  value: string;       // Extracted value
  page?: string;       // Page number
  aspect: string;      // Field category
  source: string;      // Extraction source
  explanation: string; // Field description
  ambiguous?: string;  // Ambiguity warning
  verification?: string;
  segment?: string;
  code?: string;
}

interface Secret {
  name: string;        // Secret type (e.g., "SSN")
  value: string;       // Redacted value
  page?: string;
  source: string;
  explanation: string;
  ambiguous?: string;
  code?: string;
}

interface FeeItem {
  name: string;
  amount: number;
  explanation: string;
  formula: string;
  code?: string;
}
```

---

## 🔄 Workflow Lifecycle

```
Client Application
       ↓
   POST /[workflow] (with file)
       ↓
   AI Agent Core
       ↓
   TabulariumAI Backend
   (processes document)
       ↓
   POST /[workflow]/callback
       ↓
   AI Agent Core
       ↓
   Client Application
```

---

## ⚡ Quick Start Examples

### Example 1: Index a Deed

```bash
# 1. Start indexing
RESPONSE=$(curl -s -X POST http://localhost:3000/index \
  -F "file=@deed.pdf" \
  -F 'choice={"items":[{"service":"Recognition","level":3}]}')

SESSION=$(echo $RESPONSE | jq -r '.session')
echo "Session: $SESSION"

# 2. Wait for callback (automatic)
# 3. Results delivered to /index/callback
```

### Example 2: Calculate Fees

```bash
curl -X POST http://localhost:3000/calc \
  -F "file=@mortgage.pdf" \
  -F 'choice={"items":[{"service":"Compute","level":2}]}'
```

### Example 3: Auto-Redact Document

```bash
curl -X POST http://localhost:3000/autoredact \
  -F "file=@sensitive-doc.pdf" \
  -F 'choice={"items":[{"service":"AutoRedact","level":3}]}'
```

---

## 🛠️ Testing

### Using cURL

```bash
# Create test file
echo "Test document content" > test.txt

# Test endpoint
curl -X POST http://localhost:3000/index \
  -F "file=@test.txt" \
  -F 'choice={"items":[{"service":"Recognition","level":1}]}'
```

### Using Postman

1. Create new POST request
2. URL: `http://localhost:3000/index`
3. Body → form-data:
   - Key: `file`, Type: File, Value: Select your document
   - Key: `choice`, Type: Text, Value: `{"items":[{"service":"Recognition","level":3}]}`
4. Send

### Using JavaScript

```javascript
const FormData = require('form-data');
const fs = require('fs');
const axios = require('axios');

const form = new FormData();
form.append('file', fs.createReadStream('document.pdf'));
form.append('choice', JSON.stringify({
  items: [{ service: 'Recognition', level: 3 }]
}));

const response = await axios.post('http://localhost:3000/index', form, {
  headers: form.getHeaders()
});

console.log('Session:', response.data.session);
```

### Using Python

```python
import requests

files = {'file': open('document.pdf', 'rb')}
data = {'choice': '{"items":[{"service":"Recognition","level":3}]}'}

response = requests.post('http://localhost:3000/index', files=files, data=data)
print(f"Session: {response.json()['session']}")
```

---

## 📊 Response Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 400 | Bad Request | Invalid parameters or missing required fields |
| 404 | Not Found | Resource not found |
| 500 | Internal Server Error | Server or processing error |

---

## 🔍 Error Handling

### Error Response Format

```json
{
  "error": "Error message",
  "details": "Additional context",
  "code": "ERROR_CODE"
}
```

### Common Errors

**Invalid File:**
```json
{
  "error": "Invalid request: valid file is required"
}
```

**Invalid Choice:**
```json
{
  "error": "Invalid choice: unknown service type"
}
```

**Processing Failed:**
```json
{
  "error": "Processing failed: unable to extract text from document"
}
```

---

## 🎯 Best Practices

### 1. Always Check Response Status

```javascript
if (response.status === 200) {
  const session = response.data.session;
  // Handle success
} else {
  // Handle error
}
```

### 2. Implement Callback Handlers

Your callback URL must be accessible from TabulariumAI:

```javascript
app.post('/index/callback', (req, res) => {
  const { session, metadata } = req.body;

  // Store results in database
  await db.saveIndexResults(session, metadata);

  // Acknowledge receipt
  res.status(200).json({});
});
```

### 3. Handle Timeouts

Document processing may take 10-30 seconds:

```javascript
const response = await axios.post(url, data, {
  timeout: 60000 // 60 second timeout
});
```

### 4. Validate Input Files

```javascript
const allowedTypes = ['.pdf', '.tif', '.tiff', '.jpg', '.png'];
const fileExt = path.extname(filename).toLowerCase();

if (!allowedTypes.includes(fileExt)) {
  throw new Error('Unsupported file type');
}
```

---

## 🔗 Related Documentation

- [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Testing instructions
- [CREDENTIALS_SETUP.md](./CREDENTIALS_SETUP.md) - Authentication setup
- [README.md](./README.md) - Project overview

---

## 📞 Support

For API support:
- GitHub Issues: https://github.com/TabulariumAI/ai_agent_core/issues
- TabulariumAI Support: support@tabulariumai.com
- Documentation: https://tabulariumai.com/resources

---

**Last Updated:** March 31, 2026
