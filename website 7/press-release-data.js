const { generatePressReleases } = require('../lib/press-release-generator');

// Store generated releases in memory (reusable across requests)
let cachedReleases = null;
let cachedCompanyId = null;

/**
 * Get press releases for the company
 * Caches releases so they're consistent across requests
 * @param {number} count - Number of releases to generate (optional)
 * @returns {Array} Array of press release objects
 */
function getPressReleases(count = null) {
  const companyId = process.env.COMPANY_ID;
  // Return cached releases if they exist and match the company ID
  if (cachedReleases && cachedCompanyId === companyId) {
    return cachedReleases;
  }

  // Generate new releases
  cachedReleases = generatePressReleases(companyId, count);
  cachedCompanyId = companyId;

  return cachedReleases;
}

/**
 * Get a specific press release by ID
 * @param {string} id - The press release ID (e.g., 'pr-001')
 * @returns {Object|null} Press release object or null if not found
 */
function getPressReleaseById(id) {
  const releases = getPressReleases();
  return releases.find(release => release.id === id) || null;
}

module.exports = {
  getPressReleases,
  getPressReleaseById
};
