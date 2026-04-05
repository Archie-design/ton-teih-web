/**
 * migrate-firestore-to-neon.mjs
 *
 * 一次性資料遷移腳本：Firebase Firestore → Neon PostgreSQL
 *
 * 使用方式：
 *   node --env-file=.env.local scripts/migrate-firestore-to-neon.mjs
 */

import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { neon } from "@neondatabase/serverless";
import fs from "fs";
import path from "path";

const OUTPUT_DIR = path.join(process.cwd(), "migration-data");

// ─── Firebase 初始化 ──────────────────────────────────────────────────────────

initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});

const firestoreDb = getFirestore();
const sql = neon(process.env.DATABASE_URL);

// ─── Phase A：匯出 Firestore ──────────────────────────────────────────────────

async function exportCollection(name) {
  console.log(`Exporting ${name}...`);
  const snapshot = await firestoreDb.collection(name).orderBy("createdAt", "asc").get();
  const docs = snapshot.docs.map((doc) => {
    const d = doc.data();
    const converted = {};
    for (const [k, v] of Object.entries(d)) {
      converted[k] = v && typeof v.toDate === "function" ? v.toDate().toISOString() : v;
    }
    return { _firestoreId: doc.id, ...converted };
  });
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUTPUT_DIR, `${name}.json`), JSON.stringify(docs, null, 2));
  console.log(`  → ${docs.length} records`);
  return docs;
}

// ─── Phase B：批次寫入 Neon ───────────────────────────────────────────────────

async function importMachines(docs) {
  console.log("\nImporting machines...");
  const idMap = new Map();

  for (const d of docs) {
    const gallery = Array.isArray(d.gallery) ? d.gallery : d.thumbnail ? [d.thumbnail] : [];
    const specs = d.specs && typeof d.specs === "object" ? d.specs : {};
    const createdAt = d.createdAt ? new Date(d.createdAt) : new Date();

    const rows = await sql`
      INSERT INTO machines (
        name, brand, model, year, price, cost_price, currency, location, category,
        description, hours_used, controller, pump_system, is_official, inspection_score,
        thumbnail, gallery, trading_status, specs, is_active, created_at
      ) VALUES (
        ${d.name || ""}, ${d.brand || ""}, ${d.model || ""}, ${Number(d.year) || 2020},
        ${Number(d.price) || 0}, ${Number(d.costPrice) || 0}, ${d.currency || "TWD"},
        ${d.location || ""}, ${d.category || ""}, ${d.description || ""},
        ${Number(d.hoursUsed) || 0}, ${d.controller || ""}, ${d.pumpSystem || ""},
        ${Boolean(d.isOfficial)}, ${Number(d.inspectionScore) || 0},
        ${d.thumbnail || ""}, ${gallery}, ${d.tradingStatus || "待售"},
        ${JSON.stringify(specs)}, ${d.isActive !== false}, ${createdAt}
      )
      RETURNING id
    `;
    idMap.set(d._firestoreId, rows[0].id);
  }

  console.log(`  → ${docs.length} machines imported`);
  return idMap;
}

async function importInquiries(docs, idMap) {
  console.log("Importing inquiries...");
  for (const d of docs) {
    const equipmentId = idMap.get(d.equipmentId) || d.equipmentId || "";
    const createdAt = d.createdAt ? new Date(d.createdAt) : new Date();
    await sql`
      INSERT INTO inquiries (name, phone, email, product, equipment_id, message, status, admin_note, created_at)
      VALUES (${d.name || ""}, ${d.phone || ""}, ${d.email || ""}, ${d.product || ""},
              ${equipmentId}, ${d.message || ""}, ${d.status || "待回覆"}, ${d.adminNote || ""}, ${createdAt})
    `;
  }
  console.log(`  → ${docs.length} inquiries imported`);
}

async function importSellerRequests(docs) {
  console.log("Importing sellerRequests...");
  for (const d of docs) {
    const createdAt = d.createdAt ? new Date(d.createdAt) : new Date();
    await sql`
      INSERT INTO seller_requests (
        name, phone, email, machine_brand, machine_model, machine_year,
        machine_hours, machine_price, machine_location, machine_condition, status, admin_note, created_at
      ) VALUES (
        ${d.name || ""}, ${d.phone || ""}, ${d.email || ""},
        ${d.machineBrand || ""}, ${d.machineModel || ""}, ${d.machineYear || ""},
        ${d.machineHours || ""}, ${d.machinePrice || ""}, ${d.machineLocation || ""},
        ${d.machineCondition || ""}, ${d.status || "待聯繫"}, ${d.adminNote || ""}, ${createdAt}
      )
    `;
  }
  console.log(`  → ${docs.length} sellerRequests imported`);
}

async function importSubscribers(docs) {
  console.log("Importing subscribers...");
  for (const d of docs) {
    const createdAt = d.createdAt ? new Date(d.createdAt) : new Date();
    await sql`
      INSERT INTO subscribers (email, is_active, created_at)
      VALUES (${d.email}, ${d.isActive !== false}, ${createdAt})
      ON CONFLICT (email) DO NOTHING
    `;
  }
  console.log(`  → ${docs.length} subscribers imported`);
}

// ─── Phase C：驗證 ───────────────────────────────────────────────────────────

async function verify(data) {
  const [m, i, s, sub] = await Promise.all([
    sql`SELECT COUNT(*) AS count FROM machines`,
    sql`SELECT COUNT(*) AS count FROM inquiries`,
    sql`SELECT COUNT(*) AS count FROM seller_requests`,
    sql`SELECT COUNT(*) AS count FROM subscribers`,
  ]);

  console.log("\n=== Verification ===");
  console.log(`machines:       Firestore ${data.machines.length} → Neon ${m[0].count}`);
  console.log(`inquiries:      Firestore ${data.inquiries.length} → Neon ${i[0].count}`);
  console.log(`sellerRequests: Firestore ${data.sellerRequests.length} → Neon ${s[0].count}`);
  console.log(`subscribers:    Firestore ${data.subscribers.length} → Neon ${sub[0].count}`);

  const orphaned = await sql`
    SELECT equipment_id FROM inquiries
    WHERE equipment_id != ''
    AND equipment_id::text NOT IN (SELECT id::text FROM machines)
  `;
  if (orphaned.length > 0) {
    console.warn(`\nWarning: ${orphaned.length} inquiry(ies) with unmatched equipment_id`);
  } else {
    console.log("All equipment_id references are valid.");
  }
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("ERROR: DATABASE_URL is not set in .env.local");
    process.exit(1);
  }
  if (!process.env.FIREBASE_PROJECT_ID) {
    console.error("ERROR: FIREBASE_* env vars are not set in .env.local");
    process.exit(1);
  }

  console.log("=== Phase A: Exporting from Firestore ===");
  const data = {
    machines: await exportCollection("machines"),
    inquiries: await exportCollection("inquiries"),
    sellerRequests: await exportCollection("sellerRequests"),
    subscribers: await exportCollection("subscribers"),
  };

  console.log("\n=== Phase B: Importing to Neon ===");
  const idMap = await importMachines(data.machines);
  await importInquiries(data.inquiries, idMap);
  await importSellerRequests(data.sellerRequests);
  await importSubscribers(data.subscribers);

  await verify(data);
  console.log("\nMigration complete.");
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
