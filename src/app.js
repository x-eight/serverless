const express = require('express')
const { Sequelize } = require('sequelize')
const { api } = require('./router.js');
const { UserSqlRepository } = require('./repositorios/my_sql.js');
const { RedisApi } = require('./redis/api.js');
const { Server } = require('./server.js');
const { SwaApi } = require('./swapi/api.js');
const { config } = require('./config.js');

async function run() {
    try {
        const app = express()
        console.log("config: ",config)
        const sq = new Sequelize(config.mySqlURL, { logging: false })

        const database = new UserSqlRepository(sq)
        const redis = new RedisApi(config.redisURL)
        const swaApi = new SwaApi(config.swapi)
        
        await database.connect()
        await redis.connect()
        const redisStore = await redis.store()
        
        const server = new Server(app)
        await server.configuration(redisStore, config.cookieName, config.sessionSecret)

        app.use("/v1", api(database, swaApi));
        return app
    } catch (error) {
        console.error("Unable to start the server: ", error)
    }
}

module.exports = {
    run
}	

