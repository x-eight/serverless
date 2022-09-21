const axios = require('axios')

class SwaApi {
    api
    constructor(url) {
        this.api = url
    }

    async getFilms(name,page) {
        try {
            let url = name ? `${this.api}/films/?page=${page}&search=${name}`: `${this.api}/films/?page=${page}`
            console.log("url",url)
            const response = await axios.get(url, { headers: { Accept: "application/json" } })

            return response.data
        } catch (err) {
            if(err.response.status === 404){
                return null
            }
            throw new Error(err.message)
        }
    }

    async getPeoples(name,page) {
        try {
            let url = name ? `${this.api}/people/?page=${page}&search=${name}`: `${this.api}/people/?page=${page}`
            console.log("url",url)
            const response = await axios.get(url, { headers: { Accept: "application/json" } })
            return response.data
        } catch (err) {
            if(err.response.status === 404){
                return null
            }
            throw new Error(err.message)
        }
    }
}

module.exports= {
    SwaApi
}
