# Predict Feature - Sales Forecasting System

## Overview

The **Predict** feature enables users to upload historical sales data (CSV) and use a trained LightGBM machine learning model to forecast next-month demand per SKU. It includes:

- CSV file upload with validation
- LightGBM model inference
- Prediction results with confidence scores
- Visual analytics (Chart.js):
  - Top 10 SKUs by predicted quantity
  - Model feature importance
  - SKU distribution (pie chart)
- Results export as CSV
- Trend analysis and confidence indicators

---

## Architecture

### Backend (`backend/predict_api.py`)

**FastAPI application** that:
- Accepts CSV uploads via `/api/predict/upload` endpoint
- Loads and caches LightGBM model at startup
- Runs predictions on raw pandas DataFrames
- Computes trend analysis (% change vs last month)
- Extracts feature importance from model
- Returns structured JSON with predictions, summaries, and feature insights
- Provides CSV download via `/api/predict/download/{job_id}`

**Key endpoints:**
- `POST /api/predict/upload` - Upload CSV and get predictions
- `GET /api/predict/download/{job_id}` - Download results CSV
- `GET /api/predict/template` - Download template CSV
- `GET /health` - Health check

**Dependencies:**
```bash
pip install fastapi uvicorn pandas joblib lightgbm python-multipart
```

**Run:**
```bash
# From project root
cd backend
uvicorn predict_api:app --reload --host 0.0.0.0 --port 8000
```

### Frontend (`client/components/PredictUpload.tsx`)

**React component** that:
- Provides file upload interface with drag-and-drop support
- Shows CSV preview (first 10 rows)
- Displays prediction results in:
  - Summary cards (total predictions, SKU count, % change)
  - Bar chart (top 10 SKUs)
  - Feature importance chart
  - Doughnut chart (top 5 SKU distribution)
  - Results table with confidence indicators
- Allows CSV download of predictions
- Shows warnings for low-confidence predictions (< 6 historical data points)

**Dependencies:**
```bash
npm install react-chartjs-2 chart.js
```

### Frontend Routes (`client/App.tsx`)

Protected route for all authenticated users:
```
/predict -> <Predict /> -> <PredictUpload />
```

### Navigation (`client/components/Layout.tsx`)

"Predict" menu item with TrendingUp icon added to sidebar for all roles (admin, manager, analyst).

---

## Expected CSV Format

**Minimal required columns:**
- `date` - Date of sale (format: YYYY-MM-DD or similar)
- `sku` - Stock Keeping Unit identifier
- `quantity` - Quantity sold

**Example:**
```csv
date,sku,quantity
2024-10-01,SKU-001,100
2024-10-02,SKU-002,150
2024-10-03,SKU-001,110
2024-10-04,SKU-003,200
...
```

A template CSV is provided via the UI template download link.

---

## Model Integration

### Model File (`model.pkl`)

Place your trained LightGBM model at:
```
./model.pkl
```

Or set the environment variable:
```bash
export MODEL_PATH=/path/to/your/model.pkl
```

### Model API Assumptions

The saved model artifact must:

1. **Have a `predict()` method** that accepts a pandas DataFrame:
   ```python
   predictions = model.predict(df)
   ```

2. **Have a `feature_importances_` attribute**:
   ```python
   importances = model.feature_importances_  # dict or array-like
   ```

3. **Handle preprocessing internally** - pass raw DataFrame directly; model must apply any required transformations (scaling, encoding, etc.)

### Example Model Save (Training Code)

```python
import lightgbm as lgb
import joblib
import pandas as pd

# Train model
X_train, y_train = ...  # Your training data
model = lgb.LGBMRegressor()
model.fit(X_train, y_train)

# Save with preprocessing included
joblib.dump(model, "model.pkl")
```

### Fallback Mock Model

If `model.pkl` is not found, the API uses a `MockModel` class for testing. It returns mock predictions (20% increase from last value) and sample feature importances.

---

## API Response Format

