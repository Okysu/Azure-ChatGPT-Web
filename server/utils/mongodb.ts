import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";

let db: Db | null = null;

/**
 * Connect to the mongodb server.
 */
async function connect() {
  try {
    const client = await MongoClient.connect(uri, {
      auth: {
        username: process.env.MONGODB_USERNAME || "",
        password: process.env.MONGODB_PASSWORD || "",
      },
    });
    db = client.db(process.env.MONGODB_DB);
    console.log("Connected successfully to mongodb server.");
  } catch (err) {
    console.log("Failed to connect to mongodb server.", err);
    process.exit(1);
  }
}

/**
 * Get the db instance.
 * @returns {Db} db
 */
async function getDB(): Promise<Db | null> {
  if (!db) {
    await connect();
  }
  return db;
}

export { getDB };
