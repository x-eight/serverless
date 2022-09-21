const request = require('supertest');
const { run } = require('../src/app.js');

describe("Integration start wars api", () => {
  test("GET personajes -> should respond with 200", async () => {
    const app = await run()
    const response = await request(app).get("/v1/swapi/personajes").send();
    expect(response.statusCode).toBe(200);
  });

  test("GET personajes -> should respond with 200", async () => {
    const app = await run()
    const response = await request(app).get("/v1/swapi/peliculas").send();
    expect(response.statusCode).toBe(200);
  });
});

describe("Endpoint User", () => {
  describe("Ideal Cases", () => {
    const number = Math.floor(Math.random() * 100)
    const user = {
        correo:`test${number}@test.co`,
        nombre:"joe",
        apellido:"doe",
        password:"test"
    }
    // should respond with a 200 code
    test("Create new user", async () => {
        const app = await run()
        const response = await request(app).post("/v1/user").send(user)
        expect(response.statusCode).toBe(200)
    });

    // should respond a json as a content type
    test("should have a Content-Type: application/json header", async () => {
        const app = await run()
        const response = await request(app).post("/v1/user").send(user)
        expect(response.headers["content-type"]).toEqual(
            expect.stringContaining("json")
        );
    });

    test("should respond with an task ID", async () => {
        const app = await run()
        const response = await request(app).post("/v1/user/search").send({})
        console.log("response.body",response.body)
        expect(response.body.usuarios).toBeDefined()
    });
  });

  describe("when the email and first name is missing", () => {
    // should respond with a 400 code
    test("shoud respond with a 404 status code", async () => {
        const app = await run()
        const fields = [
            {
                correo:"saul2@test.co",
                apellido:"doe",
                password:"test"
            },
            {
                nombre:"joe",
                apellido:"doe",
                password:"test"
            },
        ];

        for (const body of fields) {
            const response = await request(app).post("/v1/user").send(body)
            expect(response.statusCode).toBe(404)
        }
    });
  });
  
});