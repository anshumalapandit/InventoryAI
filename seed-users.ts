import { query } from "./server/db";
import bcrypt from "bcrypt";

async function seedUsers() {
  try {
    console.log("🌱 Creating test users...");

    // Create test users with proper passwords
    const users = [
      { email: "admin@test.com", password: "admin123", role: "admin", name: "Admin User", company: "Test Company" },
      { email: "manager@test.com", password: "manager123", role: "manager", name: "Manager User", company: "Test Company" },
      { email: "analyst@test.com", password: "analyst123", role: "analyst", name: "Analyst User", company: "Test Company" },
    ];

    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const result = await query(
        `INSERT INTO users (email, password, role, name) 
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password
         RETURNING id, email, role`,
        [user.email, hashedPassword, user.role, user.name]
      );

      if (result.rows.length > 0) {
        const insertedUser = result.rows[0];
        console.log(`✅ User created: ${insertedUser.email} (${insertedUser.role})`);
        console.log(`   Password: ${user.password}`);
      }
    }

    console.log("\n✨ Test users created successfully!");
    console.log("\n📝 Login Credentials:");
    console.log("   1. Email: admin@test.com | Password: admin123 | Role: admin");
    console.log("   2. Email: manager@test.com | Password: manager123 | Role: manager");
    console.log("   3. Email: analyst@test.com | Password: analyst123 | Role: analyst");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

seedUsers();
