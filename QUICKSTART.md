# 🚀 Quick Start - Plant Manager Dashboard

## 1️⃣ Start the Application
```bash
cd c:\Users\Anshumala\Downloads\Inventory_Mgmt_Website\InventoryWebsite
pnpm dev
```

Open browser: **http://localhost:8080**

## 2️⃣ Create an Account or Login

### Create New Account:
```
Email: manager@example.com
Password: password123
Name: John Manager
Role: manager (or admin)
```

### Or Use Credentials:
```
Email: admin@example.com
Password: admin123
Role: admin
```

## 3️⃣ Navigate to Plant Manager
From the dashboard home page:
- Look for **"Plant Manager Dashboard"** button
- Or directly visit: `http://localhost:8080/plant-manager`

## 4️⃣ Explore the Dashboard

### **Overview Section** 📊
- Real-time KPI cards
- Inventory health metrics
- Stock distribution

### **Inventory Section** 📦
- All products in database
- Current stock levels
- Lead times

### **Forecasts Section** 🎯 **← NEW!**
- 90-day LightGBM predictions
- Average accuracy: 90.71%
- Trend charts showing predicted vs actual

### **Reorder Section** 📋
- Create purchase orders
- Track order status
- Delete orders

### **Performance Section** 📈
- Product accuracy metrics
- Top performing forecasts
- Error analysis

## 5️⃣ Key Actions

### **Switch Plant**
- Use dropdown at top: "Select Plant"
- Data refreshes automatically

### **Create Purchase Order**
1. Click "Create PO" button
2. Select Product from dropdown
3. Select Supplier from dropdown
4. Enter Quantity
5. Enter Unit Price
6. Select Delivery Date
7. Click "Create"

### **Delete Purchase Order**
1. Find the PO card
2. Click "Delete" button
3. Confirm deletion

### **View Forecast Details**
1. Go to "Forecasts" section
2. See 90-day trend chart
3. Check accuracy statistics
4. Switch plants to compare

## 📊 What's Inside

### Database Seeded With:
- ✅ **5,000** LightGBM predictions
- ✅ **7** Product types
- ✅ **2** Plants/locations
- ✅ **6-month** historical data
- ✅ **90.71%** average accuracy

### Available Products:
1. LCD Monitor 24"
2. Mechanical Keyboard
3. Wireless Mouse
4. USB Cable
5. Monitor Stand
6. HDMI Cable
7. 4K Webcam
8. USB Hub
9. Laptop Cooling Pad
10. Desk Lamp

### Available Plants:
1. Delhi Warehouse
2. Mumbai Hub
3. Bangalore Center
4. Chennai Branch
5. Kolkata Store

## 🔧 Useful Commands

```bash
# Re-seed with fresh data
pnpm seed

# Check API endpoints
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8080/api/training-data/stats

# View database
psql -h localhost -U postgres -d orbit_db

# Check training data
psql -h localhost -U postgres -d orbit_db -c "SELECT COUNT(*) FROM training_data;"
```

## 🚨 Common Issues

| Issue | Solution |
|-------|----------|
| **Not seeing charts** | Make sure you selected a plant from dropdown |
| **API 401 error** | Logout and login again |
| **PO not created** | Select all fields (Product, Supplier, Qty, Price) |
| **No data in forecasts** | Data is there! Scroll in table or check stats card |
| **Plant dropdown empty** | Run `pnpm seed` again |

## 📱 Mobile Friendly?
Yes! The dashboard is fully responsive:
- Desktop: Full-width charts and tables
- Tablet: Single column with optimized spacing
- Mobile: Vertical stack with touch-friendly buttons

## 🎯 Next: Try These Features!

1. **View Overview Stats**
   - Check total inventory value
   - See critical items count
   - View health percentage

2. **Check Forecast Accuracy**
   - Scroll to Forecasts section
   - See 90-day prediction chart
   - Click on data points

3. **Create a Test PO**
   - Go to Reorder section
   - Click "Create PO"
   - Use: Product 1, Supplier 1, Qty 100, Price 1000

4. **Compare Plant Performance**
   - Switch plants using dropdown
   - Notice forecast accuracy changes
   - Check inventory levels by plant

## 📞 Need Help?

Check these files:
- **Setup Details**: `SETUP_COMPLETE.md`
- **Data Import Guide**: `.azure/LIGHTGBM_DATASET_IMPORT.md`
- **Database Schema**: See `server/db.ts`
- **API Endpoints**: See `server/index.ts`
- **Component Code**: `client/pages/PlantManager.tsx`

## 🎉 You're All Set!

The Plant Manager Dashboard is **fully operational** with:
- Dynamic real-time data
- LightGBM predictions
- Advanced visualizations
- Purchase order management
- Multi-plant analytics

**Happy exploring! 🚀**
