# ✅ Server Status - RUNNING

## 🚀 Server Information

**Status:** ✅ RUNNING
**URL:** http://localhost:3000
**Process ID:** Check `.server.pid` file
**Logs:** `server.log`

---

## 🧪 Quick Test

### Test Server is Responding
```bash
curl http://localhost:3000
# Should return HTML error page (no route at /)
```

### Test Index Endpoint (requires PDF/TIFF)
```bash
# With a PDF file
curl -X POST http://localhost:3000/index \
  -F "file=@your-document.pdf" \
  -F 'choice={"items":[{"service":"Recognition","level":3}]}'

# Expected response:
# {"session":"abc123-session-id"}
```

---

## 📋 Available Endpoints

All endpoints are **POST** requests:

| Endpoint | Purpose |
|----------|---------|
| `/index` | Document indexing |
| `/calc` | Fee calculation |
| `/redact` | Manual redaction |
| `/autoredact` | Auto redaction |
| `/autorecord` | Full automation |
| `/provision` | Document prep |
| `/endorse` | Endorsements |
| `/reprocess` | Reprocessing |

---

## 🛑 Stop the Server

```bash
# Using saved PID
kill $(cat .server.pid)

# Or manually
lsof -i :3000 | grep LISTEN
kill -9 <PID>
```

---

## 🔄 Restart the Server

```bash
# Stop
kill $(cat .server.pid) 2>/dev/null

# Start
npm start > server.log 2>&1 &
echo $! > .server.pid
```

---

## 📊 Check Logs

```bash
# View all logs
cat server.log

# Tail logs in real-time
tail -f server.log

# Last 20 lines
tail -20 server.log
```

---

## 🐛 Troubleshooting

### Port 3000 Already in Use

```bash
# Find what's using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Try starting again
npm start
```

### Server Not Responding

```bash
# Check if running
lsof -i :3000

# Check logs
cat server.log

# Restart
kill $(cat .server.pid) 2>/dev/null
npm start > server.log 2>&1 &
echo $! > .server.pid
```

### Cannot Find Module Error

```bash
# Reinstall dependencies
npm install

# Try again
npm start
```

---

## 📝 Supported File Types

The API accepts these document formats:
- ✅ **PDF** (.pdf)
- ✅ **TIFF** (.tif, .tiff)
- ✅ **JPEG** (.jpg, .jpeg)
- ✅ **PNG** (.png)
- ❌ **Text files** (.txt) - NOT supported

---

## 🎯 Next Steps

1. **Get a real PDF document** to test with
2. **Review API documentation:** [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
3. **Use Postman collection:** Import [postman-collection.json](./postman-collection.json)
4. **Get production credentials:** See [CREDENTIALS_SETUP.md](./CREDENTIALS_SETUP.md)

---

## ✨ Quick Commands

```bash
# Start server
npm start

# Start with auto-reload (dev)
npm run dev

# Check if running
lsof -i :3000

# View logs
tail -f server.log

# Stop server
kill $(cat .server.pid)
```

---

**Server is ready for testing! 🚀**
