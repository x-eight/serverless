
function auth(req, res, next) {
    if (!req.session.user_id) {
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