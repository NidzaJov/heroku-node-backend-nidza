const express = require('express');
const { Router } = express;
const authMiddleware = require('../../middleware/auth');
const reactionsService = require('../../modules/services/reactions');
const config = require('../../config');

const reactionsRouter = Router();

reactionsRouter.use(authMiddleware);

reactionsRouter.get('/:todoId', async function(req, res) {
    try {
        const { todoId } = req.params;
        const reaction = await reactionsService.findByTodoId(todoId);
        res.json(reaction);
    } catch (e) {
        console.error('Have not got reaction', e);
        res.sendStatus(400);
    }
    
   
})

reactionsRouter.patch('/', async function(req, res) {
    try {
        const { body } = req;
        console.info('Patch request body:', body);
        let { _id, field, value } = body;
        await reactionsService.updateField(_id, value);
        res.sendStatus(204);
    } catch (e) {
        console.error('Reaction not updated', e);
        res.sendStatus(400);
    }
})

module.exports = {
    path: '/reactions',
    router: reactionsRouter,
}
