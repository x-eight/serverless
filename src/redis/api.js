const { createClient } = require('redis')
const connectRedis = require('connect-redis')
const session = require('express-session')

class RedisApi{
    client
    constructor(url) {
        this.client = createClient({ url,legacyMode: true})
        this.client.auth('dev', ()=>{})
    }

    async connect() {
        await this.client.connect()
    }

    async store() {
        const RedisStore = connectRedis(session)
        const store = new RedisStore({ client: this.client })
        return store
    }
}

module.exports = {
    RedisApi
}

