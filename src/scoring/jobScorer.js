const {
  hasAllMustHaveSkills,
  calculateSkillScore,
} = require("./skillScore");
const { calculateExperienceScore } = require("./experienceScore");
const { calculateLocationScore } = require("./locationScore");
const { calculateSalaryScore } = require("./salaryScore");

function calculateJobScore(candidate, job) {
  if (!hasAllMustHaveSkills(candidate.skills, job.required_skills)) {
    return null;
  }

  const skills = calculateSkillScore(
    candidate.skills,
    job.required_skills
  );

  const experience = calculateExperienceScore(
    candidate.years_of_experience,
    job.min_years_experience
  );

  const location = calculateLocationScore(
    candidate.location,
    job.location,
    job.remote_allowed
  );

  const salary = calculateSalaryScore(
    candidate.expected_salary,
    job.salary_range
  );

  const total = skills + experience + location + salary;

  return {
    score: Math.round(total),
    breakdown: {
      skills: Math.round(skills),
      experience: Math.round(experience),
      location,
      salary: Math.round(salary),
    },
  };
}

module.exports = {
  calculateJobScore,
};