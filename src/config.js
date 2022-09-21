const dotenv = require('dotenv')
dotenv.config()

const config = {
    redisURL: process.env.REDIS_URL ?? "",
    mySqlURL: process.env.MY_SQL_URL ?? "",
    sessionSecret: process.env.SESSION_SECRET ?? "",
    cookieName: process.env.COOKIE_NAME ?? "",
    swapi: process.env.START_WARS_API ?? "",
}

module.exports = {
    config
}