// Revere/website-template/shared-utils.js
const crypto = require('crypto');

exports.generateCompanyId = (name) => {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
};

exports.generateMathCaptcha = () => {
  const num1 = Math.floor(Math.random() * 20) + 1;
  const num2 = Math.floor(Math.random() * 20) + 1;
  const operators = ['+', '-'];
  const op = operators[Math.floor(Math.random() * operators.length)];
  const question = `${num1} ${op} ${num2}`;
  const answer = op === '+' ? num1 + num2 : num1 - num2;
  return { question, answer: answer.toString(), type: 'math' };
};

exports.generateImageCaptcha = () => {
  const categories = [
    { name: 'cars', correct: [0, 2] },
    { name: 'trees', correct: [1, 3] },
    { name: 'boats', correct: [0, 1] },
    { name: 'clouds', correct: [2, 3] }
  ];
  const selected = categories[Math.floor(Math.random() * categories.length)];
  return {
    question: `Select all images with ${selected.name}`,
    correct: selected.correct,
    type: 'image',
    images: ['img1', 'img2', 'img3', 'img4']
  };
};

exports.hashAnswer = (answer) => {
  return crypto.createHash('sha256').update(answer).digest('hex');
};

exports.getRandomRelationships = (count = 10) => {
  const types = [
    'supplier', 'distributor', 'marketing_partner',
    'manufacturer', 'competitor', 'joint_venture', 'research_collaboration'
  ];
  const relationships = [];
  for (let i = 0; i < count; i++) {
    relationships.push(types[Math.floor(Math.random() * types.length)]);
  }
  return relationships;
};

exports.getOtherCompanies = (currentWebsite, allCompanies) => {
  return allCompanies.filter(c => c.websiteNumber !== currentWebsite);
};

exports.shouldHaveCaptcha = (articleId) => {
  return parseInt(articleId.replace('pr-', '')) % 5 === 0;
};

exports.shouldHaveSubPages = (articleId, websiteNumber) => {
  const tier2Sites = [3, 5, 7, 9];
  if (!tier2Sites.includes(websiteNumber)) return false;
  return parseInt(articleId.replace('pr-', '')) % 2 === 0;
};

exports.formatDate = (daysAgo) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};
