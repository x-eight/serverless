const { Model, DataTypes,Op,Sequelize } = require('sequelize')
const { User } = require('../core/usuario.js')

const ACTIVO = "active"

class UserModel extends Model {
    id
    email
    password_hash
    firstName
    lastName
    status
    created_at
    updated_at

    static toDomain(user) {
        return User.of({
            id: user.id,
            email: user.email,
            passwordHash: user.password_hash,
            firstName: user.firstName,
            lastName: user.lastName,
            status: user.status,
            createdAt: Math.floor(user.created_at.getTime() / 1000),
            updatedAt: Math.floor(user.updated_at.getTime() / 1000),
        })
    }
}


class UserSqlRepository {
    sq
    constructor(sq) {
        this.sq = sq

        UserModel.init(
            {
                id: {
                    type: DataTypes.STRING,
                    primaryKey: true,
                },
                email: {
                    type: DataTypes.STRING,
                },
                password_hash: {
                    type: DataTypes.STRING,
                },

                firstName: {
                    type: DataTypes.STRING,
                },
                lastName: {
                    type: DataTypes.STRING,
                },
                status: {
                    type: DataTypes.STRING,
                    defaultValue: ACTIVO,
                },
            },
            {
                tableName: "users",
                sequelize: this.sq,
                timestamps: true,
                createdAt: "created_at",
                updatedAt: "updated_at",
            }
        )
    }

    async connect() {
        await this.sq.sync({ alter: true })
    }

    async create(user) {
        try {
            await UserModel.create({
                id: user.id,
                email: user.email,
                password_hash: user.passwordHash,
                firstName: user.firstName,
                lastName: user.lastName,
                created_at: new Date(),
                updated_at: new Date(),
            })
        } catch (err) {
            throw new Error(err.message)
        }
    }

    async get(id) {
        try {
            const model = await UserModel.findByPk(id)

            return model?.dataValues && UserModel.toDomain(model.dataValues)
        } catch (err) {
            throw new Error(err.message)
        }
    }

    async getByEmail(email) {
        try {
            const model = await UserModel.findOne({
                where: { email, status: ACTIVO },
            })
            return model?.dataValues && UserModel.toDomain(model.dataValues)
        } catch (err) {
            throw new Error(err.message)
        }
    }

    async list(query) {
        try {
            const where = this.querySql(query)

            const filter = this.filterPagination(query.page, query.limit)
            const models = await UserModel.findAll({
                offset: filter.offset,
                limit: filter.limit,
                where
            })
            console.log(models)
            return models.map((m) => UserModel.toDomain(m.dataValues))
        } catch (err) {
            throw new Error(err.message)
        }
    }

    async count(query){
        const where = this.querySql(query)

        return await UserModel.count({ where })
    }

    async update(id, user) {
        try {
            await UserModel.update(
                {
                    email: user.email,
                    password_hash: user.passwordHash,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    status: user.status,
                    updated_at: new Date(),
                },
                { where: { id } }
            )
        } catch (err) {
            throw new Error(err.message)
        }
    }

    querySql(query) {

        let where = { status: { [Op.eq]: ACTIVO } }

        if (query && query.ids) {
            if (query.ids.length > 0) {
                where.id = { [Op.in]: query.ids }
            } else {
                where.id = { [Op.is]: null }
            }
        }

        if (query && query.emails) {
            if (query.emails.length > 0) {
                where.email = { [Op.in]: query.emails }
            } else {
                where.email = { [Op.is]: null }
            }
        }

        return where
    }

    filterPagination(page,limit){
        const limitValue = limit ? limit : 10
        return {
            offset: page ? (page - 1) * limitValue : undefined,
            limit: limit ? +limit : undefined,
        }
    }
}

module.exports= {
    UserSqlRepository
}
