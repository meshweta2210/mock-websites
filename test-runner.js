#!/usr/bin/env node
// Manual test runner to verify the implementation without mocha

const assert = require('assert');

// Import modules
const { zodiacCompanies, relationshipTypes, pressReleaseTemplates, bodyTemplates } = require('./lib/zodiac-companies');
const { complexityFeatures, assignComplexityFeatures, getRandomNavigationDepth } = require('./lib/complexity-config');
const { generatePressReleases, getRandomItem, getRandomItems, formatDate } = require('./lib/press-release-generator');

let testsPassed = 0;
let testsFailed = 0;

function test(name, fn) {
  try {
    fn();
    testsPassed++;
    console.log(`✓ ${name}`);
  } catch (error) {
    testsFailed++;
    console.error(`✗ ${name}`);
    console.error(`  ${error.message}`);
  }
}

console.log('\n=== ZODIAC COMPANIES TESTS ===\n');

test('zodiacCompanies should be an array', () => {
  assert(Array.isArray(zodiacCompanies));
});

test('zodiacCompanies should have 9 companies', () => {
  assert.strictEqual(zodiacCompanies.length, 9);
});

test('zodiacCompanies should have all zodiac signs', () => {
  const expectedSigns = ['taurus', 'pisces', 'libra', 'scorpio', 'leo', 'virgo', 'gemini', 'aries', 'aquarius'];
  const actualIds = zodiacCompanies.map(c => c.id);
  expectedSigns.forEach(sign => {
    assert(actualIds.includes(sign));
  });
});

test('relationshipTypes should have 7 types', () => {
  assert.strictEqual(relationshipTypes.length, 7);
});

test('pressReleaseTemplates should have 7 templates', () => {
  assert.strictEqual(pressReleaseTemplates.length, 7);
});

test('bodyTemplates should have 4 templates', () => {
  assert.strictEqual(bodyTemplates.length, 4);
});

console.log('\n=== COMPLEXITY CONFIG TESTS ===\n');

test('complexityFeatures should be an array with 6 features', () => {
  assert(Array.isArray(complexityFeatures));
  assert.strictEqual(complexityFeatures.length, 6);
});

test('assignComplexityFeatures should return object with websiteId', () => {
  const result = assignComplexityFeatures('test-site');
  assert.strictEqual(result.websiteId, 'test-site');
});

test('assignComplexityFeatures should assign 2-4 features', () => {
  for (let i = 0; i < 100; i++) {
    const result = assignComplexityFeatures(`site-${i}`);
    assert(result.features.length >= 2 && result.features.length <= 4);
  }
});

test('assignComplexityFeatures should have hasFeature method', () => {
  const result = assignComplexityFeatures('test');
  assert(typeof result.hasFeature === 'function');
  assert(result.hasFeature(result.features[0]) === true);
});

test('getRandomNavigationDepth should return 1, 2, or 3', () => {
  const depths = new Set();
  for (let i = 0; i < 100; i++) {
    const depth = getRandomNavigationDepth();
    assert([1, 2, 3].includes(depth));
    depths.add(depth);
  }
  assert(depths.size > 1);
});

console.log('\n=== PRESS RELEASE GENERATOR TESTS ===\n');

test('getRandomItem should return item from array', () => {
  const array = ['a', 'b', 'c'];
  const item = getRandomItem(array);
  assert(array.includes(item));
});

test('getRandomItems should return correct count', () => {
  for (let count = 1; count <= 5; count++) {
    const items = getRandomItems(['a', 'b', 'c', 'd'], count);
    assert.strictEqual(items.length, count);
  }
});

test('formatDate should format as ISO', () => {
  const date = formatDate('iso');
  assert(/^\d{4}-\d{2}-\d{2}$/.test(date));
});

test('formatDate should format as long', () => {
  const date = formatDate('long');
  assert(/^[A-Za-z]+ \d{1,2}, \d{4}$/.test(date));
});

test('formatDate should format as slash', () => {
  const date = formatDate('slash');
  assert(/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(date));
});

test('generatePressReleases should return array', () => {
  const releases = generatePressReleases('taurus');
  assert(Array.isArray(releases));
});

