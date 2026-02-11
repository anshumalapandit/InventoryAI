
# 🚀 AI-Inventory-Forecasting  
**AI-Powered Inventory Forecasting & Optimization System for Manufacturing**

### 🔗 **Final Project Code:**  
https://github.com/anshumalapandit/InventoryAI  
### **website link 🔗**
https://inventory-ai-rosy.vercel.app/
and backend deployed on railway. 
### **demo video link (not full demo without predict feature) 📷**
https://drive.google.com/file/d/1afM1BwABh0n3k99KqsXHGQuXRyegsYIl/view?usp=drivesdk


# 📌 Overview  
This project delivers an **AI-driven inventory forecasting and optimization system** for the manufacturing industry.  
Key capabilities include:

- SKU-level demand forecasting  
- Supplier lead-time modeling  
- Safety stock & ROP calculation  
- Inventory dashboards  
- Full-stack admin panel  
- Real-time Groq LLaMA-3 insights  
- CSV upload → AI predictions → downloadable results  

---

# ⭐ Features  
- AI/ML Forecasting Engine (LightGBM)  
- Real-Time Prediction Module  
- Groq LLaMA-3 Insights  
- Inventory CRUD + User Management  
- JWT Authentication & RBAC  
- Interactive Dashboards & Charts  
- PostgreSQL Forecast Storage  
- CSV Upload, Analysis & Export  

---

# 🏗 System Architecture  
### 1. Data Layer  
ETL, cleaning, preprocessing, feature engineering  

### 2. AI/ML Engine  
LightGBM (≈99% accuracy), forecasting, feature engineering  

### 3. Backend (Express + PostgreSQL)  
REST APIs, RBAC, CRUD, prediction module  

### 4. Frontend (React + Vite + Tailwind)  
Dashboards for Admin/Manager/Analyst  

---

# 🛠 Tech Stack  
**Frontend:** React, Vite, TailwindCSS, Radix UI  
**Backend:** Node.js, Express, TypeScript, PostgreSQL  
**AI/ML:** Python, LightGBM  
**AI Insights:** Groq API – LLaMA-3  

---

# 📚 Phase-Wise Implementation  

## Phase 1 – Preprocessing + Model Training  
- Data cleaning & feature engineering  
- Lags, rolling stats, calendar features  
- Lead-time modeling  
- Model training (LR, RF, XGBoost, LightGBM)  
- Inventory business logic (Safety Stock, ROP)

---

## Phase 2 – Forecast Storage & Dashboard  
- PostgreSQL forecast table  
- Streamlit dashboard  
- Trend charts, KPIs, download CSV  

---

## Phase 3 – Full-Stack Application  
### Backend (Express)  
- Auth (JWT)  
- Inventory CRUD  
- Forecast APIs  
- Reorder module  
- Role-based access control  

### Frontend (React)  
- Admin/Manager/Analyst dashboards  
- Forecast charts  
- Inventory tables  
- KPI cards  

---

# 🤖 AI Prediction Module  
Upload CSV → LightGBM predicts → Groq explains insights  
- Trend analysis  
- Anomaly detection  
- Seasonality  
- Risk alerts  

---

# 🔌 Groq API Integration  
Endpoints:  
```
POST /api/predict/upload
POST /api/predict/forecast
POST /api/predict/insight
GET  /api/predict/download
```

---

# 🛠 Admin Panel  
- Manage users/roles  
- Manage products  
- Manage plants  
- Inventory rules  
- Sales upload logs  

---

# ⚙️ Setup & Installation  

### Clone Repo
```
git clone https://github.com/anshumalapandit/InventoryAI
cd InventoryAI
```

### Backend Setup
```
cd backend
npm install
```

### Add .env
```
PORT=3000
DATABASE_URL=postgresql://user:password@host:5432/dbname
JWT_SECRET=your_secret
GROQ_API_KEY=your_key
```

### Run Backend
```
npm run dev
```

### Frontend Setup
```
cd ../frontend
npm install
npm run dev
```

---

# 📁 Folder Structure  
```
InventoryAI/
│── backend/
│── frontend/
│── ml/
│── README.md
```

---

# 🔮 Future Enhancements  
- Automated retraining  
- Vendor performance modeling  
- Multi-plant optimization  
- ERP integrations  
- Transformer-based forecasting  

---

# ☺️ Thank you ..
