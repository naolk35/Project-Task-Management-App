import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME || "app_db",
  process.env.DB_USER || "root",
  process.env.DB_PASS || process.env.DB_PASSWORD || "",
  {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    dialect: "mysql",
    logging: false,
  }
);

export async function verifyDatabaseConnection(): Promise<void> {
  try {
    await sequelize.authenticate();
    // eslint-disable-next-line no-console
    console.log("✅ MySQL connected");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Unable to connect to MySQL:", error);
    process.exitCode = 1;
  }
}

// Test connection on startup
// eslint-disable-next-line @typescript-eslint/no-floating-promises
verifyDatabaseConnection();
