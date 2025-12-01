# Chatbot & Database Connection Guide

## ✅ What's Working

### Database Tables (10 tables in PostgreSQL - orbit_db)
- ✅ `users` - Test users created
- ✅ `products` - 6 sample products inserted
- ✅ `inventory` - 6 inventory records with stock levels
- ✅ `plants` - Empty (optional)
- ✅ `suppliers` - Empty (optional)
- ✅ `purchase_orders` - Empty (optional)
- ✅ `sales_transactions` - Empty (optional)
- ✅ `supplier_products` - Empty (optional)
- ✅ `forecasts` - Empty (optional)
- ✅ `ai_models` - Empty (optional)

### Server Connection
- ✅ Database connected (verified by "rows: 6" in terminal logs)
- ✅ Inventory query working: `SELECT inventory JOIN products` returns 6 rows
- ✅ User authentication working
- ✅ Chat endpoint `/api/chat` is functional

## ❌ Current Issue: Gemini API Model Error

### Error Message:
```
[404 Not Found] models/gemini-pro is not found for API version v1beta
```

### Solution Applied:
Changed Gemini model from `gemini-pro` to `gemini-1.0-pro` in:
- `server/gemini.ts` (all 3 AI functions)
- `analyzeInventoryWithAI()`
- `generateProfitAnalysis()`
- `generateInventoryRecommendations()`

## 🔧 How to Test the Chatbot

### Step 1: Verify Gemini API Key
Check `.env` file has:
```
GEMINI_API_KEY=your_actual_api_key
```

### Step 2: Restart Dev Server
Stop current server and run:
```bash
pnpm dev
```

### Step 3: Login
Use test credentials:
```
Email: manager@test.com
Password: manager123
Role: manager
```

### Step 4: Ask Chatbot Questions
Examples:
- "What is the stock level of Laptop?"
- "Show me low stock products"
- "Which items are overstocked?"

## 📊 Data Currently in Database

### Products (6 items):
1. Laptop - Stock: 25, Reorder Level: 10
2. Mouse - Stock: 450, Reorder Level: 100
3. Keyboard - Stock: 80, Reorder Level: 50
4. Monitor - Stock: 5, Reorder Level: 15 (LOW STOCK)
5. USB Cable - Stock: 2000, Reorder Level: 500 (OVERSTOCKED)
6. Headphones - Stock: 15, Reorder Level: 20 (LOW STOCK)

## 🔗 Connection Details

- **Database Host:** localhost
- **Database Port:** 5432
- **Database Name:** orbit_db
- **Database User:** postgres
- **Database Password:** nehu
- **Dev Server URL:** http://localhost:8081
- **Gemini API Endpoint:** https://generativelanguage.googleapis.com/v1beta/

## ✨ Next Actions

1. **Restart server** with new Gemini model configuration
2. **Test login** with provided credentials
3. **Chat with inventory data** - Chatbot should pull data from database and provide AI responses
4. **Troubleshoot** if still getting errors:
   - Check Gemini API key in .env
   - Verify API key has access to gemini-1.0-pro model
   - Check browser console for client errors
   - Check terminal for server errors

## 📝 Important Files

- Database config: `server/db.ts`
- Gemini AI config: `server/gemini.ts`
- Chat endpoint: `server/routes/chat.ts`
- Chatbot component: `client/components/Chatbot.tsx`
