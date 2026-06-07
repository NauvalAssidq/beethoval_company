import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI as string;

if (!uri) {
  throw new Error("Please add MONGODB_URI to .env.local");
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

async function initDb(client: MongoClient) {
  try {
    const db = client.db("portfolio");
    await db.collection("visits").createIndex({ createdAt: -1 });
  } catch (err) {
    console.error("Failed to initialize database indexes:", err);
  }
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, { maxPoolSize: 5 });
    global._mongoClientPromise = client.connect().then(async (c) => {
      await initDb(c);
      return c;
    });
  }

  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, { maxPoolSize: 5 });
  clientPromise = client.connect().then(async (c) => {
    await initDb(c);
    return c;
  });
}

export default clientPromise;