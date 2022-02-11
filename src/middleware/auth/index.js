const config = require('../../config');
const auth = require('../../router/auth');
const AuthService = require('../../modules/services/auth');
const users = require('../../modules/services/users');


const badCookieError = new Error('Bad cookie');
const tokenError = new Error('Bad Token');
const userNotFoundError = new Error('UserNotFoundError');

module.exports = async function(req, res, next) {
    try{
        const authCookie = req.cookies.auth;

        if (!authCookie) throw badCookieError;

        const userId = await AuthService.verifyTokenAndGetUserId(authCookie);

        if (!userId) throw tokenError;

        req.user = await users.findById(userId);

        if(!req.user) throw userNotFoundError;
        next()
    } catch (e) {
        res.status(401);
        res.send(e.toString())
        console.log(e.toString())
    }
};