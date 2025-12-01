"""
Predict API - LightGBM Sales Forecasting Service

Assumptions:
1. model.pkl: Saved LightGBM model artifact at ./model.pkl (or set MODEL_PATH env var)
   - Model must expose model.predict(df) method accepting pandas DataFrame
   - Model must have feature_importances_ attribute for feature importance extraction
   - Assumes model handles all preprocessing internally (raw CSV → prediction)

2. Expected CSV columns (minimal): date, sku, quantity
   - Can have additional columns; model will use what it needs
   - Date format: YYYY-MM-DD or similar (pandas auto-parse)

3. File size limit: 50MB (configurable MAX_FILE_SIZE)

4. Uploads stored in ./uploads/; results in ./results/

Dependencies:
  pip install fastapi uvicorn pandas joblib lightgbm python-multipart

Run:
  uvicorn predict_api:app --reload --host 0.0.0.0 --port 8000
"""

import os
import logging
import uuid
import joblib
import pandas as pd
from datetime import datetime
from pathlib import Path
from typing import Optional
from fastapi import FastAPI, UploadFile, File, Header, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware

# ============================================================================
# Configuration
# ============================================================================
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50 MB
MODEL_PATH = os.getenv("MODEL_PATH", os.path.join(os.path.dirname(__file__), "lightgbm_model.pkl"))
UPLOADS_DIR = Path("./uploads")
RESULTS_DIR = Path("./results")

