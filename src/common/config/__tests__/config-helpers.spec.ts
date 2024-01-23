import { getEnvSecretName, throwIfNotPresent } from '../config-helpers';

describe('Config helpers', () => {
  const value = 'data value';
  const configKey = 'key';
  const secretName = 'sec';

  describe('throwIfNotPresent', () => {
    it('should return value when it exists', () => {
      expect(throwIfNotPresent(value, configKey)).toEqual(value);
    });
    it('should throw error with the configKey in the output', () => {
      expect(
        () => throwIfNotPresent(null, configKey),
      ).toThrow(new Error(`Configuration item ${configKey} was not provided with a value`));
    });
  });
  describe('getEnvSecretName', () => {
    it('should return value when exists', () => {
      expect(getEnvSecretName(secretName)).toEqual(secretName);
    });
    it('should throw error when secret name is not defined', () => {
      expect(
        () => getEnvSecretName(undefined),
      ).toThrow(new Error('Secret name was not provided with a value'));
    });
  });
});
