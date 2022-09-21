const bodyParser = require('body-parser')
const cookieParser = require("cookie-parser")
const session = require('express-session')
const cors = require('cors')

class Server {
    app

    constructor(server) {
        this.app = server
    }

    async configuration(store, cookieName, secret) {
        this.app.use(cors())
        this.app.use(cookieParser());
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }))

        //Configure session middleware
        this.app.use(session({
            cookieName,
            store,
            secret,
            resave: false,
            //rolling: true,
            saveUninitialized: false,
            cookie: { 
                secure: false, //false --> if true only transmit cookie over https
                httpOnly: true, //false --> if true prevent client side JS from reading the cookie
                maxAge: 30 * 60 * 1000
                //secure: "auto",
                //sameSite: "none"
            }
        }))
    }
}

module.exports = {
    Server
}
