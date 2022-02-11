const { DB } = require('../../database');
const { usersCollection } = require('../../../constants');
const { validateKeysExist } = require('../../helpers');
const { ObjectID } = require('mongoDB');

const userRequiredKeys = ['firstName', 'lastName', 'email', 'password'];

class UsersService {
    static get collection() {
        return DB.collection(usersCollection);
    }

    async create(user) {
        validateKeysExist(userRequiredKeys, user);
        await UsersService.collection.insertOne(user); 
    }

    async findByEmail(email) {
        return await UsersService.collection.findOne({email});
    };
    async findById(id) {
        return await UsersService.collection.findOne({
            _id: new ObjectID(id)
        });
    };

    async findAllUsers() {
        return await UsersService.collection.find().toArray();
    }
    
    async update(user) {};
}


module.exports = new UsersService();