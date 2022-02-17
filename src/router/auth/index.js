const express = require('express');
const { Router } = express;
const usersService = require('../../modules/services/users');
const AuthService = require('../../modules/services/auth');
const { validateKeysExist } = require('../../modules/helpers');
const config = require('../../config');

const authRouter = Router();

authRouter.post('/register', async function(req, res) {
    try {
        const { body } = req;
        console.info('Register endpoint req body:', body);
        const hashedPassword = await AuthService.hashPassword(body.password);
        const user = {
            ...body,
            password: hashedPassword
        };
        await usersService.create(user)
        res.sendStatus(201);
    } catch(e) {
        console.info('Registration exception', e);
        res.sendStatus(400);
    }
});

authRouter.post('/login', async function(req, res) {
    try{
        const { body } = req;
        console.info('Login body:', body);
        validateKeysExist(['password', 'email'], body);
        const user = await usersService.findByEmail(body.email);
        
        if (!user) res.sendStatus(404);

        const passwordMatch = await AuthService.comparePassword(body.password, user.password);

        if (!passwordMatch) res.sendStatus(401);

        const token = await AuthService.generateToken(user);
        res.cookie(config.auth.authCookieName, token, {
            httpOnly: true,
            expires: new Date(Date.now() + config.auth.authCookieAgeInSeconds * 1000),
        });
        res.sendStatus(200);
    } catch (e) {
        console.info('Login error', e);
        res.sendStatus(400);
    }
});

authRouter.get('/logout', async function(req, res) {
    res.cookie(config.auth.authCookieName, '', {expires: new Date()})
    res.sendStatus(200);
})

authRouter.get('/', async function(req, res) {
    try {
        res.sendStatus(200).json('Hello there')
    } catch (e) {
        console.info('Contact exception', e);
        res.sendStatus(500);
    }
})

module.exports = {
    path: '/',
    router: authRouter,
}