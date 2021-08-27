import { MongoClient } from 'mongodb';
import config from '../config.js';

export default class MongoHelper {
    static mongoClient = '';

    static async connectMongoDB() {
      if (MongoHelper.mongoClient !== '') {
        // Connection already established, need not create a new one
        return;
      }
      if (!Object.prototype.hasOwnProperty.call(config, 'connection_string') || config.connection_string === '') {
        console.log('ERROR:: No Connection String specified! Please update the correct connection string in config.js and restart the application');
        process.exit(1);
      }
      if (!Object.prototype.hasOwnProperty.call(config, 'db_name') || config.db_name === '') {
        console.log('ERROR:: No Database Specified. Please update the correct database name in config.js and restart the application');
        process.exit(1);
      }

      try {
        const client = new MongoClient(config.connection_string, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        await client.connect();
        console.log('MongoDB successfully connected');
        MongoHelper.mongoClient = client;
      } catch (err) {
        console.log('ERROR:: While testing Db Connection, refer error details below');
        console.log(err);
        process.exit(1);
      }
    }

    static async disconnectDB() {
      if (MongoHelper.mongoClient === '') {
        return;
      }
      await MongoHelper.mongoClient.close();
    }
}