**Success Response** (200 OK):
```json
{
  "job_id": "abc12345",
  "status": "completed",
  "summary": {
    "total_pred": 12345,
    "num_skus": 120,
    "pct_change_vs_last_month": -2.3
  },
  "preview": [
    {
      "sku": "SKU-A",
      "last_month_qty": 100,
      "pred_qty": 120,
      "pct_change": 20.0,
      "confidence": "high",
      "data_points": 30
    },
    ...
  ],
  "feature_importances": [
    {"feature": "lag_1", "importance": 0.35},
    {"feature": "lag_2", "importance": 0.20},
    ...
  ],
  "download_url": "/api/predict/download/abc12345"
}
```

**Error Response** (400/500):
```json
{
  "detail": "File size exceeds 50MB limit" | "CSV is empty" | "Model prediction failed: ..."
}
```

---

## Configuration

### File Size Limit

In `backend/predict_api.py`:
```python
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50 MB - adjust as needed
```

### Backend URL (Frontend)

In `client/components/PredictUpload.tsx`:
```typescript
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";
```

Set environment variable:
```bash
export REACT_APP_BACKEND_URL=http://your-backend-url:8000
```

### Confidence Threshold

In `backend/predict_api.py`:
```python
confidence = "low" if len(sku_data) < 6 else "high"  # Adjust 6 as needed
```

---

## Usage Workflow

1. **Login** to the application
2. **Navigate** to "Predict" from the sidebar
3. **Download template CSV** (optional, to understand format)
4. **Upload your sales CSV**:
   - Drag and drop or click to select
   - Preview first 10 rows
   - Click "Upload & Predict"
5. **View results**:
   - Summary cards with total predictions and % change
   - Charts: Top SKUs, feature importance, distribution
   - Detailed results table with confidence indicators
6. **Download results** as CSV for further analysis
7. **Start over** to upload another file

---

## Troubleshooting

### Model not loading
- Ensure `model.pkl` exists in `./` or set `MODEL_PATH` env var
- Check file is valid joblib pickle
- Review server logs for specific error

### CSV parsing errors
- Ensure CSV has required columns: `date`, `sku`, `quantity`
- Check column names are lowercase (or match exactly)
- Verify date format is parseable by pandas

### Predictions look wrong
- Model may need preprocessing not included in artifact
- Check model was trained on same feature set
- Review "low confidence" warnings (SKUs with < 6 data points)

### Frontend upload fails
- Check backend is running (`http://localhost:8000/health`)
- Verify CORS is enabled (should be by default)
- Check file size < 50MB
- Review browser console for network errors

---

## Development Notes

### TODOs / Future Enhancements

- [ ] Add user_id header support for multi-tenancy
- [ ] Implement more sophisticated trend analysis (moving averages, etc.)
- [ ] Add SKU-level model explanations (SHAP values)
- [ ] Support batch predictions without retraining
- [ ] Add model retraining endpoint
- [ ] Implement prediction history/versioning
- [ ] Add forecast accuracy metrics (if actual outcomes available)
- [ ] Support additional export formats (Excel, PDF with charts)
- [ ] Real-time upload progress reporting (WebSocket)

### Code Modularity

The backend can be easily adapted if:
- Model API differs (e.g., `model.predict_proba()` or requires dict input)
- Additional preprocessing needed before/after prediction
- Different feature importance extraction method required

Look for `# TODO:` comments in code for adaptation points.

---

## Logging

Both backend and frontend include logging statements:

**Backend:**
- File uploads, CSV parsing, model predictions, file writes
- Errors and warnings logged to console (configurable level)

**Frontend:**
- Errors displayed in UI alerts
- Network requests can be viewed in browser DevTools

---

## Security & Best Practices

- File size limit prevents resource exhaustion
- Input validation on CSV format
- Error messages don't expose system details
- CORS configured (adjust for production)
- Model path configurable via env var
- Predictions isolated by job_id

---

## License

Part of InventoryAI application. See main project LICENSE.
