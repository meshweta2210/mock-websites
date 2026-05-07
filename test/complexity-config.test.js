const assert = require('assert');
const {
  complexityFeatures,
  assignComplexityFeatures,
  getRandomNavigationDepth
} = require('../lib/complexity-config');

describe('Complexity Config Module', () => {
  describe('complexityFeatures array', () => {
    it('should export an array of complexity features', () => {
      assert(Array.isArray(complexityFeatures), 'complexityFeatures should be an array');
    });

    it('should have exactly 6 features', () => {
      assert.strictEqual(complexityFeatures.length, 6, 'Should have 6 complexity features');
    });

    it('should have all expected features', () => {
      const expected = [
        'dynamic_generation',
        'inconsistent_html',
        'pagination',
        'rate_limiting',
        'js_rendering',
        'redirect_chains'
      ];

      expected.forEach(feature => {
        assert(complexityFeatures.includes(feature), `Should include ${feature}`);
      });
    });
  });

  describe('assignComplexityFeatures function', () => {
    it('should return an object with websiteId property', () => {
      const result = assignComplexityFeatures('website-1');
      assert(result.websiteId === 'website-1', 'Should return object with correct websiteId');
    });

    it('should return an object with features array', () => {
      const result = assignComplexityFeatures('website-1');
      assert(Array.isArray(result.features), 'Should have features array');
    });

    it('should assign 2-4 random features', () => {
      for (let i = 0; i < 100; i++) {
        const result = assignComplexityFeatures(`website-${i}`);
        assert(result.features.length >= 2 && result.features.length <= 4,
          `Features count should be 2-4, got ${result.features.length}`);
      }
    });

    it('should include hasFeature method', () => {
      const result = assignComplexityFeatures('website-1');
      assert(typeof result.hasFeature === 'function', 'Should have hasFeature method');
    });

    it('hasFeature method should return boolean', () => {
      const result = assignComplexityFeatures('website-1');
      const isFeatureInArray = result.features[0];
      assert(result.hasFeature(isFeatureInArray) === true, 'Should return true for assigned feature');

      const notInArray = complexityFeatures.find(f => !result.features.includes(f));
      if (notInArray) {
        assert(result.hasFeature(notInArray) === false, 'Should return false for unassigned feature');
      }
    });

    it('assigned features should be valid complexity features', () => {
      const result = assignComplexityFeatures('website-1');
      result.features.forEach(feature => {
        assert(complexityFeatures.includes(feature), `Feature ${feature} should be in complexityFeatures`);
      });
    });

    it('should not have duplicate features', () => {
      const result = assignComplexityFeatures('website-1');
      const uniqueFeatures = new Set(result.features);
      assert.strictEqual(uniqueFeatures.size, result.features.length, 'Should not have duplicate features');
    });
  });

  describe('getRandomNavigationDepth function', () => {
    it('should return a number', () => {
      const result = getRandomNavigationDepth();
      assert(typeof result === 'number', 'Should return a number');
    });

    it('should return values 1, 2, or 3', () => {
      const validValues = new Set();
      for (let i = 0; i < 100; i++) {
        const result = getRandomNavigationDepth();
        assert([1, 2, 3].includes(result), `Should return 1, 2, or 3, got ${result}`);
        validValues.add(result);
      }
      // Verify we get some variety over many calls
      assert(validValues.size > 1, 'Should produce variety of values over multiple calls');
    });

    it('should be inclusive of all three values in reasonable iterations', () => {
      const depths = new Set();
      for (let i = 0; i < 300; i++) {
        depths.add(getRandomNavigationDepth());
      }
      assert.strictEqual(depths.size, 3, 'Should produce all three values (1, 2, 3) in 300 iterations');
    });
  });
});
