import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGO_URI;

export default async function handler(req, res) {
    if (req.method === 'POST') {
      const { clerkId, objectId } = req.body;
  
      if (!clerkId || !objectId) {
        return res.status(400).json({ error: 'clerkId and objectId are required' });
      }
  
      const validObjectId = new ObjectId(objectId);
  
      const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  
      try {
        await client.connect();
  
        const foodDb = client.db('solucio-food');
        const embeddingsCollection = foodDb.collection('solucio-food-embeddings');
        const objectData = await embeddingsCollection.findOne({ _id: validObjectId });
  
        if (!objectData) {
          return res.status(404).json({ error: 'Object ID not found in solucio-food-embeddings' });
        }
  
        const userDb = client.db(clerkId);
        const swipeRightCollection = userDb.collection('liked');
  
        const document = {
          ...objectData, 
          timestamp: new Date(), 
        };
  
        await swipeRightCollection.insertOne(document);
  
        res.status(200).json({ message: 'Swipe right successfully recorded with object data' });
      } catch (error) {
        console.error('Database connection error', error);
        res.status(500).json({ error: 'Failed to connect to the database' });
      } finally {
        await client.close();
      }
    } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
  