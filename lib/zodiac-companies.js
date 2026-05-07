const zodiacCompanies = [
  { id: 'taurus', name: 'Taurus', displayName: 'Taurus Company' },
  { id: 'pisces', name: 'Pisces', displayName: 'Pisces Company' },
  { id: 'libra', name: 'Libra', displayName: 'Libra Company' },
  { id: 'scorpio', name: 'Scorpio', displayName: 'Scorpio Company' },
  { id: 'leo', name: 'Leo', displayName: 'Leo Company' },
  { id: 'virgo', name: 'Virgo', displayName: 'Virgo Company' },
  { id: 'gemini', name: 'Gemini', displayName: 'Gemini Company' },
  { id: 'aries', name: 'Aries', displayName: 'Aries Company' },
  { id: 'aquarius', name: 'Aquarius', displayName: 'Aquarius Company' }
];

const relationshipTypes = [
  'partnership',
  'research_collaboration',
  'joint_venture',
  'investor_relations',
  'distribution_logistics',
  'marketing_initiative',
  'manufacturing_agreement'
];

const pressReleaseTemplates = [
  '{company} Announces Strategic Partnership with {partner}',
  '{company} and {partner} Launch Joint Research Initiative',
  '{company} Receives Investment from {partner}',
  '{company} Expands Distribution with {partner} Agreement',
  '{company} Collaborates with {partner} on {relationship} Project',
  '{company} Forms Manufacturing Alliance with {partner}',
  '{company} Partners with {partner} for Market Expansion'
];

const bodyTemplates = [
  '{company} today announced a strategic partnership with {partner}. The collaboration aims to {objective}.',
  '{company} and {partner} have joined forces to {objective}. The partnership combines expertise in {domain}.',
  '{company} is pleased to announce a new agreement with {partner}. This {relationship} strengthens {company}\'s position in the market.',
  'In a landmark deal, {company} and {partner} have agreed to {objective}. The partnership focuses on {domain}.'
];

module.exports = {
  zodiacCompanies,
  relationshipTypes,
  pressReleaseTemplates,
  bodyTemplates
};
