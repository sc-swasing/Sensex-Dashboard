const request = require("supertest");
const { app } = require("../server");
const pool = require("../db");

describe("Authentication API", () => {

  test("Register a new user", async () => {

    const email = `testuser${Date.now()}@example.com`;

    const response = await request(app)
      .post("/register")
      .send({
        email: email,
        password: "password123",
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("message");

  });


});
afterAll(async () => {
  await pool.end();
});