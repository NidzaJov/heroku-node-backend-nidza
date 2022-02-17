const database = require('./modules/database');
const config = require('./config');
const cookieParser = require('cookie-parser');


(async () => {
    console.info('Starting the app...');
    console.info('Connecting to the DB...');
    await database.connect();
    console.info(("Connected to the DB."));

    console.info('Creating the express app...');
    const express = require('express');
    const router = require('./router');
    const app = express();
    console.info('Registering the routes...');

    app.get('/', function(req, res) {
        try {
            res.sendStatus(200).json('Hello there')
        } catch (e) {
            console.info('Contact exception', e);
            res.sendStatus(500);
        }
    })
    
    app.use(cookieParser(config.auth.secret));
    app.use(router.path, router.router);

    console.info('Starting the app...');
    var port = process.env.PORT || 5000
    app.listen(port, () => {
        console.info(`Server is listening on port ${port}...`)
    })
})();