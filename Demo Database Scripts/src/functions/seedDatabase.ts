import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { MongoClient } from 'mongodb';

export async function seedDatabase(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {

    let client: MongoClient | undefined;
    const connectionString = process.env.CONNECTION_STRING || ""; 
    const sourceDatabaseName = request.query.get('sourceDb'); 
    const destinationDatabaseName = request.query.get('destinationDb'); 

    if (!connectionString) {
        return { body: 'Missing connection string env variable' };
    }
    if (!sourceDatabaseName|| !destinationDatabaseName) {
        return { body: 'Missing query parameters' };
    }

    async function wait(milliseconds: number): Promise<void> {
        return new Promise((resolve) => {
          setTimeout(resolve, milliseconds);
        });
      }

    try {

        client = new MongoClient(connectionString);
        await client.connect();
    
        const sourceDb = client.db(sourceDatabaseName);
        const destinationDb = client.db(destinationDatabaseName);
    
        const collections = await sourceDb.listCollections().toArray();
    
        for (const collectionInfo of collections) {
            const collectionName = collectionInfo.name;
            const sourceCollection = sourceDb.collection(collectionName);
            const destinationCollection = destinationDb.collection(collectionName);
        
            await destinationCollection.deleteMany({});
            console.log(`Deleted all documents from ${destinationDatabaseName}.${collectionName}`);
        
            const documents = await sourceCollection.find({}).toArray();
        
            if (documents.length > 0) {
                await destinationCollection.insertMany(documents);
                console.log(`Copied ${documents.length} documents from ${sourceDatabaseName}.${collectionName} to ${destinationDatabaseName}.${collectionName}`);
            } else {
                console.log(`Collection ${sourceDatabaseName}.${collectionName} is empty.`);
            }
            await wait(500);
        }
    
        console.log(`Database ${sourceDatabaseName} copied to ${destinationDatabaseName} successfully.`);
        return { body: `Database ${sourceDatabaseName} copied to ${destinationDatabaseName} successfully.` };
    } catch (error) {
        return { body: 'Error seeding database:' + error.message, status: 500 };
    }       
};

app.http('seedDatabase', {
    methods: ['GET'],
    authLevel: 'function',
    handler: seedDatabase
});
