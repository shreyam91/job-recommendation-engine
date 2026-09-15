function calculateSalaryScore(expectedSalary, salaryRange) {
  const { min, max } = salaryRange;

  if (max < expectedSalary) {
    return 0;
  }

  if (min >= expectedSalary) {
    return 15;
  }

  return ((max - expectedSalary) / (max - min)) * 15;
}

module.exports = {
  calculateSalaryScore,
};