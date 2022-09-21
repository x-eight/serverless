const { customAlphabet } = require('nanoid')

function generarId(prefix) {
    const nanoid = customAlphabet(
        "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
        12
    )
    return `${prefix}_${nanoid()}`
}

module.exports = {
    generarId
}

