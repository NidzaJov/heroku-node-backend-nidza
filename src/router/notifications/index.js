const express = require('express');
const { Router } = express;
const authMiddleware = require('../../middleware/auth');
const notifications = require('../../modules/services/notifications');
const notificationsService = require('../../modules/services/notifications');
const todos = require('../../modules/services/todos');


const notificationsRouter = Router();

notificationsRouter.use(authMiddleware);

notificationsRouter.get('/:notificationId?', async function(req, res) {
    const { notificationId } = req.params;
    let notifications ;
    if (notificationId) {
        const notification = await notificationsService.findById(notificationId);
        res.json(notification);
    }
    else {
        notifications = [...(await notificationsService.findAllByUserId(req.user._id))];
    }
    res.json(notifications)
})

notificationsRouter.post('/', async function(req, res) {
    try {
        const { receiver, todoId, reaction } = req.body; 
        console.info('Create notification got: ', receiver, todoId, reaction);
        await notificationsService.create(req.user._id, receiver, todoId, reaction);
        res.sendStatus(201);
    } catch (e) {
        console.error('Notification not created', e);
        res.sendStatus(400)
    }
})

notificationsRouter.patch('/', async function(req, res) {
    try {
        const { body } = req;
        console.info('Patch request bodu', body);
        let { _id, field, value } = body;
        await notificationsService.updateField(_id, field, value);
        res.sendStatus(204);
    } catch (e) {
        console.error('Notification not pached', e);
        res.sendStatus(400);
    }
})

notificationsRouter.put('/', async function(req, res) {
    try {
        const { body } = req;
        console.info('Put request got:', body);
        await notificationsService.update(body);
        res.sendStatus(204);
    } catch (e) {
        console.error('Notification not put', e);
        res.sendStatus(400);
    }
})

module.exports = {
    path: '/notifications',
    router: notificationsRouter
}