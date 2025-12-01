import { query } from "./server/db";

async function seedData() {
  try {
    console.log("Inserting products...");
    
    // Insert products
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
         ON CONFLICT (sku) DO UPDATE SET name = EXCLUDED.name
         RETURNING id`,
        [product.sku, product.name, product.category, product.unit_price, product.cost_price, product.reorder_level, product.min_order_qty]
      );
      if (result.rows.length > 0) {
        productIds.push(result.rows[0].id);
        console.log(`✅ Product: ${product.name}`);
      }
    }

    console.log("\nInserting inventory...");
    
    // Insert inventory
    const inventoryData = [
      { productIndex: 0, on_hand: 25, reserved: 5 },
      { productIndex: 1, on_hand: 450, reserved: 50 },
      { productIndex: 2, on_hand: 80, reserved: 10 },
      { productIndex: 3, on_hand: 5, reserved: 0 },
      { productIndex: 4, on_hand: 2000, reserved: 200 },
      { productIndex: 5, on_hand: 15, reserved: 3 },
    ];

    for (const inv of inventoryData) {
      if (productIds[inv.productIndex]) {
        const available = inv.on_hand - inv.reserved;
        const result = await query(
          `INSERT INTO inventory (product_id, on_hand, reserved, available)
           VALUES ($1, $2, $3, $4)
           RETURNING id`,
          [productIds[inv.productIndex], inv.on_hand, inv.reserved, available]
        );
        if (result.rows.length > 0) {
          console.log(`✅ Inventory for product ${productIds[inv.productIndex]}: ${inv.on_hand} units`);
        }
      }
    }

    console.log("\n✨ Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

seedData();
