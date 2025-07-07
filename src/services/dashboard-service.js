const Product = require('../models/product-model');
const Order = require('../models/order-model');
const Identity = require('../models/identity-model');
const ModelService = require('./model-service');
const { ORDER_STATUS } = require('../configs/const-config');

class DashboardService {
  static countOrdersByStatus = (startTime, endTime) => {
    return new Promise(async (resolve, reject) => {
      try {
        const option = {};
        if (startTime && !isNaN(startTime) && endTime && !isNaN(endTime)) {
          option.createdAt = { $gte: +startTime, $lte: +endTime };
        }
        const orders = await Order.find(option).select("status").lean();
        const statusCounts = {};
        ORDER_STATUS.forEach((status) => {
          statusCounts[status] = 0;
        });
        orders.forEach((order) => {
          if (statusCounts.hasOwnProperty(order.status)) {
            statusCounts[order.status]++;
          }
        });
        resolve(statusCounts);
      } catch (error) {
        reject(error);
      }
    });
  };

  static groupOrdersOfMonth = (startTime, endTime) => {
    return new Promise(async (resolve, reject) => {
      try {
        // 1. Lấy tất cả đơn hàng completed
        const orders = await Order.find({
          status: "completed",
          ...(startTime &&
            endTime && {
              createdAt: { $gte: +startTime, $lte: +endTime },
            }),
        }).lean();

        // 2. Tính toán thủ công
        const monthlyData = {};

        orders.forEach((order) => {
          // Tính totalBeforeDiscount
          const totalBefore = order.products.reduce((sum, product) => {
            return sum + product.productPrice * product.productQuantity;
          }, 0);

          // Tính totalAmount sau giảm giá
          const totalAmount =
            order.discountValue > 0
              ? totalBefore * (1 - order.discountValue / 100)
              : totalBefore;

          // Nhóm theo tháng/năm
          const date = new Date(order.createdAt);
          const year = date.getFullYear();
          const month = date.getMonth() + 1;
          const key = `${year}-${month}`;

          if (!monthlyData[key]) {
            monthlyData[key] = {
              year,
              month,
              totalRevenue: 0,
              count: 0,
            };
          }

          monthlyData[key].totalRevenue += totalAmount;
          monthlyData[key].count++;
        });

        // 3. Chuyển về dạng mảng và sắp xếp
        const result = Object.values(monthlyData).sort((a, b) => {
          return a.year === b.year ? a.month - b.month : a.year - b.year;
        });

        resolve(result);
      } catch (error) {
        console.error("Lỗi thực sự:", error);
        reject(error);
      }
    });
  };

  /**
   * Retrieves the total count of products, orders, and identities within a specified date range.
   * @param {Object} query - The query parameters containing startDate and endDate.
   * @returns {Promise<Object>} A promise that resolves to an object containing the counts.
   */
  static getDashboardData = (query) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { startDate, endDate } = query;
        const option = {};
        if (startDate && !isNaN(startDate) && endDate && !isNaN(endDate)) {
          option.createdAt = { $gte: +startDate, $lte: +endDate };
        }
        const [
          countProducts,
          countOrders,
          countIdentities,
          countOrdersStatus,
          groupOrdersMonth,
        ] = await Promise.all([
          ModelService.countDocumentOfModel(Product, option),
          ModelService.countDocumentOfModel(Order, option),
          ModelService.countDocumentOfModel(Identity, option),
          this.countOrdersByStatus(
            option.createdAt ? option.createdAt.$gte : null,
            option.createdAt ? option.createdAt.$lte : null
          ),
          this.groupOrdersOfMonth(
            option.createdAt ? option.createdAt.$gte : null,
            option.createdAt ? option.createdAt.$lte : null
          ),
        ]);

        resolve({
          countProducts,
          countOrders,
          countIdentities,
          countOrdersStatus,
          groupOrdersMonth,
        });
      } catch (error) {
        reject(error);
      }
    });
  };
}

module.exports = DashboardService;