test('generatePressReleases should generate 7-12 releases by default', () => {
  for (let i = 0; i < 20; i++) {
    const releases = generatePressReleases('taurus');
    assert(releases.length >= 7 && releases.length <= 12);
  }
});

test('generatePressReleases should generate specified count', () => {
  const releases = generatePressReleases('taurus', 10);
  assert.strictEqual(releases.length, 10);
});

test('generatePressReleases should have unique sequential IDs', () => {
  const releases = generatePressReleases('taurus', 5);
  const ids = releases.map(r => r.id);
  assert.deepStrictEqual(ids, ['pr-001', 'pr-002', 'pr-003', 'pr-004', 'pr-005']);
});

test('generatePressReleases should have all required properties', () => {
  const releases = generatePressReleases('taurus', 3);
  const required = ['id', 'title', 'date', 'dateObj', 'body', 'company', 'partner', 'relationships', 'format', 'url'];
  releases.forEach((release, i) => {
    required.forEach(prop => {
      assert(release.hasOwnProperty(prop), `Release ${i} missing ${prop}`);
    });
  });
});

test('generatePressReleases should have mixed date formats', () => {
  const releases = generatePressReleases('taurus', 20);
  const formats = new Set();
  releases.forEach(r => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(r.date)) formats.add('iso');
    else if (/^[A-Za-z]+ \d{1,2}, \d{4}$/.test(r.date)) formats.add('long');
    else if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(r.date)) formats.add('slash');
  });
  assert(formats.size > 1);
});

test('generatePressReleases should have valid relationships count (1-3)', () => {
  const releases = generatePressReleases('taurus', 10);
  releases.forEach((release, i) => {
    assert(release.relationships.length >= 1 && release.relationships.length <= 3,
      `Release ${i} has ${release.relationships.length} relationships`);
  });
});

test('generatePressReleases should have partner different from company', () => {
  const releases = generatePressReleases('taurus', 5);
  releases.forEach((release, i) => {
    assert(release.partner !== release.company,
      `Release ${i}: partner should differ from company`);
  });
});

test('generatePressReleases should include company name in title', () => {
  const releases = generatePressReleases('taurus', 5);
  releases.forEach((release, i) => {
    assert(release.title.includes(release.company),
      `Release ${i}: title should contain company`);
  });
});

test('generatePressReleases should include company name in body', () => {
  const releases = generatePressReleases('taurus', 5);
  releases.forEach((release, i) => {
    assert(release.body.includes(release.company),
      `Release ${i}: body should contain company`);
  });
});

test('generatePressReleases should have valid format (html or pdf)', () => {
  const releases = generatePressReleases('taurus', 20);
  releases.forEach((release, i) => {
    assert(['html', 'pdf'].includes(release.format),
      `Release ${i}: invalid format ${release.format}`);
  });
});

test('generatePressReleases should have valid URLs', () => {
  const releases = generatePressReleases('taurus', 5);
  releases.forEach((release, i) => {
    assert(/^\/pr-\d{3}\.html$/.test(release.url),
      `Release ${i}: invalid URL ${release.url}`);
  });
});

test('generatePressReleases should work with all zodiac companies', () => {
  zodiacCompanies.forEach(company => {
    const releases = generatePressReleases(company.id, 2);
    assert.strictEqual(releases.length, 2);
    assert(releases[0].company);
  });
});

test('generatePressReleases should have valid relationship types', () => {
  const releases = generatePressReleases('taurus', 10);
  releases.forEach((release, i) => {
    release.relationships.forEach((rel, j) => {
      assert(relationshipTypes.includes(rel.type),
        `Release ${i} rel ${j}: invalid type ${rel.type}`);
    });
  });
});

console.log(`\n=== RESULTS ===\n`);
console.log(`Passed: ${testsPassed}`);
console.log(`Failed: ${testsFailed}`);
console.log(`Total: ${testsPassed + testsFailed}\n`);

if (testsFailed === 0) {
  console.log('All tests passed!');
  process.exit(0);
} else {
  console.log(`${testsFailed} test(s) failed!`);
  process.exit(1);
}
