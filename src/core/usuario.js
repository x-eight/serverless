const bcrypt = require('bcrypt')
const { generarId } = require('./id.js')

class User {
    id
    email
    passwordHash
    firstName
    lastName
    status
    createdAt
    updatedAt

    static of(body){
        const user = new User()
        Object.assign(user, {
            // defaults
            id: generarId("user"),
            ...body,
        })
        return user
    }

    static async hashPassword(password) {
        return await bcrypt.hash(password, 10)
    }

    async comparePassword(password) {
        return await bcrypt.compare(password, this.passwordHash)
    }
}

module.exports= {
    User
}

