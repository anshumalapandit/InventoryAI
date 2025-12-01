# Render Deployment Checklist

## ✅ Pre-Deployment (Do These First)

### 1. Code Ready
- [ ] All changes committed to git
- [ ] No sensitive data in code
- [ ] `.env` variables documented
- [ ] `lightgbm_model.pkl` in backend folder

### 2. Dependencies
- [ ] `requirements.txt` created ✅
- [ ] `package.json` has all dependencies
- [ ] No local-only packages

### 3. Database
- [ ] PostgreSQL connection string ready
- [ ] Migration files prepared (if any)
- [ ] Seed data ready

### 4. Environment Variables
Collect these values:
- [ ] `DATABASE_URL` - from PostgreSQL
- [ ] `GROQ_API_KEY` - from Groq console
- [ ] `JWT_SECRET` - generate random string
- [ ] `BACKEND_URL` - will be assigned by Render

---

## 🚀 Deployment Steps

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Deploy to Render"
git push origin main
```

### Step 2: Create Render Account
- Go to https://render.com
- Sign up with GitHub

### Step 3: Deploy Using Blueprint
1. Dashboard → New → Blueprint
2. Select your GitHub repo
3. Render reads `render.yaml`
4. Click "Deploy"

### Step 4: Add Environment Variables
1. Each service → Environment tab
2. Add all variables (see below)
3. Re-deploy if needed

### Step 5: Verify Deployment
- Frontend: https://inventoryai-xxxxx.onrender.com
- Backend: https://inventoryai-backend-xxxxx.onrender.com
- Database: Check Logs tab

---

## 🔑 Environment Variables to Add

**Web Service (Frontend):**
```
NODE_ENV=production
GROQ_API_KEY=gsk_xxx
JWT_SECRET=your_random_secret
DATABASE_URL=postgresql://user:pass@host/db
```

**Worker Service (Backend):**
```
PORT=8000
MODEL_PATH=./lightgbm_model.pkl
```

---

## ⚠️ Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| Build fails | Check `pnpm install` works locally |
| Database error | Verify `DATABASE_URL` format |
| Backend can't load model | Ensure `lightgbm_model.pkl` exists |
| Frontend blank page | Check browser console for errors |
| 404 on routes | Check React Router config |
| CORS errors | Add backend URL to allowed origins |

---

## 📊 Monitoring After Deployment

1. **View Logs:**
   - Dashboard → Service → Logs
   - Watch for errors in real-time

2. **Check Health:**
   - Dashboard → Service → Health
   - Green = Running well

3. **Metrics:**
   - Dashboard → Metrics
   - CPU, memory, requests

---

## 💰 Cost Estimate

| Service | Tier | Cost |
|---------|------|------|
| Frontend | Free* | $0 |
| Backend | Free* | $0 |
| Database | Free* | $0 |
| Pro (if needed) | $7/month | $21/month |

*Free tier has limited hours (750/month = ~1 service)

---

## 🎓 After Deployment

### Test Everything
1. Load homepage
2. Login/Signup
3. Upload CSV for prediction
4. Check chatbot
5. View analytics

### Monitor
- Watch logs daily
- Check error rate
- Monitor response time

### Troubleshoot
- Most common: Database connection
- Check Render logs first
- Then check app logs

---

## 🆘 Need Help?

- Render Docs: https://render.com/docs
- GitHub Issues: Report bugs here
- Email Support: render@render.com

---

## ✨ What's Next?

After deployment:
1. Set up custom domain (optional)
2. Enable auto-deploys from GitHub
3. Set up monitoring/alerts
4. Scale if needed

Good luck! 🚀
