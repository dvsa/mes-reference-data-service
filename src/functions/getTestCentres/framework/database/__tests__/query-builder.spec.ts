import { getTestCentres, TC_QUERY } from '../query-builder';

describe('Query builder', () => {
  describe('getTestCentres', () => {
    it('should return the test centre query', () => {
      expect(getTestCentres()).toEqual(TC_QUERY);
    });
  });
});
