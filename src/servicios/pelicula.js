
function FilmController(swapi) {
    const ObtenerPersonajes = async (req, res, next) => {
        try {
            const page = req.query.page ? req.query.page : 1
            const people = await swapi.getPeoples(req.query.nombre, page)

            let resultados = {
                personajes:[],
                cantidad: people?.count ? people.count : 0
            }
            if(people?.results && people.results.length > 0){
                resultados.personajes = await Promise.all(
                    people.results.map(async (p) => {
                        return {
                            nombre: p.name,
                            altura: `${p.height} cm`,
                            masa: `${p.mass} kg`,
                            color_de_pelo: p.hair_color,
                            color_de_piel: p.skin_color,
                            color_de_ojo: p.eye_color,
                            genero: p.gender
                        }
                    })
                )
            }

            res.send({ resultados }).status(200)
        } catch (err) {
            res.send({mensaje:"algo ocurrio"}).status(400)
        }
    }

    const ObtenerPeliculas = async (req, res, next) => {
        try {
            const page = req.query.page ? req.query.page : 1
            const films = await swapi.getFilms(req.query.titulo, page)
            let resultados = {
                peliculas:[],
                cantidad: films?.count ? films.count : 0
            }
            if(films?.results && films.results.length > 0){
                resultados.peliculas = await Promise.all(
                    films.results.map(async (p) => {
                        return {
                            titulo: p.title,
                            episodio: p.episode_id,
                            director: p.director,
                            productor: p.producer,
                            lanzamiento: p.release_date
                        }
                    })
                )
            }

            res.send({ resultados }).status(200)
        } catch (err) {
            res.send({mensaje:"algo ocurrio"}).status(400)
        }
    }

  
    return {
        ObtenerPersonajes,
        ObtenerPeliculas
    };
}

module.exports = {
    FilmController
}