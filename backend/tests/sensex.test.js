const request = require("supertest");
const { app } = require("../server");
const pool = require("../db");

describe("Sensex API", () => {

  test("Get Sensex data without token should return 401", async () => {
    const response = await request(app)
      .get("/api/sensex?page=1&limit=30");

    expect(response.statusCode).toBe(401);
  });


  test("Get Sensex data with valid token should return data", async () => {

    const loginResponse = await request(app)
      .post("/login")
      .send({
        email: "testuser@example.com",
        password: "password123",
      });

    const token = loginResponse.body.token;


    const response = await request(app)
      .get("/api/sensex?page=1&limit=30")
      .set("Authorization", `Bearer ${token}`);


    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(Array.isArray(response.body.data)).toBe(true);
  });

});
afterAll(async () => {
  await pool.end();
});