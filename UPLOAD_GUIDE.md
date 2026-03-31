# 📤 How to Upload and Test Documents

## Method 1: cURL (Command Line) ⚡

### Simple Upload
```bash
curl -X POST http://localhost:3000/index \
  -F "file=@/path/to/your/document.pdf" \
  -F 'choice={"items":[{"service":"Recognition","level":3}]}'
```

### Example Workflows

**1. Index a Deed:**
```bash
curl -X POST http://localhost:3000/index \
  -F "file=@/Users/mdellavolpe/Downloads/deed.pdf" \
  -F 'choice={"items":[{"service":"Recognition","level":3}]}'
```

**2. Calculate Fees:**
```bash
curl -X POST http://localhost:3000/calc \
  -F "file=@/Users/mdellavolpe/Downloads/mortgage.pdf" \
  -F 'choice={"items":[{"service":"Compute","level":2}]}'
```

**3. Auto-Redact Document:**
```bash
curl -X POST http://localhost:3000/autoredact \
  -F "file=@/Users/mdellavolpe/Downloads/sensitive-doc.pdf" \
  -F 'choice={"items":[{"service":"AutoRedact","level":3}]}'
```

**4. Full Automated Recording:**
```bash
curl -X POST http://localhost:3000/autorecord \
  -F "file=@/Users/mdellavolpe/Downloads/document.pdf" \
  -F 'choice={"items":[{"service":"AutoRecord","level":3}]}'
```

---

## Method 2: Postman (GUI) 🎨

### Setup (One Time)

1. **Open Postman**
2. **Import Collection:**
   - Click "Import"
   - Select `postman-collection.json` from the project folder
   - Collection appears in left sidebar

3. **Set Base URL:**
   - Click "Variables" tab
   - Set `baseUrl` = `http://localhost:3000`

### Upload a Document

1. **Select an endpoint** (e.g., "Index Workflow → Start Indexing")

2. **Configure the file:**
   - Go to "Body" tab
   - Select "form-data"
   - Find the `file` row
   - Click "Select Files"
   - Choose your PDF

3. **Click "Send"**

4. **View Response:**
   ```json
   {
     "session": "abc123-session-id"
   }
   ```

---

## Method 3: Create Test HTML Form 🌐

I'll create a simple web form for you:

```html
<!DOCTYPE html>
<html>
<head>
    <title>AI Agent Core - Test Upload</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
        }
        .form-group {
            margin-bottom: 20px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        input, select {
            width: 100%;
            padding: 8px;
            margin-bottom: 10px;
        }
        button {
            background: #007bff;
            color: white;
            padding: 10px 20px;
            border: none;
            cursor: pointer;
            font-size: 16px;
        }
        button:hover {
            background: #0056b3;
        }
        #result {
            margin-top: 20px;
            padding: 10px;
            background: #f8f9fa;
            border: 1px solid #ddd;
            white-space: pre-wrap;
        }
    </style>
</head>
<body>
    <h1>📤 AI Agent Core Test Upload</h1>

    <form id="uploadForm">
        <div class="form-group">
            <label>Workflow:</label>
            <select id="workflow" name="workflow">
                <option value="index">Index - Extract Metadata</option>
                <option value="calc">Calc - Calculate Fees</option>
                <option value="redact">Redact - Manual Redaction</option>
                <option value="autoredact">AutoRedact - Auto Redaction</option>
                <option value="autorecord">AutoRecord - Full Automation</option>
                <option value="provision">Provision - Document Prep</option>
                <option value="endorse">Endorse - Add Stamps</option>
            </select>
        </div>

        <div class="form-group">
            <label>Processing Level:</label>
            <select id="level" name="level">
                <option value="1">Level 1 - Basic (Fastest)</option>
                <option value="2">Level 2 - Standard</option>
                <option value="3" selected>Level 3 - Advanced (Most Accurate)</option>
            </select>
        </div>

        <div class="form-group">
            <label>Document (PDF, TIFF, or Image):</label>
            <input type="file" id="file" name="file" accept=".pdf,.tif,.tiff,.jpg,.jpeg,.png" required>
        </div>

        <button type="submit">Upload and Process</button>
    </form>

    <div id="result"></div>

    <script>
        document.getElementById('uploadForm').addEventListener('submit', async (e) => {
            e.preventDefault();

            const resultDiv = document.getElementById('result');
            resultDiv.textContent = 'Processing...';

            const formData = new FormData();
            const file = document.getElementById('file').files[0];
            const workflow = document.getElementById('workflow').value;
            const level = document.getElementById('level').value;

            // Get service name based on workflow
            const serviceMap = {
                'index': 'Recognition',
                'calc': 'Compute',
                'redact': 'Redact',
                'autoredact': 'AutoRedact',
                'autorecord': 'AutoRecord',
                'provision': 'Provision',
                'endorse': 'Endorse'
            };

            formData.append('file', file);
            formData.append('choice', JSON.stringify({
                items: [{ service: serviceMap[workflow], level: parseInt(level) }]
            }));

            try {
                const response = await fetch(`http://localhost:3000/${workflow}`, {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (response.ok) {
                    resultDiv.textContent = '✅ Success!\n\n' + JSON.stringify(data, null, 2);
                } else {
                    resultDiv.textContent = '❌ Error:\n\n' + JSON.stringify(data, null, 2);
                }
            } catch (error) {
                resultDiv.textContent = '❌ Network Error:\n\n' + error.message;
            }
        });
    </script>
