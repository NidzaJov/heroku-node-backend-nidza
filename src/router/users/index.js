const express = require('express');
const { Router } = express;
const authMiddleware = require('../../middleware/auth');
const usersService  = require('../../modules/services/users');

const usersRouter = new Router();
usersRouter.use(authMiddleware);

usersRouter.get('/:userId?', async function(req, res) {
    const  { userId } = req.params;
    console.log(userId);
    if (userId) {
        const user = await usersService.getById(userId);
        res.json(user);
    }
    else {
        const users = await usersService.findAllUsers();
        res.json(users);
    }
});

module.exports = {
    path: '/users',
    router: usersRouter,
}