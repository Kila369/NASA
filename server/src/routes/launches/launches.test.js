const request = require("supertest");
const app = require("../../app");
const { loadPlanetsData } = require("../../models/planets.model");
const { mongoConnect, mongoDisconnect } = require("../../services/mongo");

describe("Launches API", () => {
  beforeAll(async () => {
    await mongoConnect();
    await loadPlanetsData;
  });

  afterAll(async () => {
    await mongoDisconnect();
  });
  describe("Test GET / launches", () => {
    test("It should respond with 200 success", async () => {
      const response = await request(app)
        .get("/v1/launches")
        .expect("Content-Type", /json/)
        .expect(200);
    });
  });

  describe("Test POST / launches", () => {
    const completeLaunchData = {
      mission: "uss enterpries",
      rocket: "NCC 1701-D",
      target: "Kepler-62 f",
      launchDate: "January 4, 2028",
    };
    const LaunchDataWODate = {
      mission: "uss enterpries",
      rocket: "NCC 1701-D",
      target: "Kepler-62 f",
    };

    const LaunchDataWInvalidDate = {
      mission: "uss enterpries",
      rocket: "NCC 1701-D",
      target: "Kepler-62 f",
      launchDate: "root",
    };

    test("It should respond with 201 created", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(completeLaunchData)
        .expect("Content-Type", /json/)
        .expect(201);
      const requestDate = new Date(completeLaunchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();
      expect(responseDate).toBe(requestDate);

      expect(response.body).toMatchObject(LaunchDataWODate);
    });

    test("It should catch mising required porperties", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(LaunchDataWODate)
        .expect("Content-Type", /json/)
        .expect(400);
      expect(response.body).toStrictEqual({
        error: "Missing required launch property",
      });
    });
    test("It should catch invalid dates", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(LaunchDataWInvalidDate)
        .expect("Content-Type", /json/)
        .expect(400);
      expect(response.body).toStrictEqual({
        error: "Invalid launch date",
      });
    });
  });
});
