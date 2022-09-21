const { auth } = require('./session.js')
const express = require('express')
const { UserController } = require('./servicios/usuario.js')
const { FilmController } = require('./servicios/pelicula.js')

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./documentacion/doc.json')
const swaggerJSDoc = require('swagger-jsdoc');

function api(database,swaApi) {
    const router = express.Router();

    const usuario = UserController(database);
    const pelicula = FilmController(swaApi);

    router.route('/user').post(usuario.CrearUsuario);
    router.route('/user/login').post(usuario.IniciarSesion);
    router.route('/user').get(auth, usuario.ObtenerUsuaio);
    router.route('/user').put(auth, usuario.ActualizarUsuario);
    router.route('/user/logout').delete(auth, usuario.CerrarSesion);
    router.route('/user/search').post(usuario.ListaUsuarios);
  
    router.route('/swapi/personajes').get(pelicula.ObtenerPersonajes);
    router.route('/swapi/peliculas').get(pelicula.ObtenerPeliculas);

    const options = {
      swaggerDefinition:swaggerDocument,
      apis: ['./routes/*.js'],
    };
    const swaggerSpec = swaggerJSDoc(options);
    router.use('/docs', swaggerUi.serve)
    router.get('/docs', swaggerUi.setup(swaggerSpec));

    return router;
}

module.exports= {
  api
}