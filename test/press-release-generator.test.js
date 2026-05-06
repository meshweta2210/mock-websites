const assert = require('assert');
const {
  generatePressReleases,
  getRandomItem,
  getRandomItems,
  formatDate
} = require('../lib/press-release-generator');
const { zodiacCompanies } = require('../lib/zodiac-companies');

describe('Press Release Generator Module', () => {
  describe('getRandomItem function', () => {
    it('should return an item from the array', () => {
      const array = ['a', 'b', 'c'];
      const result = getRandomItem(array);
      assert(array.includes(result), 'Should return an item from the array');
    });

    it('should work with single-element arrays', () => {
      const array = ['only'];
      const result = getRandomItem(array);
      assert.strictEqual(result, 'only', 'Should return the only item');
    });

    it('should return objects from object arrays', () => {
      const array = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const result = getRandomItem(array);
      assert(array.includes(result), 'Should return an object from array');
    });
  });

  describe('getRandomItems function', () => {
    it('should return an array', () => {
      const result = getRandomItems(['a', 'b', 'c'], 2);
      assert(Array.isArray(result), 'Should return an array');
    });

    it('should return requested count of items', () => {
      const array = ['a', 'b', 'c', 'd', 'e'];
      for (let count = 1; count <= 5; count++) {
        const result = getRandomItems(array, count);
        assert.strictEqual(result.length, count, `Should return ${count} items`);
      }
    });

    it('should return items from the source array', () => {
      const array = ['a', 'b', 'c', 'd'];
      const result = getRandomItems(array, 10);
      result.forEach(item => {
        assert(array.includes(item), `Item ${item} should be from source array`);
      });
    });

    it('should allow duplicates', () => {
      const array = ['a'];
      const result = getRandomItems(array, 5);
      assert.strictEqual(result.length, 5, 'Should allow duplicates from single-item array');
      result.forEach(item => {
        assert.strictEqual(item, 'a', 'All items should be "a"');
      });
    });
  });

  describe('formatDate function', () => {
    it('should return a string', () => {
      const result = formatDate('iso');
      assert(typeof result === 'string', 'Should return a string');
    });

    it('should format date as ISO (YYYY-MM-DD)', () => {
      const result = formatDate('iso');
      const isoRegex = /^\d{4}-\d{2}-\d{2}$/;
      assert(isoRegex.test(result), `ISO format should be YYYY-MM-DD, got ${result}`);
    });

    it('should format date as long (Month DD, YYYY)', () => {
      const result = formatDate('long');
      const longRegex = /^[A-Za-z]+ \d{1,2}, \d{4}$/;
      assert(longRegex.test(result), `Long format should be "Month DD, YYYY", got ${result}`);
    });

    it('should format date as slash (M/DD/YYYY)', () => {
      const result = formatDate('slash');
      const slashRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
      assert(slashRegex.test(result), `Slash format should be M/DD/YYYY, got ${result}`);
    });

    it('should default to iso format for unknown type', () => {
      const result = formatDate('unknown');
      const isoRegex = /^\d{4}-\d{2}-\d{2}$/;
      assert(isoRegex.test(result), 'Should default to ISO format');
    });
  });

  describe('generatePressReleases function', () => {
    it('should return an array', () => {
      const result = generatePressReleases('taurus');
      assert(Array.isArray(result), 'Should return an array');
    });

    it('should generate 7-12 releases by default', () => {
      for (let i = 0; i < 20; i++) {
        const result = generatePressReleases('taurus');
        assert(result.length >= 7 && result.length <= 12,
          `Should generate 7-12 releases, got ${result.length}`);
      }
    });

    it('should generate specified count when provided', () => {
      const result = generatePressReleases('taurus', 10);
      assert.strictEqual(result.length, 10, 'Should generate exact count when specified');
    });

    it('should have unique IDs in sequence', () => {
      const result = generatePressReleases('taurus', 5);
      const ids = result.map(r => r.id);
      assert.deepStrictEqual(ids, ['pr-001', 'pr-002', 'pr-003', 'pr-004', 'pr-005'],
        'IDs should be sequential pr-001, pr-002, etc.');
    });

    it('each release should have required properties', () => {
      const result = generatePressReleases('taurus', 3);
      const requiredProps = ['id', 'title', 'date', 'dateObj', 'body', 'company', 'partner', 'relationships', 'format', 'url'];

      result.forEach((release, index) => {
        requiredProps.forEach(prop => {
          assert(release.hasOwnProperty(prop), `Release ${index} should have ${prop}`);
        });
      });
    });

    it('should have valid date formats in mixed styles', () => {
      const result = generatePressReleases('taurus', 20);
      const dateFormats = new Set();

      result.forEach(release => {
        assert(typeof release.date === 'string', 'date should be a string');
        // Detect format
        if (/^\d{4}-\d{2}-\d{2}$/.test(release.date)) {
          dateFormats.add('iso');
        } else if (/^[A-Za-z]+ \d{1,2}, \d{4}$/.test(release.date)) {
          dateFormats.add('long');
        } else if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(release.date)) {
          dateFormats.add('slash');
        } else {
          assert.fail(`Unknown date format: ${release.date}`);
        }
      });

      // With 20 releases, we should see variety in date formats
      assert(dateFormats.size > 1, 'Should use mixed date formats across releases');
    });

    it('dateObj should be a Date object', () => {
      const result = generatePressReleases('taurus', 3);
      result.forEach((release, index) => {
        assert(release.dateObj instanceof Date, `Release ${index} dateObj should be a Date object`);
      });
    });

    it('each release should reference 1-3 other zodiac companies', () => {
      const result = generatePressReleases('taurus', 10);

      result.forEach((release, index) => {
        assert(Array.isArray(release.relationships), `Release ${index} relationships should be an array`);
        assert(release.relationships.length >= 1 && release.relationships.length <= 3,
          `Release ${index} should have 1-3 relationships, got ${release.relationships.length}`);

        release.relationships.forEach(rel => {
          assert(rel.type, `Relationship should have type`);
          assert(rel.company, `Relationship should have company`);
          assert(rel.description, `Relationship should have description`);
        });
      });
    });

    it('partner should be different from company', () => {
      const result = generatePressReleases('taurus', 10);

      result.forEach((release, index) => {
        assert(release.partner !== release.company,
          `Release ${index}: partner should be different from company (${release.company} != ${release.partner})`);
      });
    });

    it('partner should be from zodiac companies', () => {
      const validCompanies = zodiacCompanies.map(c => c.displayName);
      const result = generatePressReleases('taurus', 10);

      result.forEach((release, index) => {
        assert(validCompanies.includes(release.partner),
          `Release ${index}: partner ${release.partner} should be a valid zodiac company`);
      });
    });

    it('company should match the provided company ID', () => {
      const result = generatePressReleases('taurus', 5);
      const taurusDisplay = zodiacCompanies.find(c => c.id === 'taurus').displayName;

      result.forEach((release, index) => {
        assert.strictEqual(release.company, taurusDisplay,
          `Release ${index}: company should match provided ID`);
      });
    });

    it('title should contain company and partner names', () => {
      const result = generatePressReleases('taurus', 5);

      result.forEach((release, index) => {
        assert(release.title.includes(release.company),
          `Release ${index}: title should contain company name`);
        assert(release.title.includes(release.partner),
          `Release ${index}: title should contain partner name`);
      });
    });

    it('body should contain company and partner names', () => {
      const result = generatePressReleases('taurus', 5);

      result.forEach((release, index) => {
        assert(release.body.includes(release.company),
          `Release ${index}: body should contain company name`);
        assert(release.body.includes(release.partner),
          `Release ${index}: body should contain partner name`);
      });
    });

    it('format should be html or pdf', () => {
      const result = generatePressReleases('taurus', 20);

      result.forEach((release, index) => {
        assert(['html', 'pdf'].includes(release.format),
          `Release ${index}: format should be html or pdf, got ${release.format}`);
      });
    });

    it('url should follow pattern /pr-NNN.html', () => {
      const result = generatePressReleases('taurus', 5);

      result.forEach((release, index) => {
        assert(/^\/pr-\d{3}\.html$/.test(release.url),
          `Release ${index}: url should follow pattern /pr-NNN.html, got ${release.url}`);
      });
    });

    it('should work with all zodiac company IDs', () => {
      const companyIds = zodiacCompanies.map(c => c.id);

      companyIds.forEach(id => {
        const result = generatePressReleases(id, 2);
        assert.strictEqual(result.length, 2, `Should work with company ${id}`);
        assert(result[0].company, `Release should have company for ${id}`);
      });
    });

    it('relationships should contain valid relationship types', () => {
      const { relationshipTypes } = require('../lib/zodiac-companies');
      const result = generatePressReleases('taurus', 10);

      result.forEach((release, index) => {
        release.relationships.forEach((rel, relIndex) => {
          assert(relationshipTypes.includes(rel.type),
            `Release ${index} relationship ${relIndex}: type should be valid, got ${rel.type}`);
        });
      });
    });

    it('should generate unique releases on multiple calls', () => {
      const call1 = generatePressReleases('taurus', 5);
      const call2 = generatePressReleases('taurus', 5);

      // IDs should be the same (always pr-001 to pr-005)
      assert.deepStrictEqual(
        call1.map(r => r.id),
        call2.map(r => r.id),
        'IDs should be consistent'
      );

      // But content should differ (at least some releases)
      const contents1 = call1.map(r => r.title).join('|');
      const contents2 = call2.map(r => r.title).join('|');

      assert.notStrictEqual(contents1, contents2,
        'Different calls should generate different content due to randomness');
    });
  });
});
