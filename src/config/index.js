const config = Object.freeze({
    app: {
        port: 5000,
    },
    db: {
        dbname: 'main',
        username: 'sedcuser',
        password: 'sedcpass'
    },
    auth: {
        secret: 'oursecretforjwt',
        jwtExpiresIn: '1h',
        authCookieName: 'auth',
        authCookieAgeInSeconds: 3600,
    }
})

module.exports = config;