const recommendationService = require("../services/recommendationService");

async function getRecommendations(req, res) {
  const { id } = req.params;
  const limit = req.query.limit ? Number(req.query.limit) : 10;

if (!Number.isInteger(limit) || limit < 1) {
  return res.status(400).json({
    error: "Validation failed",
    message: "Limit must be a positive integer",
  });
}

  try {
    const recommendations =
      await recommendationService.getRecommendations(id, limit);

    if (recommendations === null) {
      return res.status(404).json({
        error: "Not found",
        message: "Candidate not found",
      });
    }

    return res.json({
      candidateId: Number(id),
      recommendations,
    });
  } catch (error) {
    console.error("Failed to get recommendations:", error.message);

    return res.status(500).json({
      error: "Internal server error",
      message: "Failed to get recommendations",
    });
  }
}

module.exports = {
  getRecommendations,
};