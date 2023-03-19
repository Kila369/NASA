const launchesModel = require("../../models/launches.model");
const { getPagination } = require("../../services/query");

async function getAllLaunches(req, res) {
  const { skip, limit } = getPagination(req.query);
  const launches = await launchesModel.getAllLaunches(skip, limit);
  return res.status(200).json(launches);
}

async function addNewLaunch(req, res) {
  const launch = req.body;

  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res.status(400).json({
      error: "Missing required launch property",
    });
  }

  launch.launchDate = new Date(launch.launchDate);
  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: "Invalid launch date",
    });
  }

  await launchesModel.scheduleNewLaunch(launch);
  return res.status(201).json(launch);
}

async function AbortLaunch(req, res) {
  const launchId = Number(req.params.id);
  const existsLaunch = await launchesModel.existsLaunchWithId(launchId);

  if (!existsLaunch) {
    return res.status(404).json({
      error: "Launch not found",
    });
  }
  const aborted = await launchesModel.AbortLaunchWithId(launchId);
  if (!aborted) {
    return res.status(400).json({
      error: "Launch not aborted",
    });
  } else {
    return res.status(200).json({ ok: true });
  }
}

module.exports = {
  getAllLaunches,
  addNewLaunch,
  AbortLaunch,
};
