import { RDS } from 'aws-sdk';

export const throwIfNotPresent = (value: string | null | undefined, configKey: string) => {
  if (!value || value.trim().length === 0) {
    throw new Error(`Configuration item ${configKey} was not provided with a value`);
  }
  return value;
};

export const getEnvSecretName = (name: string | undefined) => {
  if (!name || name.trim().length === 0) {
    throw new Error('Secret name was not provided with a value');
  }
  return name;
};

const iamRdsConfigValid = (hostname: string | undefined, username: string | undefined) => {
  const hostnameValid = hostname && hostname.trim().length > 0;
  const usernameValid = username && username.trim().length > 0;
  return hostnameValid && usernameValid;
};

export const generateSignerOptions = (
  hostname: string | undefined,
  username: string | undefined,
): RDS.Signer.SignerOptions => ({
  username,
  hostname,
  port: 3306,
  region: process.env.AWS_REGION,
});

export const tryFetchRdsAccessToken = async (
  hostname: string | undefined,
  username: string | undefined,
  fallbackEnvvar: string,
): Promise<string> => {
  if (!iamRdsConfigValid(hostname, username)) {
    const envvar = process.env[fallbackEnvvar];
    if (!envvar) {
      throw new Error(`No value for fallback envvar ${fallbackEnvvar} for config`);
    }
    return envvar;
  }

  throwIfNotPresent(hostname, 'tarsReplicateDatabaseHostname');
  throwIfNotPresent(username, 'tarsReplicaDatabaseUsername');

  const signer = new RDS.Signer();
  const signerOptions = generateSignerOptions(hostname, username);
  return new Promise((resolve) => {
    signer.getAuthToken(signerOptions, (err, token) => {
      if (err) {
        if (process.env.IS_OFFLINE === 'true') {
          resolve('localhost');
        } else {
          throw new Error(`Generating an auth token failed. Error message: ${err.message}`);
        }
      }
      resolve(token);
    });
  });
};
