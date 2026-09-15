function calculateExperienceScore(candidateYears, minYears) {
  if (candidateYears >= minYears) {
    return 20;
  }

  if (minYears === 0) {
    return 20;
  }

  return (candidateYears / minYears) * 20;
}

module.exports = {
  calculateExperienceScore,
};