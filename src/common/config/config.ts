import * as awsSdk from 'aws-sdk';
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
  const secretsManager = new awsSdk.SecretsManager();
  const response = await secretsManager.getSecretValue({
    SecretId: getEnvSecretName(process.env.SECRET_NAME),
  }).promise();
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
};

export const config = (): Config => configuration;
