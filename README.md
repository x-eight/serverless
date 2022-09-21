# Zoluxiones

## Dependencies

-   npm
-   node (v16)

## Start in development

Primero crear un archivp `.env` con las variables de entorno requeridas, revisar `.env.example` para ayuda.

Eg.

```
REDIS_URL=redis://localhost:6379
MY_SQL_URL=mysql://dev:dev@localhost:5432/dev
SESSION_SECRET=Zoluxiones-test
COOKIE_NAME=sesion
START_WARS_API=https://swapi.py4e.com/api
...
```

ejecute el siguiente comando para probarlo en su local:

```sh
npm run dev
```

ejecute el siguiente comando ejecutarlo con serverless:

```sh
npm run deploy
```

ejecute el siguiente comando para activar el unit test:

```sh
npm run test
```
