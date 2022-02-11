const { DB } = require('../../database');
const { ObjectID } = require('mongodb');
const { notificationsCollection } = require('../../../constants');

class NotificationsService {
    static get collection() {
        return DB.collection(notificationsCollection)
    }

    async create(senderId, receiverId, todoId, reaction) {
        const notificationDoc = {
            date: new Date(),
            sender: senderId,
            receiver: new ObjectID(receiverId),
            todo: new ObjectID(todoId),
            message: `${reaction}`,
            read: false,
            _id: new ObjectID()
        }
        await NotificationsService.collection.insertOne(notificationDoc);
    }

    async findById(notificationId) {
        const notification = await NotificationsService.collection.findOne({
            _id: new ObjectID(notificationId)
        })
    }

    async findAllByUserId(userId) {
        console.info(userId);
        const notifications = await NotificationsService.collection.find({
            receiver: new ObjectID(userId)
        }).toArray();
        console.info(notifications);
        return notifications;
    }

    async updateField(notificationId, field, value) {
        return await NotificationsService.collection
        .updateOne({
            _id: new ObjectId(notificationId)
        }, {
            $set: { [field]: value}
        })
    }

    async update(notification) {
        const { _id, receiver, sender } = notification;
        delete notification._id;
        delete notification.receiver;
        delete notification.sender;

        return await NotificationsService.collection
        .updateOne({
            _id: new ObjectID(_id)
        }, {
            $set: {...notification, receiver: new ObjectID(receiver), sender: new ObjectID(sender)}
        })

    }
}

module.exports = new NotificationsService();