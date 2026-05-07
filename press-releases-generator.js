const fs = require('fs');
const path = require('path');

const RELATIONSHIP_TYPES = [
  'supplier',
  'distributor',
  'marketing_partner',
  'manufacturer',
  'competitor',
  'joint_venture',
  'research_collaboration'
];

// 10 different press release templates covering various relationship types
const PRESS_RELEASE_TEMPLATES = [
  {
    titleTemplate: (company, related) => `${company} Announces Strategic Partnership with ${related} to Expand Market Reach`,
    contentTemplate: (company, related) => `${company} today announced a new strategic partnership with ${related}. This collaboration will enable both companies to combine their strengths and accelerate innovation in the industry. The partnership is expected to deliver significant value to customers through enhanced product offerings and expanded service capabilities. Industry analysts view this alliance as a significant development that will reshape competitive dynamics in the sector.`
  },
  {
    titleTemplate: (company, related) => `${company} Forms Joint Venture with ${related} for Emerging Markets`,
    contentTemplate: (company, related) => `In a landmark move, ${company} and ${related} have established a joint venture to develop cutting-edge solutions for emerging markets. The joint venture will leverage the combined expertise of both organizations to create innovative products and services. This strategic initiative demonstrates both companies' commitment to growth and market expansion. The partnership is projected to generate substantial revenue streams within the first fiscal year.`
  },
  {
    titleTemplate: (company, related) => `${company} Secures Major Distribution Agreement with ${related}`,
    contentTemplate: (company, related) => `${company} announced today that it has entered into a comprehensive distribution agreement with ${related}. Under the terms of the agreement, ${related} will serve as the exclusive distributor of ${company}'s products across key regional markets. This expansion is expected to significantly increase ${company}'s market penetration and revenue growth. The distribution network will provide customers with improved access to ${company}'s full product portfolio.`
  },
  {
    titleTemplate: (company, related) => `${company} and ${related} Launch Joint Research Initiative`,
    contentTemplate: (company, related) => `${company} and ${related} have announced a collaborative research initiative aimed at advancing next-generation technologies. The research collaboration will combine the technical expertise of both organizations to accelerate innovation and bring breakthrough solutions to market faster. The initiative focuses on developing sustainable and scalable solutions that address critical industry challenges. Both companies are committed to making significant investments in this collaborative effort.`
  },
  {
    titleTemplate: (company, related) => `${company} Acquires Key Business Unit from ${related}`,
    contentTemplate: (company, related) => `${company} announced the acquisition of a strategic business unit from ${related} in an all-cash transaction. The acquisition strengthens ${company}'s competitive position and adds complementary capabilities to its existing portfolio. This strategic move enables ${company} to offer comprehensive solutions to enterprise customers. The transaction is expected to be immediately accretive to ${company}'s earnings and cash flow.`
  },
  {
    titleTemplate: (company, related) => `${company} Enters New Market with Support from ${related}`,
    contentTemplate: (company, related) => `${company} announced its entry into a new market segment with strategic support from partner ${related}. The two companies will collaborate to develop market-specific solutions tailored to regional requirements. This expansion demonstrates ${company}'s commitment to diversifying its revenue streams and reaching new customer segments. Industry observers expect this move to have significant implications for market competition and consolidation.`
  },
  {
    titleTemplate: (company, related) => `${company} Signs Supply Agreement with ${related}`,
    contentTemplate: (company, related) => `${company} and ${related} have signed a multi-year supply agreement establishing a long-term commercial relationship. The agreement includes provisions for volume commitments and quality standards that reflect both companies' commitment to operational excellence. This supply partnership ensures ${company} has secure access to critical materials and components. The agreement is structured to provide favorable pricing and delivery terms that will enhance profitability.`
  },
  {
    titleTemplate: (company, related) => `${company} Launches Talent Exchange Program with ${related}`,
    contentTemplate: (company, related) => `${company} and ${related} announced the launch of a talent exchange and professional development program. The initiative will enable employees from both organizations to collaborate on cross-functional projects and accelerate knowledge transfer. This program reflects both companies' commitment to developing industry talent and fostering innovation. Participants will gain exposure to different business practices and emerging technologies across the industry.`
  },
  {
    titleTemplate: (company, related) => `${company} and ${related} Announce Joint Marketing Initiative`,
    contentTemplate: (company, related) => `${company} and ${related} have joined forces to launch an integrated marketing campaign targeting enterprise customers. The co-marketing initiative will leverage the combined brand strength and customer relationships of both organizations. The campaign emphasizes the complementary nature of the two companies' solutions and their combined value proposition. This collaborative approach is expected to drive customer acquisition and market share growth for both parties.`
  },
  {
    titleTemplate: (company, related) => `${company} Establishes Manufacturing Partnership with ${related}`,
    contentTemplate: (company, related) => `${company} has established a manufacturing partnership with ${related} to scale production of its flagship products. The partnership includes dedicated manufacturing capacity and quality assurance protocols aligned with ${company}'s specifications. This strategic manufacturing agreement enables ${company} to meet growing customer demand while optimizing operational costs. The partnership strengthens ${company}'s supply chain resilience and supports long-term growth objectives.`
  }
];

