// app.js
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const path = require("path");
const expressRateLimit = require("express-rate-limit");
const app = express();
const limiter = expressRateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 100, // Giới hạn mỗi IP 100 request trong 15 phút
  message: "Quá nhiều request từ IP này, vui lòng thử lại sau 15 phút",
  validate: {
    trustProxy: false, // Tắt validate trust proxy nếu bạn đã cấu hình ở app level
  },
});

const { deleteFileImageCloudinary } = require("./utils/delete-image");

const connectDB = require("./configs/db-config");
// const setupCronJobs = require("./configs/cron-config");

// require router
const productRouter = require("./routers/product-router");
const brandRouter = require("./routers/brand-router");
const collectionRouter = require("./routers/collection-router");
const categoryRouter = require("./routers/category-router");
const authRouter = require("./routers/auth-router");

app.set("view engine", "ejs"); // Đặt view engine là EJS
app.set("views", path.join(__dirname, "views")); // Thư mục chứa các file EJS
// Dành cho Render.com hoặc các dịch vụ cloud
app.set("trust proxy", ["loopback", "linklocal", "uniquelocal"]);
// Hoặc đơn giản hơn (nhưng kém an toàn hơn)
app.set("trust proxy", true);
// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(cors());
// app.use(
//   cors({
//     origin: [
//       "http://localhost:5173", // Địa chỉ FE local
//       "https://datn-server-c9cu.onrender.com", // Địa chỉ BE trên Render
//     ],
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true,
//   })
// );

app.use(helmet());
app.use(compression());
app.use(morgan("dev"));
app.use(limiter);

// Routes
app.use("/api", productRouter);
app.use("/api", categoryRouter);
app.use("/api", brandRouter);
app.use("/api", collectionRouter);
app.use("/api", authRouter);

// handle api not declared
app.use((req, res) => {
  return res
    .status(404)
    .json({ sts: false, err: "Api chưa được định nghĩa", data: null });
});

// router handle error
app.use(async (error, req, res, next) => {
  if (req.file && req.file.path) {
    await deleteFileImageCloudinary(req.file.path);
  }
  console.log(error);
  res.status(error.code || 500).json({
    sts: false,
    err: error.message ? error.message : error ? error : "Lỗi serser",
    data: null,
  });
});

async function startServer() {
  try {
    await connectDB();
    // setupCronJobs();
  } catch (error) {
    console.error("Failed to start application:", error);
    process.exit(1);
  }
}

startServer();

module.exports = app;