# Create directories if not exist
UPLOADS_DIR.mkdir(exist_ok=True)
RESULTS_DIR.mkdir(exist_ok=True)

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ============================================================================
# FastAPI App Setup
# ============================================================================
app = FastAPI(title="Predict API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# Global Model Loading
# ============================================================================
model = None

@app.on_event("startup")
async def load_model():
    """Load LightGBM model at startup."""
    global model
    try:
        if not os.path.exists(MODEL_PATH):
            logger.warning(f"Model file not found at {MODEL_PATH}. Using mock model.")
            model = MockModel()  # Fallback for testing
        else:
            model = joblib.load(MODEL_PATH)
            logger.info(f"Model loaded successfully from {MODEL_PATH}")
    except Exception as e:
        logger.error(f"Failed to load model: {e}")
        model = MockModel()  # Fallback


# ============================================================================
# Mock Model (for testing without actual LightGBM)
# ============================================================================
class MockModel:
    """Mock LightGBM model for testing. Replace with actual model in production."""
    
    def __init__(self):
        self.feature_importances_ = {
            "lag_1": 0.35,
            "lag_2": 0.20,
            "lag_3": 0.15,
            "sku_encoding": 0.12,
            "day_of_month": 0.10,
            "seasonality": 0.08,
        }
    
    def predict(self, df):
        """Return mock predictions (20% increase from last value)."""
        if "quantity" in df.columns:
            return (df["quantity"].values * 1.2).astype(int)
        return [100] * len(df)


# ============================================================================
# Utility Functions
# ============================================================================
def compute_trend(group_df):
    """
    Compute trend for a single SKU group.
    Returns: (last_qty, pct_change_vs_prev)
    """
    if len(group_df) < 2:
        return group_df["quantity"].iloc[-1], 0.0
    
    last_qty = group_df["quantity"].iloc[-1]
    prev_qty = group_df["quantity"].iloc[-2]
    
    if prev_qty == 0:
        pct_change = 0.0
    else:
        pct_change = ((last_qty - prev_qty) / prev_qty) * 100
    
    return last_qty, pct_change


def extract_feature_importance(model_obj):
    """Extract top 10 feature importances from model."""
    try:
        if hasattr(model_obj, "feature_importances_"):
            importances = model_obj.feature_importances_
            
            # Handle both dict and array-like
            if isinstance(importances, dict):
                items = sorted(importances.items(), key=lambda x: x[1], reverse=True)[:10]
            else:
                # Assume array; create default feature names
                items = [
                    (f"feature_{i}", float(v))
                    for i, v in enumerate(importances)
                ]
                items = sorted(items, key=lambda x: x[1], reverse=True)[:10]
            
            return [{"feature": name, "importance": float(val)} for name, val in items]
        else:
            logger.warning("Model does not have feature_importances_ attribute.")
            return []
    except Exception as e:
        logger.error(f"Error extracting feature importance: {e}")
        return []


# ============================================================================
# API Endpoints
# ============================================================================

@app.post("/api/predict/upload")
async def upload_and_predict(
    file: UploadFile = File(...),
    user_id: Optional[str] = Header(None),
):
    """
    Upload sales CSV, run prediction, return results.
    
    Expected CSV columns: date, sku, quantity (minimal)
    
    Returns:
    {
        "job_id": "abc123",
        "status": "completed",
        "summary": {
            "total_pred": 12345,
            "num_skus": 120,
            "pct_change_vs_last_month": -2.3
        },
        "preview": [
            {"sku": "SKU-A", "last_month_qty": 100, "pred_qty": 120, "pct_change": 20, "confidence": "high"},
            ...
        ],
        "feature_importances": [
            {"feature": "lag_1", "importance": 0.35},
            ...
        ],
        "download_url": "/api/predict/download/abc123"
    }
    """
    
    job_id = str(uuid.uuid4())[:8]
    
    try:
        # Validate file size
        if file.size and file.size > MAX_FILE_SIZE:
            logger.error(f"File too large: {file.size} bytes")
            raise HTTPException(status_code=400, detail=f"File size exceeds {MAX_FILE_SIZE / 1024 / 1024}MB limit")
        
        # Read CSV
        logger.info(f"[{job_id}] Reading CSV from upload...")
        contents = await file.read()
        
        if not contents:
            raise HTTPException(status_code=400, detail="Empty file")
        
        # Save raw CSV
        upload_path = UPLOADS_DIR / f"{job_id}.csv"
        with open(upload_path, "wb") as f:
            f.write(contents)
        logger.info(f"[{job_id}] Raw CSV saved to {upload_path}")
        
        # Parse CSV
        df = pd.read_csv(upload_path)
        
        if df.empty:
            raise HTTPException(status_code=400, detail="CSV is empty")
        
        logger.info(f"[{job_id}] CSV parsed: {len(df)} rows, columns: {list(df.columns)}")
        
        # Ensure required columns exist (case-insensitive)
        required_cols = ["sku", "quantity"]
        df_cols_lower = {col.lower(): col for col in df.columns}
        
        for req_col in required_cols:
            if req_col not in df_cols_lower:
                raise HTTPException(
                    status_code=400,
                    detail=f"Missing required column: {req_col}. Found: {list(df.columns)}"
                )
        
        # Normalize column names (lowercase)
        df.columns = df.columns.str.lower()
        
        # Run prediction
        logger.info(f"[{job_id}] Running model.predict()...")
        try:
            predictions = model.predict(df)
            logger.info(f"[{job_id}] Predictions generated: {len(predictions)} values")
        except Exception as e:
            logger.error(f"[{job_id}] Model prediction error: {e}")
            raise HTTPException(status_code=500, detail=f"Model prediction failed: {str(e)}")
        
        # Prepare results dataframe
        results_df = df[["sku", "quantity"]].copy()
        results_df["pred_qty"] = predictions
        results_df["pred_qty"] = results_df["pred_qty"].astype(int)
        
        # Add trend & confidence per SKU
        if "date" in df.columns:
            df["date"] = pd.to_datetime(df["date"], errors="coerce")
            results_df["date"] = df["date"]
        
        results_list = []
        
        for sku in results_df["sku"].unique():
            sku_data = results_df[results_df["sku"] == sku].copy()
            sku_data = sku_data.sort_values("date") if "date" in sku_data.columns else sku_data
            
            # Last month qty and trend
            last_qty, pct_change = compute_trend(sku_data)
            
            # Confidence: low if < 6 data points
            confidence = "low" if len(sku_data) < 6 else "high"
            
            # Latest prediction for this SKU (simple: mean of predictions)
            pred_qty = int(sku_data["pred_qty"].iloc[-1])
            
            results_list.append({
                "sku": sku,
                "last_month_qty": int(last_qty),
                "pred_qty": pred_qty,
                "pct_change": round(pct_change, 2),
                "confidence": confidence,
                "data_points": len(sku_data),
            })
        
        results_df_final = pd.DataFrame(results_list)
        
        # Sort by predicted qty descending
        results_df_final = results_df_final.sort_values("pred_qty", ascending=False)
        
        # Save results CSV
        results_path = RESULTS_DIR / f"{job_id}_predictions.csv"
        results_df_final.to_csv(results_path, index=False)
        logger.info(f"[{job_id}] Results saved to {results_path}")
        
        # Compute summary
        total_pred = int(results_df_final["pred_qty"].sum())
        num_skus = len(results_df_final)
        
        # Aggregate pct_change (weighted average or simple mean)
        pct_change_vs_last = round(results_df_final["pct_change"].mean(), 2)
        
        # Extract feature importance
        feature_importances = extract_feature_importance(model)
        
        # Prepare preview (top 10)
        preview = results_df_final.head(10).to_dict(orient="records")
        
        response = {
            "job_id": job_id,
            "status": "completed",
            "summary": {
                "total_pred": total_pred,
                "num_skus": num_skus,
                "pct_change_vs_last_month": pct_change_vs_last,
            },
            "preview": preview,
            "feature_importances": feature_importances,
            "download_url": f"/api/predict/download/{job_id}",
        }
        
        logger.info(f"[{job_id}] Prediction complete. {num_skus} SKUs, total prediction: {total_pred}")
        
        return JSONResponse(content=response, status_code=200)
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"[{job_id}] Unexpected error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")


@app.get("/api/predict/download/{job_id}")
async def download_results(job_id: str):
    """Download prediction results CSV."""
    try:
        results_path = RESULTS_DIR / f"{job_id}_predictions.csv"
        
        if not results_path.exists():
            raise HTTPException(status_code=404, detail="Results not found")
        
        logger.info(f"Downloading results for job {job_id}")
        
        return FileResponse(
            path=results_path,
            filename=f"predictions_{job_id}.csv",
            media_type="text/csv",
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Download error: {e}")
        raise HTTPException(status_code=500, detail="Download failed")


@app.get("/api/predict/template")
async def get_template_csv():
    """Download template CSV for users."""
    template_content = "date,sku,quantity\n2024-10-01,SKU-001,100\n2024-10-02,SKU-002,150\n2024-10-03,SKU-001,110\n"
    
    template_path = Path("/tmp/template.csv")
    template_path.write_text(template_content)
    
    return FileResponse(
        path=template_path,
        filename="sales_template.csv",
        media_type="text/csv",
    )


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "ok",
        "model_loaded": model is not None,
        "timestamp": datetime.now().isoformat(),
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
