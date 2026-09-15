const pool = require("../db/database");

async function createCandidate(candidate) {
  const { name, skills, yearsOfExperience, location, expectedSalary } = candidate;

  const result = await pool.query(
    `INSERT INTO candidates 
      (name, skills, years_of_experience, location, expected_salary)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [name, skills, yearsOfExperience, location, expectedSalary]
  );

  return result.rows[0];
}

module.exports = {
  createCandidate,
};