const complexityFeatures = [
  'dynamic_generation',
  'inconsistent_html',
  'pagination',
  'rate_limiting',
  'js_rendering',
  'redirect_chains'
];

function assignComplexityFeatures(websiteId) {
  // Each website gets 2-4 random features
  const numFeatures = Math.floor(Math.random() * 3) + 2; // 2-4
  const shuffled = complexityFeatures.slice().sort(() => Math.random() - 0.5);
  const assigned = shuffled.slice(0, numFeatures);

  return {
    websiteId,
    features: assigned,
    hasFeature: (feature) => assigned.includes(feature)
  };
}

function getRandomNavigationDepth() {
  // 1, 2, or 3 levels
  return Math.floor(Math.random() * 3) + 1;
}

module.exports = {
  complexityFeatures,
  assignComplexityFeatures,
  getRandomNavigationDepth
};
