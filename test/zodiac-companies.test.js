const assert = require('assert');
const {
  zodiacCompanies,
  relationshipTypes,
  pressReleaseTemplates,
  bodyTemplates
} = require('../lib/zodiac-companies');

describe('Zodiac Companies Module', () => {
  describe('zodiacCompanies array', () => {
    it('should export an array of companies', () => {
      assert(Array.isArray(zodiacCompanies), 'zodiacCompanies should be an array');
    });

    it('should have exactly 9 companies', () => {
      assert.strictEqual(zodiacCompanies.length, 9, 'Should have 9 zodiac companies');
    });

    it('should have all required zodiac signs', () => {
      const expectedSigns = ['taurus', 'pisces', 'libra', 'scorpio', 'leo', 'virgo', 'gemini', 'aries', 'aquarius'];
      const actualIds = zodiacCompanies.map(c => c.id);

      expectedSigns.forEach(sign => {
        assert(actualIds.includes(sign), `Should include ${sign}`);
      });
    });

    it('each company should have id, name, and displayName', () => {
      zodiacCompanies.forEach(company => {
        assert(company.id, 'Company should have an id');
        assert(company.name, 'Company should have a name');
        assert(company.displayName, 'Company should have a displayName');
        assert(typeof company.id === 'string', 'Company id should be a string');
        assert(typeof company.name === 'string', 'Company name should be a string');
        assert(typeof company.displayName === 'string', 'Company displayName should be a string');
      });
    });
  });

  describe('relationshipTypes array', () => {
    it('should export an array of relationship types', () => {
      assert(Array.isArray(relationshipTypes), 'relationshipTypes should be an array');
    });

    it('should have exactly 7 relationship types', () => {
      assert.strictEqual(relationshipTypes.length, 7, 'Should have 7 relationship types');
    });

    it('should have all expected relationship types', () => {
      const expected = [
        'partnership',
        'research_collaboration',
        'joint_venture',
        'investor_relations',
        'distribution_logistics',
        'marketing_initiative',
        'manufacturing_agreement'
      ];

      expected.forEach(type => {
        assert(relationshipTypes.includes(type), `Should include ${type}`);
      });
    });
  });

  describe('pressReleaseTemplates array', () => {
    it('should export an array of press release templates', () => {
      assert(Array.isArray(pressReleaseTemplates), 'pressReleaseTemplates should be an array');
    });

    it('should have exactly 7 title templates', () => {
      assert.strictEqual(pressReleaseTemplates.length, 7, 'Should have 7 title templates');
    });

    it('each template should contain {company} and {partner} placeholders', () => {
      pressReleaseTemplates.forEach((template, index) => {
        assert(template.includes('{company}'), `Template ${index} should have {company} placeholder`);
        assert(template.includes('{partner}'), `Template ${index} should have {partner} placeholder`);
      });
    });
  });

  describe('bodyTemplates array', () => {
    it('should export an array of body templates', () => {
      assert(Array.isArray(bodyTemplates), 'bodyTemplates should be an array');
    });

    it('should have exactly 4 body templates', () => {
      assert.strictEqual(bodyTemplates.length, 4, 'Should have 4 body templates');
    });

    it('each template should contain required placeholders', () => {
      bodyTemplates.forEach((template, index) => {
        assert(template.includes('{company}'), `Template ${index} should have {company} placeholder`);
        assert(template.includes('{partner}'), `Template ${index} should have {partner} placeholder`);
        assert(template.includes('{objective}') || template.includes('{relationship}'), `Template ${index} should have {objective} or {relationship} placeholder`);
      });
    });
  });
});
