const { ObjectID } = require('mongodb');
const { validateKeysExist } = require("../../helpers");
const { DB } = require('../../database');
const { todosCollection, sharingActions } = require('../../../constants');

const todoRequiredKeys = ['owner', 'title', 'items', 'sharedWith', 'lastModified'];
const todoItemRequiredKeys = ['done', 'text']

class TodosService {
    static get collection() {
        return DB.collection(todosCollection);
    }

    validateTodoObject(todo, existing = false) {
        validateKeysExist([
            ...(existing ? ['_id'] : []),
            ...todoRequiredKeys
        ], todo);
        for (const item of todo.items) {
            validateKeysExist(todoItemRequiredKeys, item);
        }
    }

    getDefaultTodoFields() {
        return {
            lastModified: new Date(),
            sharedWith: [],
            items: [],
            done: false
        }
    }

    async create(ownerId, todoObj) {
        const todoDoc = {
            ...this.getDefaultTodoFields(),
            ...todoObj,
            owner: new ObjectID(ownerId),
            _id: new ObjectID()
        };
        this.validateTodoObject(todoDoc); 
        await TodosService.collection.insertOne(todoDoc);
        return todoDoc._id;
    }

    async update(ownerId, todo) {
        this.validateTodoObject(todo, true);
        const { _id } = todo;
        delete todo._id;
        //delete todo.owner;

        return await TodosService.collection.updateOne({
            _id: new ObjectID(_id),
            //owner: new ObjectID(todo.owner)
        }, {
            $set: {...todo, owner:new ObjectID(todo.owner), lastModified: new Date(), sharedWith: todo.sharedWith.map(id => new ObjectID(id)) }
        });
    }
    async updateField(ownerId, todoId, field, value) {
        return await TodosService.collection.updateOne({
            _id: new ObjectID(todoId),
            owner: new ObjectID(ownerId)
        }, {
            $set: { [field]: value, lastModified: new Date() }
        });
    }
    async share(ownerId, todoId, userId, action) {
        let operator = '';
        if (action === sharingActions.ADD) {
            operator = '$push';
        } else if (action === sharingActions.REMOVE) {
            operator = '$pull';
        } else {
            throw new Error('Unknown action')
        }
        
        return await TodosService.collection.updateOne({
            _id: new ObjectID(todoId),
            owner: ownerId,
        }, {
            [operator]: { sharedWith: new ObjectID(userId) }
        });
    }
    async delete(todoId) {
        await TodosService.collection.deleteOne({
            _id: new ObjectID(todoId)
        });
    }

    async findbyId(ownerId, todoId) {
        return await TodosService.collection.findOne({
            _id: new ObjectID(todoId),
            owner: new ObjectID(ownerId),
        });
    }
    async findAllByUserId(ownerId) {
        return await TodosService.collection
            .find({owner: new ObjectID(ownerId)})
            .toArray()
    }
    async findAllSharedWithUserId(userId) {
        return await TodosService.collection
        .find({ sharedWith: { $in: [new ObjectID(userId)] }})
        .toArray();
    }
}

module.exports = new TodosService();
