const express = require("express");

const {
  getAllLaunches,
  addNewLaunch,
  AbortLaunch,
} = require("./launches.controller");

const launchesRouter = express.Router();

launchesRouter.get("/", getAllLaunches);
launchesRouter.post("/", addNewLaunch);
launchesRouter.delete("/:id", AbortLaunch);

module.exports = launchesRouter;
