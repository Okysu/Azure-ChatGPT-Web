import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI;
const password = process.env.MONGODB_PASSWORD;
const username = process.env.MONGODB_USERNAME;
const db_name = process.env.MONGODB_DB;

if (!uri || !password || !username || !db_name) {
  throw new Error(
    "MONGODB_URI, MONGODB_PASSWORD, MONGODB_USERNAME, or MONGODB_DB not found in env."
  );
}

const db = {
  connection: null as Db | null,
};

/**
 * Connect to the mongodb server.
 */
async function connect() {
  try {
    const client = await MongoClient.connect(uri!, {
      auth: {
        username: process.env.MONGODB_USERNAME!,
        password: process.env.MONGODB_PASSWORD!,
      },
    });
    db.connection = client.db(process.env.MONGODB_DB);
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
  if (!db.connection) {
    await connect();
  }
  return db.connection;
}

export { getDB };
