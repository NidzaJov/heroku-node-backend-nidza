const config = require('../../config');
const { MongoClient } = require('mongodb');
const { usersCollection } = require('../../constants');

const connectionString = `mongodb://${config.db.username}:${config.db.password}@192.168.0.12/${config.db.dbname}`;

class Database {
    async connect() {
        const client = new MongoClient(connectionString, {
            useUnifiedTopology: true,
            authSource: config.db.dbname
        });
        this.connection = await client.connect();

        await this.DB
         .collection(usersCollection)
         .createIndex({email: 1}, {unique: true})
    }

    async disconnect() {
        this.connection.close();
    }

    get DB () {
        try {
            return this.connection.db(config.db.dbname);
        }
        catch(e) {
            console.error('Database unavailable:', e.stack);
            return null;
        }
    }
}

module.exports = new Database();