
function auth(req, res, next) {
    if (!req.session.zo_user_id) {
        return res.send({
            message: "Unauthorized",
            code: "UNAUTHORIZED",
            type: "AUTHENTICATION_ERROR",
        }).status(401)
    }

    next()
}

module.exports = {
    auth
}