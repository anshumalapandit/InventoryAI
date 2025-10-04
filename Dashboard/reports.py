
import streamlit as st
import pandas as pd
import psycopg2
import plotly.express as px

# ---------------- PostgreSQL Connection -----------------
def fetch_forecast_data():
    try:
        conn = psycopg2.connect(
            host="localhost",
            database="inventory_forecast",
            user="postgres",       # replace with your username
            password="Enter your paasword"    # replace with your password
        )

        query = """
        SELECT store_id, product_id, date, forecast_qty, model
        FROM forecast_results
        ORDER BY date;
        """
        df = pd.read_sql(query, conn)
        conn.close()
        return df

    except Exception as e:
        st.error(f"Error connecting to PostgreSQL: {e}")
        return pd.DataFrame()

# ---------------- Streamlit App -----------------
st.set_page_config(page_title="Inventory Forecast Dashboard", layout="wide")
st.title("📊 AI-Powered Inventory Forecast Dashboard")

# Fetch Data
df = fetch_forecast_data()

if df.empty:
    st.warning("No data available. Check PostgreSQL connection or table content.")
else:
     # Ensure 'date' is datetime
    df['date'] = pd.to_datetime(df['date'])
    # -------- Sidebar Filters --------
    st.sidebar.header("Filter Forecast")
    store = st.sidebar.selectbox("Select Store", df['store_id'].unique())
    sku   = st.sidebar.selectbox("Select SKU", df['product_id'].unique())
    start_date = st.sidebar.date_input("Start Date", pd.to_datetime(df['date'].min()))
    end_date   = st.sidebar.date_input("End Date", pd.to_datetime(df['date'].max()))
    
    # Convert to pandas Timestamp
    start_date = pd.to_datetime(start_date)
    end_date   = pd.to_datetime(end_date)

    # Filter based on selection
    filtered_df = df[
        (df['store_id'] == store) &
        (df['product_id'] == sku) &
        (df['date'] >= start_date) &
        (df['date'] <= end_date)
    ]

    st.subheader(f"Forecast for Store {store}, SKU {sku}")
    
    # Conditional formatting table
    def highlight_high(forecast_qty):
        color = 'background-color: #FF9999' if forecast_qty > filtered_df['forecast_qty'].mean() else ''
        return color

    st.dataframe(filtered_df[['date','forecast_qty','model']].style.applymap(highlight_high, subset=['forecast_qty']))

    # -------- Forecast Trend Chart --------
    st.subheader("Forecast Trend")
    fig1 = px.line(filtered_df, x='date', y='forecast_qty',
                   labels={'forecast_qty':'Forecast Quantity','date':'Date'},
                   title=f"Forecast Trend for SKU {sku} in Store {store}",
                   markers=True)
    st.plotly_chart(fig1, use_container_width=True)

    # -------- Top 10 SKUs --------
    st.subheader("Top 10 Forecasted SKUs (All Stores)")
    top_skus = df.groupby('product_id')['forecast_qty'].sum().sort_values(ascending=False).head(10).reset_index()
    fig2 = px.bar(top_skus, x='product_id', y='forecast_qty',
                  labels={'forecast_qty':'Total Forecast','product_id':'SKU'},
                  title="Top 10 Forecasted SKUs")
    st.plotly_chart(fig2, use_container_width=True)

    # -------- Download CSV --------
    csv = filtered_df.to_csv(index=False)
    st.download_button(
        label="📥 Download Filtered Forecast as CSV",
        data=csv,
        file_name='filtered_forecast.csv',
        mime='text/csv',
    )

    # -------- KPI Cards --------
    st.subheader("Key Metrics")
    col1, col2 = st.columns(2)
    col1.metric("Total Forecast Quantity", f"{filtered_df['forecast_qty'].sum():.0f}")
    col2.metric("Average Daily Forecast", f"{filtered_df['forecast_qty'].mean():.2f}")
