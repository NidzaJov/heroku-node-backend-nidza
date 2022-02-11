const { DB } = require('../../database');
const { reactionsCollection } = require('../../../constants');
const { ObjectID } = require('mongodb');

class ReactionsService {
    static get collection() {
        return DB.collection(reactionsCollection);
    }

    async create(todoId) {
        const reactionDoc = {
            thumbsUp: 0,
            hooray: 0,
            heart: 0,
            rocket: 0,
            eyes: 0,
            todoId: todoId
        }
        await ReactionsService.collection.insertOne(reactionDoc)
    }

    async findByTodoId(todoId) {
        return await ReactionsService.collection.findOne({
            todoId: new ObjectID(todoId)
        })
    }

    async updateField(id, field) {
        const reaction = await ReactionsService.collection.findOne({
            todoId: new ObjectID(id)
        })
        console.info(reaction);
        return await ReactionsService.collection.updateOne({
            todoId: new ObjectID(id)
        }, {
            $set: { [field]: reaction[field] + 1}
        })
    }
}

module.exports = new ReactionsService();