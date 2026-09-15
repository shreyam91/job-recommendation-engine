function calculateLocationScore(candidateLocation, jobLocation, remoteAllowed) {
  if (candidateLocation.toLowerCase() === jobLocation.toLowerCase()) {
    return 15;
  }

  if (remoteAllowed) {
    return 10;
  }

  return 0;
}

module.exports = {
  calculateLocationScore,
};