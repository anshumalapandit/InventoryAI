import "dotenv/config";
import { query } from "./db";

async function seedTrainingData() {
  try {
    console.log("🌱 Starting to seed training data...");

    // First, ensure we have products, plants, and models
    const productCheck = await query("SELECT COUNT(*) as count FROM products");
    const plantCheck = await query("SELECT COUNT(*) as count FROM plants");
    const modelCheck = await query("SELECT COUNT(*) as count FROM ai_models");

    console.log(`✓ Products: ${productCheck.rows[0].count}`);
    console.log(`✓ Plants: ${plantCheck.rows[0].count}`);
    console.log(`✓ Models: ${modelCheck.rows[0].count}`);

    if (productCheck.rows[0].count === 0) {
      console.log("❌ No products found. Creating sample products...");
      await query(`
        INSERT INTO products (sku, name, category, unit_price, cost_price, reorder_level, min_order_qty)
        VALUES 
        ('SKU-001', 'LCD Monitor 24"', 'Electronics', 15000, 8000, 50, 10),
        ('SKU-002', 'Mechanical Keyboard', 'Electronics', 5000, 2500, 100, 25),
        ('SKU-003', 'Wireless Mouse', 'Electronics', 1500, 700, 150, 30),
        ('SKU-004', 'USB Cable', 'Accessories', 200, 80, 500, 100),
        ('SKU-005', 'Monitor Stand', 'Accessories', 3000, 1200, 30, 5),
        ('SKU-006', 'HDMI Cable', 'Accessories', 300, 100, 200, 50),
        ('SKU-007', '4K Webcam', 'Electronics', 8000, 3500, 20, 5),
        ('SKU-008', 'USB Hub', 'Accessories', 1200, 400, 100, 20),
        ('SKU-009', 'Laptop Cooling Pad', 'Accessories', 2000, 800, 40, 10),
        ('SKU-010', 'Desk Lamp', 'Accessories', 2500, 1000, 35, 8)
      `);
      console.log("✓ Sample products created");
    }

    if (plantCheck.rows[0].count === 0) {
      console.log("❌ No plants found. Creating sample plants...");
      await query(`
        INSERT INTO plants (name, location, capacity, status)
        VALUES 
        ('Delhi Warehouse', 'New Delhi', 50000, 'Operational'),
        ('Mumbai Hub', 'Mumbai', 75000, 'Operational'),
        ('Bangalore Center', 'Bangalore', 60000, 'Operational'),
        ('Chennai Branch', 'Chennai', 40000, 'Operational'),
        ('Kolkata Store', 'Kolkata', 35000, 'Operational')
      `);
      console.log("✓ Sample plants created");
    }

    if (modelCheck.rows[0].count === 0) {
      console.log("❌ No models found. Creating sample LightGBM model...");
      await query(`
        INSERT INTO ai_models (name, model_type, status, accuracy, data_points)
        VALUES 
        ('LightGBM Forecast v1.0', 'LightGBM', 'Active', 95.50, 5000)
      `);
      console.log("✓ Sample model created");
    }

    // Get IDs for relationships
    const products = await query("SELECT id FROM products LIMIT 10");
    const plants = await query("SELECT id FROM plants LIMIT 5");
    const models = await query("SELECT id FROM ai_models LIMIT 1");

    if (products.rows.length === 0 || plants.rows.length === 0 || models.rows.length === 0) {
      throw new Error("Missing required data for seeding training data");
    }

    // Check if training data already exists
    const existingData = await query("SELECT COUNT(*) as count FROM training_data");
    if (existingData.rows[0].count > 0) {
      console.log(`ℹ️  Training data already exists (${existingData.rows[0].count} rows). Skipping seed.`);
      return;
    }

    console.log("📊 Generating 5000 training data records with LightGBM forecasts...");

    // Generate training data for the past 180 days
    const trainingData = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 180);

    for (let i = 0; i < 5000; i++) {
      const dateOffset = Math.floor(Math.random() * 180);
      const date = new Date(startDate);
      date.setDate(date.getDate() + dateOffset);

      const productId = products.rows[Math.floor(Math.random() * products.rows.length)].id;
      const plantId = plants.rows[Math.floor(Math.random() * plants.rows.length)].id;
      const modelId = models.rows[0].id;

      // Generate realistic forecast data
      const historical = Math.floor(Math.random() * 500) + 50;
      const actual = Math.floor(historical * (0.85 + Math.random() * 0.3)); // Actual within ±15% of historical
      const predicted = Math.floor(historical * (0.88 + Math.random() * 0.24)); // Model tries to predict actual

      // Calculate accuracy (higher when prediction is closer to actual)
      const error = Math.abs(predicted - actual);
      const accuracy = Math.max(75, 100 - (error / actual) * 100);

      trainingData.push({
        product_id: productId,
        plant_id: plantId,
        date: date.toISOString().split('T')[0],
        historical_quantity: historical,
        predicted_quantity: predicted,
        actual_quantity: actual,
        confidence_lower: Math.floor(predicted * 0.85),
        confidence_upper: Math.floor(predicted * 1.15),
        model_id: modelId,
        accuracy_score: parseFloat(accuracy.toFixed(2)),
      });
    }

    // Batch insert for performance
    console.log("💾 Inserting 5000 records (this may take a moment)...");
    
    for (let i = 0; i < trainingData.length; i += 100) {
      const batch = trainingData.slice(i, i + 100);
      const values = batch
        .map((_, idx) => {
          const baseIdx = i + idx;
          const d = trainingData[baseIdx];
          return `(${d.product_id}, ${d.plant_id}, '${d.date}', ${d.historical_quantity}, ${d.predicted_quantity}, ${d.actual_quantity}, ${d.confidence_lower}, ${d.confidence_upper}, ${d.model_id}, ${d.accuracy_score})`;
        })
        .join(',');

      const sql = `
        INSERT INTO training_data 
        (product_id, plant_id, date, historical_quantity, predicted_quantity, actual_quantity, confidence_lower, confidence_upper, model_id, accuracy_score)
        VALUES ${values}
      `;

      await query(sql);
      
      if (i % 500 === 0) {
        console.log(`  ✓ Inserted ${i + batch.length}/5000 records`);
      }
    }

    // Verify insertion
    const countResult = await query("SELECT COUNT(*) as count FROM training_data");
    const statsResult = await query(`
      SELECT 
        COUNT(*) as total,
        AVG(accuracy_score) as avg_accuracy,
        MAX(accuracy_score) as max_accuracy,
        MIN(accuracy_score) as min_accuracy,
        COUNT(DISTINCT product_id) as unique_products,
        COUNT(DISTINCT plant_id) as unique_plants,
        MIN(date) as earliest_date,
        MAX(date) as latest_date
      FROM training_data
    `);

    const stats = statsResult.rows[0];
    console.log("\n✅ Training data seeded successfully!");
    console.log(`📈 Statistics:`);
    console.log(`   • Total Records: ${stats.total}`);
    console.log(`   • Average Accuracy: ${parseFloat(stats.avg_accuracy).toFixed(2)}%`);
    console.log(`   • Max Accuracy: ${parseFloat(stats.max_accuracy).toFixed(2)}%`);
    console.log(`   • Min Accuracy: ${parseFloat(stats.min_accuracy).toFixed(2)}%`);
    console.log(`   • Unique Products: ${stats.unique_products}`);
    console.log(`   • Unique Plants: ${stats.unique_plants}`);
    console.log(`   • Date Range: ${stats.earliest_date} to ${stats.latest_date}`);

  } catch (error) {
    console.error("❌ Error seeding training data:", error);
    process.exit(1);
  }
}

// Run the seed function
seedTrainingData().then(() => {
  console.log("\n✨ Seeding complete!");
  process.exit(0);
});
