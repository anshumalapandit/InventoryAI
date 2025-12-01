# Deployment Guide - Render.com

## Prerequisites
- GitHub account with repository pushed
- Render.com account (free tier available)
- PostgreSQL database (Render provides)

## Step-by-Step Deployment

### 1. Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Create render.yaml
This file is already in your repo and defines services.

### 3. Deploy on Render

#### Option A: Using render.yaml (Recommended)
1. Go to https://render.com
2. Click "New +" → "Blueprint"
3. Connect your GitHub repository
4. Render will read `render.yaml` and create all services

#### Option B: Manual Setup

**Create Web Service (Frontend + Node Backend):**
1. New → Web Service
2. Connect GitHub repo
3. Settings:
   - Name: `inventoryai-frontend`
   - Runtime: Node
   - Build Command: `pnpm install && pnpm build`
   - Start Command: `pnpm start`
   - Environment: Add all `.env` variables

**Create Background Worker (Python API):**
1. New → Background Worker
2. Connect same repo
3. Settings:
   - Name: `inventoryai-backend`
   - Runtime: Python
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `cd backend && uvicorn predict_api:app --host 0.0.0.0 --port 8000`
   - Environment: `PORT=8000`

**Create PostgreSQL Database:**
1. New → PostgreSQL
2. Name: `inventoryai-db`
3. Copy connection string to `.env`

### 4. Environment Variables
Add these in Render dashboard:
```
DATABASE_URL=postgresql://...
GROQ_API_KEY=your_key_here
JWT_SECRET=your_secret_here
NODE_ENV=production
```

### 5. Connect Services

Update environment variables in services to point to each other:
```
BACKEND_URL=https://inventoryai-backend.onrender.com
DATABASE_URL=postgresql://...
```

## Common Issues & Fixes

### Issue: "Module not found"
**Fix:** Make sure `requirements.txt` exists in backend/

### Issue: Database connection fails
**Fix:** Check `DATABASE_URL` in environment variables

### Issue: Frontend can't reach backend
**Fix:** Update proxy in `vite.config.ts` to use backend URL

### Issue: Model file not found
**Fix:** Upload `lightgbm_model.pkl` to Render storage or use environment variable

## Monitoring
- View logs: Dashboard → Service → Logs
- Check health: Dashboard → Service → Health
- View metrics: Dashboard → Metrics

## Costs
- Free tier: 750 hours/month (1 service)
- Pro tier: $7+/month per service
- Database: Free tier available

## Support
- Render Docs: https://render.com/docs
- Troubleshooting: https://render.com/docs/troubleshooting
