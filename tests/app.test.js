const request = require("supertest");
const pastes = require("../src/data/pastes-data");
const app = require("../src/app");

describe("path /pastes", () => {
  beforeEach(() => {
    pastes.splice(0, pastes.length);
  });
  describe("GET method", () => {
    test("returns an array of pastes", async () => {
      const expected = [
        {
          id: 1,
          user_id: 1,
          name: "Hello",
          syntax: "None",
          expiration: 10,
          exposure: "private",
          text: "Hello World!",
        },
        {
          id: 2,
          user_id: 1,
          name: "Hello World in Python",
          syntax: "Python",
          expiration: 24,
          exposure: "public",
          text: "print(Hello World!)",
        },
        {
          id: 3,
          user_id: 2,
          name: "String Reverse in JavaScript",
          syntax: "Javascript",
          expiration: 24,
          exposure: "public",
          text: "const stringReverse = str => str.split('').reverse().join('');",
        },
      ];

      pastes.push(...expected);

      const response = await request(app).get("/pastes");

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(expected);
    });
  });
  describe("POST method", () => {
    beforeEach(() => {
      pastes.splice(0, pastes.length);
    });
    test("creates a new paste and assigns id", async () => {
      const newPaste = {
        name: "String Reverse in JavaScript",
        syntax: "Javascript",
        expiration: 24,
        exposure: "public",
        text: "const stringReverse = str => str.split('').reverse().join('');",
      };
      const response = await request(app)
        .post("/pastes")
        .set("Accept", "application/json")
        .send({ data: newPaste });

      expect(response.status).toBe(201);
      expect(response.body.data).toEqual({
        id: 5,
        ...newPaste,
      });
    });

    test("returns 400 if result is missing", async () => {
      const response = await request(app)
        .post("/pastes")
        .set("Accept", "application/json")
        .send({ data: { message: "returns 400 if result is missing" } });

      expect(response.status).toBe(400);
    });

    test("returns 400 if result is empty", async () => {
      const response = await request(app)
        .post("/pastes")
        .set("Accept", "application/json")
        .send({ data: { result: "" } });

      expect(response.status).toBe(400);
    });
  });
});