function generatePressReleases(companiesConfig) {
  const companies = companiesConfig.companies;

  // Create press release data for each company
  companies.forEach((company) => {
    const articles = [];
    const otherCompanies = companies.filter(c => c.websiteNumber !== company.websiteNumber);

    for (let i = 1; i <= 10; i++) {
      // Randomly pick a template
      const template = PRESS_RELEASE_TEMPLATES[Math.floor(Math.random() * PRESS_RELEASE_TEMPLATES.length)];

      // Randomly pick a related company
      const relatedCompany = otherCompanies[Math.floor(Math.random() * otherCompanies.length)];

      // Randomly pick a relationship type
      const relationshipType = RELATIONSHIP_TYPES[Math.floor(Math.random() * RELATIONSHIP_TYPES.length)];

      // Calculate date (going back in time: i*7 days + random days)
      const daysAgo = i * 7 + Math.floor(Math.random() * 7);
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      const dateString = date.toISOString().split('T')[0];

      // Determine hasCaptcha (if article number % 5 === 0)
      const hasCaptcha = i % 5 === 0;

      // Determine hasSubPages (if websiteNumber is odd AND article number % 2 === 0)
      const isOddWebsite = company.websiteNumber % 2 === 1;
      const hasSubPages = isOddWebsite && i % 2 === 0;

      // Generate article ID
      const prId = `pr-${String(i).padStart(3, '0')}`;

      // Generate title and content from template
      const title = template.titleTemplate(company.name, relatedCompany.name);
      const content = template.contentTemplate(company.name, relatedCompany.name);

      // Extract excerpt from content (first 150 characters)
      const excerpt = content.substring(0, 150) + '...';

      articles.push({
        id: prId,
        title: title,
        excerpt: excerpt,
        content: content,
        date: dateString,
        relationshipType: relationshipType,
        relatedCompanyName: relatedCompany.name,
        hasCaptcha: hasCaptcha,
        hasSubPages: hasSubPages
      });
    }

    // Create directory if it doesn't exist
    const websiteDir = path.join(__dirname, `website-${company.websiteNumber}`);
    if (!fs.existsSync(websiteDir)) {
      fs.mkdirSync(websiteDir, { recursive: true });
    }

    // Write press-release-data.js file
    const dataFile = path.join(websiteDir, 'press-release-data.js');
    const jsContent = `module.exports = {\n  pressReleases: ${JSON.stringify(articles, null, 2)}\n};\n`;

    fs.writeFileSync(dataFile, jsContent);
    console.log(`Generated: ${dataFile}`);
  });

  console.log(`Successfully generated press release data for ${companies.length} websites (10 articles each, 90 total).`);
}

module.exports = {
  generatePressReleases
};
