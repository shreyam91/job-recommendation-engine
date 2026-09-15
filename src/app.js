const express = require("express");
const pool = require("./db/database");
const candidateRoutes = require("./routes/candidateRoutes");
const jobRoutes = require("./routes/jobRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");

const app = express();

app.use(express.json());
app.use("/api/candidates", candidateRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/candidates", recommendationRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Job Recommendation API is running" });
});

pool.query("SELECT NOW()", (error) => {
  if (error) {
    console.error("Database connection failed:", error.message);
    return;
  }

  console.log("Database connected");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});