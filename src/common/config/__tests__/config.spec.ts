import { mockClient } from 'aws-sdk-client-mock';
import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import { bootstrapConfig, config } from '../config';

describe('Config', () => {
  const client = mockClient(SecretsManagerClient);
  const mockSecret = {
    username: 'user',
    password: 'pword',
  };

  beforeEach(() => {
    process.env.TARS_REPLICA_HOST_NAME = 'host';
    process.env.TARS_REPLICA_DB_NAME = 'name';
    process.env.SECRET_NAME = 'secret';
  });

  describe('bootstrapConfig', () => {
    it('should resolve the SecretString and not throw when env vars present', async () => {
      // ARRANGE
      client.on(GetSecretValueCommand).resolves({ SecretString: JSON.stringify(mockSecret) });

      try {
        await bootstrapConfig();
      } catch (err) {
        fail(err);
      }
    });

    it('should create a config, and check for its existence', async () => {
      // ARRANGE
      client.on(GetSecretValueCommand).resolves({ SecretString: JSON.stringify(mockSecret) });

      try {
        await bootstrapConfig();
      } catch (err) {
        fail(err);
      }

      expect(config()).not.toBeUndefined();
    });

    it('should resolve the SecretString, but throw when env vars not present', async () => {
      // ASSERT
      process.env.TARS_REPLICA_HOST_NAME = undefined;
      // ARRANGE
      client.on(GetSecretValueCommand).resolves({ SecretString: JSON.stringify(mockSecret) });

      try {
        await bootstrapConfig();
      } catch (err) {
        expect(err).toEqual(new Error('Secret was not retrieved: Secret name was not provided with a value'));
      }
    });

    it('should reject if unable to retrieve secret from AWS ', async () => {
      // ARRANGE
      client.on(GetSecretValueCommand).rejects(new Error('AWS was down so not secret available'));

      try {
        await bootstrapConfig();
      } catch (err) {
        expect(err).toEqual(new Error('Secret was not retrieved: AWS was down so not secret available'));
      }
    });
  });
});
