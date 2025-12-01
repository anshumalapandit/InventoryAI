import { Pool, QueryResult } from "pg";

// Use DATABASE_URL from environment or fallback to localhost
const DATABASE_URL = process.env.DATABASE_URL || "postgres://postgres:nehu@localhost:5432/orbit_db";

const pool = new Pool({
  connectionString: DATABASE_URL,
  // Connection timeout
  connectionTimeoutMillis: 5000,
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});

export async function query(text: string, params?: any[]): Promise<QueryResult> {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log("Query executed", { text, duration, rows: result.rowCount });
    return result;
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  }
}

export async function getClient() {
  const client = await pool.connect();
  return client;
}

export async function initializeDatabase() {
  try {
    // Create tables if they don't exist
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'manager', 'analyst')),
        name VARCHAR(255) NOT NULL,
        company VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        sku VARCHAR(100) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100),
        unit_price DECIMAL(10, 2),
        cost_price DECIMAL(10, 2),
        reorder_level INT DEFAULT 100,
        min_order_qty INT DEFAULT 50,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS inventory (
        id SERIAL PRIMARY KEY,
        product_id INT NOT NULL REFERENCES products(id),
        plant_id INT,
        on_hand INT DEFAULT 0,
        reserved INT DEFAULT 0,
        available INT DEFAULT 0,
        lead_time_days INT,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS suppliers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        contact_person VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(20),
        default_lead_time INT,
        min_order_qty INT,
        on_time_percentage DECIMAL(5, 2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS supplier_products (
        id SERIAL PRIMARY KEY,
        supplier_id INT NOT NULL REFERENCES suppliers(id),
        product_id INT NOT NULL REFERENCES products(id),
        supplier_sku VARCHAR(100),
        unit_price DECIMAL(10, 2),
        lead_time_days INT
      );

      CREATE TABLE IF NOT EXISTS sales_transactions (
        id SERIAL PRIMARY KEY,
        product_id INT NOT NULL REFERENCES products(id),
        quantity INT NOT NULL,
        sale_price DECIMAL(10, 2),
        cost_price DECIMAL(10, 2),
        profit DECIMAL(10, 2),
        profit_margin DECIMAL(5, 2),
        transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by INT REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS purchase_orders (
        id SERIAL PRIMARY KEY,
        product_id INT NOT NULL REFERENCES products(id),
        supplier_id INT NOT NULL REFERENCES suppliers(id),
        quantity INT NOT NULL,
        unit_price DECIMAL(10, 2),
        total_amount DECIMAL(12, 2),
        expected_delivery_date DATE,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by INT REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS forecasts (
        id SERIAL PRIMARY KEY,
        product_id INT NOT NULL REFERENCES products(id),
        forecast_date DATE,
        predicted_quantity INT,
        confidence_lower INT,
        confidence_upper INT,
        accuracy_percentage DECIMAL(5, 2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS plants (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        location VARCHAR(255),
        capacity INT,
        status VARCHAR(50) DEFAULT 'Operational',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS ai_models (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        model_type VARCHAR(100),
        status VARCHAR(50) DEFAULT 'Active',
        accuracy DECIMAL(5, 2),
        last_trained_date TIMESTAMP,
        data_points INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS ai_models (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        model_type VARCHAR(100),
        status VARCHAR(50) DEFAULT 'Active',
        accuracy DECIMAL(5, 2),
        last_trained_date TIMESTAMP,
        data_points INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
      CREATE INDEX IF NOT EXISTS idx_inventory_product ON inventory(product_id);
      CREATE INDEX IF NOT EXISTS idx_sales_product ON sales_transactions(product_id);
      CREATE INDEX IF NOT EXISTS idx_sales_date ON sales_transactions(transaction_date);
      CREATE INDEX IF NOT EXISTS idx_forecasts_product ON forecasts(product_id);
    `);
    
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
}

export default pool;
