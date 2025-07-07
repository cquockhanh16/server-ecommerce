const DashboardService = require('../services/dashboard-service');
class DashboardController {
  static async getDashboardData(req, res, next) {
    try {
      const data = await DashboardService.getDashboardData(req.query);
      res.status(200).json({
        sts: true,
        data: data,
        message: 'Dashboard data retrieved successfully',
        err: null
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = DashboardController;