</body>
</html>
```

Save this as `test-upload.html` and open in your browser!

---

## Method 4: Python Script 🐍

```python
import requests

# Your document path
file_path = '/Users/mdellavolpe/Downloads/document.pdf'

# Upload
with open(file_path, 'rb') as f:
    files = {'file': f}
    data = {'choice': '{"items":[{"service":"Recognition","level":3}]}'}

    response = requests.post(
        'http://localhost:3000/index',
        files=files,
        data=data
    )

    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
```

---

## Method 5: JavaScript/Node.js 📦

```javascript
const FormData = require('form-data');
const fs = require('fs');
const axios = require('axios');

async function uploadDocument() {
    const form = new FormData();

    // Your document path
    form.append('file', fs.createReadStream('/path/to/document.pdf'));
    form.append('choice', JSON.stringify({
        items: [{ service: 'Recognition', level: 3 }]
    }));

    try {
        const response = await axios.post(
            'http://localhost:3000/index',
            form,
            { headers: form.getHeaders() }
        );

        console.log('Session:', response.data.session);
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }
}

uploadDocument();
```

---

## 🎯 Quick Test Right Now!

**Tell me the path to your PDF**, and I'll run the test for you!

For example:
- `/Users/mdellavolpe/Downloads/deed.pdf`
- `/Users/mdellavolpe/Documents/mortgage.pdf`
- Or just put it in the current folder: `/Users/mdellavolpe/ai_agent_core/your-file.pdf`

---

## 📋 What to Expect

### Successful Response
```json
{
  "session": "abc123-session-id-4567"
}
```

This means the document was uploaded and processing started!

### Possible Errors

**Invalid file type:**
```json
{
  "error": "Invalid request: no file uploaded or unsupported file type"
}
```
→ Make sure it's a PDF, TIFF, or image file

**File too large:**
```json
{
  "error": "File size exceeds limit"
}
```
→ Try a smaller file (<10MB recommended)

**Server error:**
```json
{
  "error": "Processing failed: ..."
}
```
→ Check server logs: `tail -f server.log`

---

## 💡 Pro Tips

1. **Use level 3** for best accuracy (slowest)
2. **Use level 1** for quick tests (fastest)
3. **PDF files work best** (native text extraction)
4. **Images/scanned docs need OCR** (may take longer)
5. **File size < 10MB** recommended

---

**Ready to test? Just tell me where your PDF is! 🚀**
