const pool = require("../db/database");

async function createJob(job) {
  const {
    title,
    requiredSkills,
    minYearsExperience,
    location,
    salaryRange,
    remoteAllowed,
  } = job;

  const result = await pool.query(
    `INSERT INTO jobs
      (title, required_skills, min_years_experience, location, salary_range, remote_allowed)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      title,
      JSON.stringify(requiredSkills),
      minYearsExperience,
      location,
      JSON.stringify(salaryRange),
      remoteAllowed,
    ]
  );

  return result.rows[0];
}

module.exports = {
  createJob,
};