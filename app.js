require("dotenv").config();
const express = require("express");
const blogRoutes = require("./routes/blogRoutes");
const connectDB = require("./config/db");
const fs = require("fs");
const path = require("path");
const morgan = require("morgan");
const requestIp = require("request-ip");
const moment = require("moment-timezone");
const { apiReference } = require("@scalar/express-api-reference");
const swaggerSpec = require("./config/swagger");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Connect to MongoDB Atlas
connectDB();

// Middleware untuk menyimpan log ke file
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "./access.log"),
  { flags: "a" },
);

// Middleware untuk mendapatkan alamat IP pengguna
app.use(requestIp.mw());

// Middleware morgan untuk menyimpan log ke file access.log
app.use(
  morgan(
    (tokens, req, res) => {
      const jakartaTimezone = moment.tz("Asia/Jakarta");
      const formattedDateTime = jakartaTimezone.format("DD-MM-YYYY HH:mm:ss");
      const ip = req.clientIp; // Menggunakan clientIp dari request-ip

      return [
        formattedDateTime,
        "IP Address:",
        ip,
        "Method:",
        tokens.method(req, res),
        "URL:",
        tokens.url(req, res),
      ].join(" ");
    },
    { stream: accessLogStream },
  ),
);

// Middleware untuk memeriksa keberadaan ID dalam URL
const checkAccessLogId = (req, res, next) => {
  // Ambil ID dari URL
  const id = req.params.id;

  // Dapatkan ID yang telah ditetapkan
  const accessLogId = require("./config/config").accessLogId;

  // Jika ID tidak sama dengan ID yang telah ditetapkan, tolak permintaan
  if (!id || id !== accessLogId) {
    return res.status(403).json({ message: "Forbidden" });
  }

  // Lanjutkan ke handler berikutnya jika ID ditemukan
  next();
};

const basicAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    res.set("WWW-Authenticate", 'Basic realm="Access Log"');
    return res.status(401).send("Authentication required");
  }

  const base64Credentials = authHeader.split(" ")[1];
  const credentials = Buffer.from(base64Credentials, "base64").toString("utf8");
  const [username, password] = credentials.split(":");

  if (
    username === process.env.ACCESS_LOG_USER &&
    password === process.env.ACCESS_LOG_KEY
  ) {
    return next();
  }

  res.set("WWW-Authenticate", 'Basic realm="Access Log"');
  return res.status(401).send("Invalid credentials");
};

// Endpoint untuk menampilkan file access.log
app.get("/access-log", basicAuth, (req, res) => {
  const accessLogPath = path.join(__dirname, "./access.log");

  fs.readFile(accessLogPath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Internal Server Error" });
    }

    res.set("Content-Type", "text/plain");
    res.send(data);
  });
});

// Use the blog routes
app.use("/api/blogs", blogRoutes());

// Swagger setup
app.use(
  "/docs",
  apiReference({
    spec: { content: swaggerSpec },
  }),
);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
