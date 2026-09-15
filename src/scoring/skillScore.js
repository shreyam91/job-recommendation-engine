function hasAllMustHaveSkills(candidateSkills, requiredSkills) {
  const candidateSkillSet = new Set(
    candidateSkills.map((skill) => skill.toLowerCase())
  );

  return requiredSkills
    .filter((skill) => skill.type === "MUST_HAVE")
    .every((skill) => candidateSkillSet.has(skill.name.toLowerCase()));
}

function calculateSkillScore(candidateSkills, requiredSkills) {
  const niceToHaveSkills = requiredSkills.filter(
    (skill) => skill.type === "NICE_TO_HAVE"
  );

  if (niceToHaveSkills.length === 0) {
    return 50;
  }

  const candidateSkillSet = new Set(
    candidateSkills.map((skill) => skill.toLowerCase())
  );

  const matchedNiceToHave = niceToHaveSkills.filter((skill) =>
    candidateSkillSet.has(skill.name.toLowerCase())
  ).length;

  return 35 + (matchedNiceToHave / niceToHaveSkills.length) * 15;
}

module.exports = {
  hasAllMustHaveSkills,
  calculateSkillScore,
};