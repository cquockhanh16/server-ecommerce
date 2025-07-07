const router = require("express").Router();
const DashboardController = require("../controllers/dashboard-controller");

router.get("/dashboard", DashboardController.getDashboardData);

module.exports = router;