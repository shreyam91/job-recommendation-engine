const pool = require("../db/database");
const { calculateJobScore } = require("../scoring/jobScorer");

async function getRecommendations(candidateId, limit = 10) {
  const candidateResult = await pool.query(
    "SELECT * FROM candidates WHERE id = $1",
    [candidateId]
  );

  if (candidateResult.rows.length === 0) {
    return null;
  }

  const jobResult = await pool.query("SELECT * FROM jobs");

  const candidate = candidateResult.rows[0];

  const recommendations = jobResult.rows
    .map((job) => {
      const result = calculateJobScore(candidate, job);

      if (!result) {
        return null;
      }

      return {
        jobId: job.id,
        title: job.title,
        score: result.score,
        breakdown: result.breakdown,
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return recommendations;
}

module.exports = {
  getRecommendations,
};