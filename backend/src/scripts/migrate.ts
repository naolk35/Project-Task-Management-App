import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import { sequelize } from "../config/database.js";

interface Schema {
  ables: Record<string, { columns: Record<string, string> }>;
}

function buildCreateTableSql(
  tableName: string,
  columns: Record<string, string>
): string {
  const columnDefs = Object.entries(columns)
    .map(([col, def]) => `\`${col}\` ${def}`)
    .join(", ");
  return `CREATE TABLE IF NOT EXISTS \`${tableName}\` (${columnDefs}) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;
}

async function applySchema(schemaPath: string): Promise<void> {
  const fileContent = fs.readFileSync(schemaPath, "utf8");
  const doc = yaml.load(fileContent) as Schema;
  if (!doc || typeof doc !== "object" || !("tables" in doc)) {
    throw new Error("Invalid schema.yml: missing 'tables'");
  }

  for (const [tableName, table] of Object.entries(doc.tables)) {
    const sql = buildCreateTableSql(tableName, table.columns);
    await sequelize.query(sql);
    // eslint-disable-next-line no-console
    console.log(`✔ Ensured table: ${tableName}`);
  }
}

async function main(): Promise<void> {
  const schemaFile =
    process.env.SCHEMA_FILE ||
    path.resolve(process.cwd(), "backend", "schema.yml");
  // eslint-disable-next-line no-console
  console.log(`Using schema file: ${schemaFile}`);
  await applySchema(schemaFile);
  await sequelize.close();
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Schema migration failed:", err);
  process.exit(1);
});

