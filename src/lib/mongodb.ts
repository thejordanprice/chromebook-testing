import { MongoClient, Db } from 'mongodb';

const options = {} as const;

let clientPromise: Promise<MongoClient> | null = null;

async function getClient(): Promise<MongoClient> {
  if (clientPromise) return clientPromise;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Please add your MongoDB URI to .env.local');
  }

  const client = new MongoClient(uri, options);
  clientPromise = client.connect();
  return clientPromise;
}

export async function getDatabase(): Promise<Db> {
  const client = await getClient();
  return client.db('chromebook-tester');
}

