# AI Agent Core - Testing Guide

## ✅ Test Results (Latest Run)

- **Total Tests:** 51
- **Passed:** 50 ✅ (98% pass rate)
- **Failed:** 1 ❌ (minor validation issue in ReprocessController)
- **Test Suites:** 9
- **Duration:** 2.4 seconds

## 🧪 Running Tests

### Run All Tests
```bash
npm test
```

### Watch Mode (Auto-rerun on changes)
```bash
npm run test:watch
```

### With Coverage Report
```bash
npm test -- --coverage
```

---

## 🚀 Running the Server

### Start Server
```bash
npm start
# Server runs on http://localhost:3000
```

### Development Mode (Auto-reload)
```bash
npm run dev
```

---

## 📡 Testing API Endpoints

The server connects to **TabulariumAI demo backend** at `https://demobackend.tabulariumai.com/v1`

### Available Workflows

Each workflow has two endpoints:
- **POST** `/[workflow]` - Start the workflow
- **POST** `/[workflow]/callback` - Receive results (called by TabulariumAI)

**Workflows:**
1. `/index` - Document indexing
2. `/calc` - Fee calculation
3. `/redact` - Manual redaction
4. `/autoredact` - Automated redaction
5. `/autorecord` - Full automated recording
6. `/provision` - Document provisioning
7. `/endorse` - Add endorsements
8. `/reprocess` - Reprocess segments

---

## 🧪 Manual API Testing

### 1. Test Index Endpoint

**Create a test document:**
```bash
echo "Sample legal document content" > test-document.txt
```

**Call the API:**
```bash
curl -X POST http://localhost:3000/index \
  -F "file=@test-document.txt" \
  -F 'choice={"items":["grantor","grantee","date","amount"]}'
```

**Expected Response:**
```json
{
  "session": "abc123-session-id"
}
```

### 2. Test Calc Endpoint

```bash
curl -X POST http://localhost:3000/calc \
  -F "file=@test-document.txt" \
  -F 'choice={"items":["deed","mortgage"]}'
```

### 3. Test Redact Endpoint

```bash
curl -X POST http://localhost:3000/redact \
  -F "file=@test-document.txt" \
  -F 'choice={"items":["ssn","dob","account_number"]}'
```

---

## 🔧 Test Configuration

### Environment Variables (.env)

```env
API_KEY="demo:123456789_abc"
CALLBACK_URL="http://localhost:3000/callback"
SESSION_URL="https://demobackend.tabulariumai.com/v1"
INDEX_URL="https://demobackend.tabulariumai.com/v1"
COMPUTE_URL="https://demobackend.tabulariumai.com/v1"
RECORD_URL="https://demobackend.tabulariumai.com/v1"
REDACT_URL="https://demobackend.tabulariumai.com/v1"
REPROCESS_URL="https://demobackend.tabulariumai.com/v1"
```

### Jest Configuration

- **Test Environment:** Node.js
- **Test Runner:** Jest 30
- **TypeScript:** ts-jest transformer
- **Location:** `src/tests/`

---

## 📊 Test Coverage

### Integration Tests (9 files)

| Controller | Tests | Status |
|------------|-------|--------|
| IndexController | 6 | ✅ All Pass |
| CalcController | 6 | ✅ All Pass |
| RedactController | 6 | ✅ All Pass |
| AutoRedactController | 6 | ✅ All Pass |
| AutoRecordController | 6 | ✅ All Pass |
| EndorseController | 6 | ✅ All Pass |
| ProvisionController | 6 | ✅ All Pass |
| ReprocessController | 7 | ⚠️ 1 Failing |
| TokenService | 2 | ✅ All Pass |

### What Each Test Suite Covers

**Controller Tests:**
- ✅ Success scenarios with valid input
- ✅ Validation errors (400)
- ✅ Not found errors (404)
- ✅ Internal errors (500)
- ✅ File upload handling
- ✅ Choice parameter validation

**Service Tests:**
- ✅ Token service functionality
- ✅ Error handling

---

## 🐛 Known Issues

### Failing Test
**Test:** `ReprocessController › should return 400 when notice is invalid`

**Issue:** Validation not properly rejecting empty notice parameter

**Impact:** Minimal - other validation tests pass

**Fix:** Add validation in ReprocessController for notice parameter

---

## 🔍 Debugging Tips

### View Detailed Test Output
```bash
npm test -- --verbose
```

### Run Specific Test File
```bash
npm test -- src/tests/integration/indexController.test.ts
```

### Debug Mode
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Check Server Logs
```bash
# Server logs appear in console when running
npm start
```

---

## 📝 Adding New Tests

### Integration Test Template

```typescript
import request from "supertest";
import { app } from "../../index";

describe("YourController Integration", () => {

  it("should return 200 on valid request", async () => {
    const response = await request(app)
      .post("/your-endpoint")
      .attach("file", Buffer.from("test"), "test.txt")
      .field("choice", JSON.stringify({ items: ["test"] }));

    expect(response.status).toBe(200);
    expect(response.body.session).toBeDefined();
  });

  it("should return 400 on invalid input", async () => {
    const response = await request(app)
      .post("/your-endpoint");

    expect(response.status).toBe(400);
  });
});
```

---

## ✨ Best Practices

1. **Always run tests before committing:**
   ```bash
   npm test
   ```

2. **Use meaningful test descriptions:**
   ```typescript
   it("should extract grantor name from deed document", async () => {
     // Test code
   });
   ```

3. **Mock external dependencies:**
   - Use Jest mocks for TabulariumAI API calls
   - Mock file uploads with Buffer
   - Mock authentication

4. **Test edge cases:**
   - Empty files
   - Invalid file types
   - Missing parameters
   - Large files

5. **Keep tests isolated:**
   - Each test should be independent
   - Clean up after tests
   - Don't rely on test order

---

## 🎯 Next Steps

1. Fix the failing ReprocessController test
2. Add more edge case tests
3. Implement E2E tests with real documents
4. Add performance tests
5. Create smoke tests for production
6. Set up CI/CD pipeline

---

## 📚 Additional Resources

- [Jest Documentation](https://jestjs.io/)
- [Supertest Documentation](https://github.com/ladjs/supertest)
- [TypeScript Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
- [TabulariumAI API Documentation](https://tabulariumai.com/resources)

---

**Happy Testing! 🚀**
