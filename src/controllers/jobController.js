const jobService = require("../services/jobService");

async function createJob(req, res) {
  const {
    title,
    requiredSkills,
    minYearsExperience,
    location,
    salaryRange,
    remoteAllowed,
  } = req.body;

  const missingFields = [];

  if (!title) missingFields.push("title");
  if (!requiredSkills) missingFields.push("requiredSkills");
  if (minYearsExperience === undefined) {
    missingFields.push("minYearsExperience");
  }
  if (!location) missingFields.push("location");
  if (!salaryRange) missingFields.push("salaryRange");
  if (remoteAllowed === undefined) {
    missingFields.push("remoteAllowed");
  }

  if (missingFields.length > 0) {
    return res.status(400).json({
      error: "Validation failed",
      message: `${missingFields.join(", ")} ${missingFields.length === 1 ? "is" : "are"} required`,
    });
  }

  if (!Array.isArray(requiredSkills)) {
    return res.status(400).json({
      error: "Validation failed",
      message: "requiredSkills must be an array",
    });
  }

  const validSkillTypes = ["MUST_HAVE", "NICE_TO_HAVE"];

  for (const skill of requiredSkills) {
    if (!skill.name || !skill.type) {
      return res.status(400).json({
        error: "Validation failed",
        message: "Each skill must have a name and type",
      });
    }

    if (!validSkillTypes.includes(skill.type)) {
      return res.status(400).json({
        error: "Validation failed",
        message: "Skill type must be MUST_HAVE or NICE_TO_HAVE",
      });
    }
  }

  if (minYearsExperience < 0) {
    return res.status(400).json({
      error: "Validation failed",
      message: "Minimum years of experience cannot be negative",
    });
  }

  if (
    salaryRange.min === undefined ||
    salaryRange.max === undefined
  ) {
    return res.status(400).json({
      error: "Validation failed",
      message: "Salary range must have min and max",
    });
  }

  if (salaryRange.min < 0 || salaryRange.max < 0) {
    return res.status(400).json({
      error: "Validation failed",
      message: "Salary range cannot contain negative values",
    });
  }

  if (salaryRange.min > salaryRange.max) {
    return res.status(400).json({
      error: "Validation failed",
      message: "Salary range min cannot be greater than max",
    });
  }

  if (typeof remoteAllowed !== "boolean") {
    return res.status(400).json({
      error: "Validation failed",
      message: "remoteAllowed must be a boolean",
    });
  }

  try {
    const job = await jobService.createJob(req.body);

    return res.status(201).json(job);
  } catch (error) {
    console.error("Failed to create job:", error.message);

    return res.status(500).json({
      error: "Internal server error",
      message: "Failed to create job",
    });
  }
}

module.exports = {
  createJob,
};