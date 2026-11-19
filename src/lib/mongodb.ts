import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI as string;

if (!uri) {
  throw new Error("Please add MONGODB_URI to your environment variables (.env.local or Vercel Settings)");
}

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function getClientPromise(): Promise<MongoClient> {
  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 15000,
    });
    global._mongoClientPromise = client.connect().catch((err) => {
      global._mongoClientPromise = undefined;
      throw err;
    });
  }
  return global._mongoClientPromise;
}

const clientPromise: Promise<MongoClient> = {
  then: (onfulfilled, onrejected) => getClientPromise().then(onfulfilled, onrejected),
  catch: (onrejected) => getClientPromise().catch(onrejected),
  finally: (onfinally) => getClientPromise().finally(onfinally),
  [Symbol.toStringTag]: "Promise",
};

export default clientPromise;
