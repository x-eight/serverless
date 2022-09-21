const { User } = require('../core/usuario.js')
const fs = require('fs');
const path = require('path');
const { config } = require('../config.js');

function UserController(repository) {
    
    const ObtenerUsuaio = async (req, res, next) => {
        try {
            const user = await repository.get(req.session.zo_user_id)
            if (!user) {
                return res.status(404).send({ mensaje:"usuario no existe" })
            }

            const usuario = {
                id:user.id,
                correo:user.email,
                nombre: user.firstName,
                apellido: user.lastName,
                creado: user.createdAt
            }

            return res.status(200).send({ usuario })
        } catch (err) {
            return res.status(400).send({ mensaje:"algo ocurrio" })
        }
    }

    const CrearUsuario = async (req, res, next) => {
        try {
            const foundUser = await repository.getByEmail(req.body.correo)
        if (foundUser) {
            return res.status(400).send({mensaje:"correo ya esta utilizado"})
        }

        const user = User.of({
            email: req.body.correo,
            passwordHash: await User.hashPassword(req.body.password),
            firstName: req.body.nombre,
            lastName: req.body.apellido,
        })

        await repository.create(user)

        const usuario = {
            id:user.id,
            correo:user.email,
            nombre: user.firstName,
            apellido: user.lastName,
            creado: user.createdAt
        }
     
        return res.status(200).send({ usuario })
    } catch (err) {
        return res.status(400).send({mensaje:"algo ocurrio"})
    }
    };

    const ActualizarUsuario = async (req, res, next) => {
        try {
        const user = await repository.get(req.session.zo_user_id)
        if (!user) {
            return res.status(404).send({mensaje:"usuario no existe"})
        }

        if(req.body?.correo){
            const valdEmail = await repository.getByEmail(req.body.correo)
            if (valdEmail) {
                return res.status(404).send({mensaje:"correo ya esta utilizado"})
            }
            user.email= req.body.correo
        }

        user.firstName= req.body?.nombre ?? user.firstName,
        user.lastName= req.body?.apellido ?? user.lastName,
     
        await repository.update(req.session.zo_user_id, user)

        const usuario = {
            id:user.id,
            correo:user.email,
            nombre: user.firstName,
            apellido: user.lastName,
            creado: user.createdAt
        }
     
        return res.status(200).send({ usuario })
    } catch (err) {
        return res.status(400).send({mensaje:"algo ocurrio"})
    }
    };

    const IniciarSesion = async (req, res, next) => {
        try {
            const user = await repository.getByEmail(req.body.correo)
    
            if (!user) {
                return res.status(400).send({mensaje:"correo no valido"})
            }
            if (!(await user.comparePassword(req.body.password))) {
                return res.status(400).send({mensaje:"contraseña incorrecta"})
            }
        
            req.session.zo_user_id = user.id
  
            const usuario = {
                id:user.id,
                correo:user.email,
                nombre: user.firstName,
                apellido: user.lastName,
                creado: user.createdAt
            }
        
            return res.status(200).send({ usuario })
        } catch (err) {
            console.log("err",err)
            return res.status(400).send({ mensaje:"algo ocurrio" })
        }
    }
 
    const CerrarSesion = async (req, res, next) => {
        try {
            await req.session.destroy()
            res.clearCookie(config.cookieName, {
                expires: new Date(1),
                path: "/",
                secure: true,
                sameSite: "none",
            })
            return res.status(200).send({mensaje:"sesion cerrada"})
        } catch (err) {
            return res.status(400).send({mensaje:"algo ocurrio"})
        }
    }

    const ListaUsuarios = async (req, res, next) => {
        try {
            const foundUsers = await repository.list({ 
                page:req.body?.pagina,
                limit:req.body?.limite,
                ids:req.body?.query?.ids,
                emails:req.body?.query?.correos,
                names:req.body?.query?.nombres
            })

            const users = await Promise.all(
                foundUsers.map(async (u) => {
                    return {
                        id:u.id,
                        correo:u.email,
                        nombre: u.firstName,
                        apellido: u.lastName,
                        creado: u.createdAt
                    }
                })
            )

            const count = await repository.count({
                ids:req.body?.query?.ids,
                emails:req.body?.query?.correos,
                names:req.body?.query?.nombres
            })

            const paginacion = {
                total_items: count,
                total_pages: req.body?.limite ? Math.ceil(count / req.body.limite) : 1,
                page: req.body?.pagina ? req.body.pagina : 1,
            }
     
            return res.status(200).send({ usuarios: users, paginacion })
        } catch (err) {
            return res.status(400).send({ mensaje:"algo ocurrio" })
        }
    };

    const JsonFile = async (req, res, next) => {
        const jsonPath = path.join(__dirname, "../documentacion/doc.json")
        try {
            const rawdata = fs.readFileSync(jsonPath)
            const fonts = JSON.parse(rawdata.toString())

            res.json(fonts).status(200)
        } catch (err) {
            fs.unlink(fontPath, () => {
                console.log("font temp file removed")
            })
            return res.status(400).send({message:err.message})
        }
    }
  
    return {
        CerrarSesion,
        ObtenerUsuaio,
        CrearUsuario,
        IniciarSesion,
        ActualizarUsuario,
        ListaUsuarios,
        JsonFile
    };
}

module.exports = {
    UserController
}