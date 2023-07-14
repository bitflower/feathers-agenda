import type { Application } from '@feathersjs/feathers';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

export async function getMongoUri(app: Application) {
  // Source: https://discord.com/channels/509848480760725514/930352418179391528/1050452380833042493 (Marshall)
  let connectionUri;

  if (mongoServer) {
    return mongoServer.getUri();
  }

  try {
    mongoServer = await MongoMemoryServer.create({
      instance: { dbName: 'case-os' }
    });
    connectionUri = mongoServer.getUri();
    app.set('mongodb', connectionUri);
  } catch (error) {
    // tslint:disable-next-line:no-console
    console.log(error);
  }
}

export async function stopMongoServer() {
  if (mongoServer) {
    mongoServer.removeAllListeners();
    await mongoServer.stop();
  }
}
