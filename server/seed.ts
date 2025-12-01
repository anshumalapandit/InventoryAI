import { query } from "./db";

async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...");

    // Insert test user
    const userResult = await query(
      `INSERT INTO users (email, password, role, name) 
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO NOTHING
       RETURNING id`,
      ["test@inventory.com", "$2b$10$YIjlrJxJx8c8e2Y4Z8Z4ZeZ4ZeZ4ZeZ4ZeZ4ZeZ4ZeZ4ZeZ4ZeZ4Z", "manager", "Test Manager"]
    );

    // Insert sample products
    const products = [
      { sku: "PROD001", name: "Laptop", category: "Electronics", unit_price: 1200, cost_price: 800, reorder_level: 10, min_order_qty: 5 },
      { sku: "PROD002", name: "Mouse", category: "Accessories", unit_price: 50, cost_price: 20, reorder_level: 100, min_order_qty: 50 },
      { sku: "PROD003", name: "Keyboard", category: "Accessories", unit_price: 150, cost_price: 60, reorder_level: 50, min_order_qty: 25 },
      { sku: "PROD004", name: "Monitor", category: "Electronics", unit_price: 400, cost_price: 250, reorder_level: 15, min_order_qty: 5 },
      { sku: "PROD005", name: "USB Cable", category: "Cables", unit_price: 10, cost_price: 3, reorder_level: 500, min_order_qty: 100 },
      { sku: "PROD006", name: "Headphones", category: "Audio", unit_price: 200, cost_price: 80, reorder_level: 20, min_order_qty: 10 },
    ];

    const productIds: number[] = [];

    for (const product of products) {
      const result = await query(
        `INSERT INTO products (sku, name, category, unit_price, cost_price, reorder_level, min_order_qty)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (sku) DO NOTHING
         RETURNING id`,
        [product.sku, product.name, product.category, product.unit_price, product.cost_price, product.reorder_level, product.min_order_qty]
      );

      if (result.rows.length > 0) {
        productIds.push(result.rows[0].id);
        console.log(`✅ Product added: ${product.name}`);
      }
    }

    // Insert inventory for each product
    const inventoryData = [
      { productIndex: 0, on_hand: 25, reserved: 5 },  // Laptop: 25 in stock
      { productIndex: 1, on_hand: 450, reserved: 50 }, // Mouse: 450 in stock
      { productIndex: 2, on_hand: 80, reserved: 10 },  // Keyboard: 80 in stock
      { productIndex: 3, on_hand: 5, reserved: 0 },    // Monitor: LOW STOCK
      { productIndex: 4, on_hand: 2000, reserved: 200 }, // USB Cable: OVERSTOCKED
      { productIndex: 5, on_hand: 15, reserved: 3 },   // Headphones: LOW STOCK
    ];

    for (const inv of inventoryData) {
      if (productIds[inv.productIndex]) {
        const available = inv.on_hand - inv.reserved;
        await query(
          `INSERT INTO inventory (product_id, on_hand, reserved, available)
           VALUES ($1, $2, $3, $4)`,
          [productIds[inv.productIndex], inv.on_hand, inv.reserved, available]
        );
        console.log(`✅ Inventory added for product ID ${productIds[inv.productIndex]}`);
      }
    }

    console.log("\n✨ Database seeding completed successfully!");
    console.log(`📦 Total products added: ${productIds.length}`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
