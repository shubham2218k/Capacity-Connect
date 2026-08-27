/*
 * Optional helper for machines that do not have MongoDB installed.
 * Starts a real mongod on port 27017 and keeps it running until you press Ctrl+C,
 * so `npm run dev` can connect to mongodb://127.0.0.1:27017/capacityconnect.
 *
 * Run it in its own terminal:  npm run mongo:local
 * If you already have MongoDB (or an Atlas URI in .env), you do not need this.
 */
const { MongoMemoryServer } = require('mongodb-memory-server');

(async () => {
  const mongo = await MongoMemoryServer.create({
    instance: { port: 27017, dbName: 'capacityconnect' }
  });

  console.log(`Local MongoDB ready at ${mongo.getUri()}`);
  console.log('Press Ctrl+C to stop.');

  const stop = async () => {
    await mongo.stop();
    process.exit(0);
  };

  process.on('SIGINT', stop);
  process.on('SIGTERM', stop);
})();
