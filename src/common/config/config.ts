import { GetSecretValueCommand, SecretsManager } from '@aws-sdk/client-secrets-manager';
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
    const response = await new SecretsManager().send(
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
    throw new Error(`Secret was not retrieved: ${error}`);
  }
};

export const config = (): Config => configuration;
