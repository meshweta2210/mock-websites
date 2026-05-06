const { zodiacCompanies, relationshipTypes, pressReleaseTemplates, bodyTemplates } = require('./zodiac-companies');

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomItems(array, count) {
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(getRandomItem(array));
  }
  return result;
}

function formatDate(type) {
  const date = new Date();
  const formats = {
    iso: date.toISOString().split('T')[0], // 2026-05-06
    long: date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), // May 6, 2026
    slash: `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}` // 5/6/2026
  };
  return formats[type] || formats.iso;
}

function generatePressReleases(companyId, count = null) {
  const numReleases = count || (Math.floor(Math.random() * 6) + 7); // 7-12
  const company = zodiacCompanies.find(c => c.id === companyId);
  const otherCompanies = zodiacCompanies.filter(c => c.id !== companyId);

  const releases = [];

  // Objectives and domains for body template placeholders
  const objectives = [
    'accelerate digital transformation',
    'expand market presence',
    'drive innovation',
    'enhance product offerings',
    'improve customer experience',
    'streamline operations',
    'leverage combined expertise'
  ];

  const domains = [
    'artificial intelligence',
    'cloud infrastructure',
    'supply chain management',
    'data analytics',
    'enterprise solutions',
    'digital marketing'
  ];

  for (let i = 0; i < numReleases; i++) {
    const partner = getRandomItem(otherCompanies);
    const relationType = getRandomItem(relationshipTypes);
    const titleTemplate = getRandomItem(pressReleaseTemplates);
    const bodyTemplate = getRandomItem(bodyTemplates);
    const dateFormat = getRandomItem(['iso', 'long', 'slash']);

    // Determine number of relationships (1-3)
    const numRelationships = Math.floor(Math.random() * 3) + 1;
    const partnerCompanies = getRandomItems(otherCompanies.filter(c => c.id !== partner.id), numRelationships - 1);
    partnerCompanies.unshift(partner);

    const title = titleTemplate
      .replace('{company}', company.displayName)
      .replace('{partner}', partner.displayName)
      .replace('{relationship}', relationType.replace(/_/g, ' '));

    const body = bodyTemplate
      .replace('{company}', company.displayName)
      .replace('{partner}', partner.displayName)
      .replace('{objective}', getRandomItem(objectives))
      .replace('{domain}', getRandomItem(domains))
      .replace('{relationship}', relationType.replace(/_/g, ' '));

    const relationships = partnerCompanies.map((partneredCompany, index) => ({
      type: index === 0 ? relationType : getRandomItem(relationshipTypes),
      company: partneredCompany.displayName,
      description: `${(index === 0 ? relationType : getRandomItem(relationshipTypes)).replace(/_/g, ' ')} with ${partneredCompany.displayName}`
    }));

    releases.push({
      id: `pr-${String(i + 1).padStart(3, '0')}`,
      title,
      date: formatDate(dateFormat),
      dateObj: new Date(),
      body,
      company: company.displayName,
      partner: partner.displayName,
      relationships,
      format: Math.random() > 0.8 ? 'pdf' : 'html',
      url: `/pr-${String(i + 1).padStart(3, '0')}.html`
    });
  }

  return releases;
}

module.exports = {
  generatePressReleases,
  getRandomItem,
  getRandomItems,
  formatDate
};
