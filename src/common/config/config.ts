import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import { getEnvSecretName, throwIfNotPresent } from './config-helpers';

export type Config = {
  isOffline: boolean;
  tarsReplicaDatabaseHostname: string;
  tarsReplicaDatabaseName: string;
  tarsReplicaDatabaseUsername: string;
  tarsReplicaDatabasePassword: string;
};

let configuration: Config;
export const bootstrapConfig = async (): Promise<void> => {
  try {
    const response = await new SecretsManagerClient().send(
      new GetSecretValueCommand({
        SecretId: getEnvSecretName(process.env.SECRET_NAME),
      }),
    );

    const dbCredentials = JSON.parse(<string>response.SecretString);

    configuration = {
      isOffline: !!process.env.IS_OFFLINE,
      tarsReplicaDatabaseHostname: throwIfNotPresent(
        process.env.TARS_REPLICA_HOST_NAME,
        'tarsReplicaDatabaseHostname',
      ),
      tarsReplicaDatabaseName: throwIfNotPresent(
        process.env.TARS_REPLICA_DB_NAME,
        'tarsReplicaDatabaseName',
      ),
      tarsReplicaDatabaseUsername: dbCredentials.username,
      tarsReplicaDatabasePassword: dbCredentials.password,
    };
  } catch (error) {
    const msg = error instanceof Error ? error.message : error;
    throw new Error(`Secret was not retrieved: ${msg}`);
  }
};

export const config = (): Config => configuration;
