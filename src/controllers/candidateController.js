const candidateService = require("../services/candidateService");

async function createCandidate(req, res) {
  const {
    name,
    skills,
    yearsOfExperience,
    location,
    expectedSalary,
  } = req.body;

  const missingFields = [];

  if (!name) missingFields.push("name");
  if (!skills) missingFields.push("skills");
  if (yearsOfExperience === undefined) {
    missingFields.push("yearsOfExperience");
  }
  if (!location) missingFields.push("location");
  if (expectedSalary === undefined) {
    missingFields.push("expectedSalary");
  }

  if (missingFields.length > 0) {
    return res.status(400).json({
      error: "Validation failed",
      message: `${missingFields.join(", ")} ${missingFields.length === 1 ? "is" : "are"} required`,
    });
  }

  if (!Array.isArray(skills)) {
    return res.status(400).json({
      error: "Validation failed",
      message: "Skills must be an array",
    });
  }

  if (yearsOfExperience < 0) {
    return res.status(400).json({
      error: "Validation failed",
      message: "Years of experience cannot be negative",
    });
  }

  if (expectedSalary < 0) {
    return res.status(400).json({
      error: "Validation failed",
      message: "Expected salary cannot be negative",
    });
  }

  try {
    const candidate = await candidateService.createCandidate(req.body);

    return res.status(201).json(candidate);
  } catch (error) {
    console.error("Failed to create candidate:", error.message);

    return res.status(500).json({
      error: "Internal server error",
      message: "Failed to create candidate",
    });
  }
}

module.exports = {
  createCandidate,
};