import * as awsSdk from 'aws-sdk';
import { getEnvSecretName } from './config-helpers';

export type Config = {
  isOffline: boolean;
  tarsReplicaDatabaseHostname: string;
  tarsReplicaDatabaseName: string;
  tarsReplicaDatabaseUsername: string;
  tarsReplicaDatabasePassword: string;
};

// let configuration: Config;
// export const getConfig = async (): Promise<string> => {
//   const secretsManager = new awsSdk.SecretsManager();
//
//   const response = await secretsManager.getSecretValue({
//     SecretId: getEnvSecretName(process.env.SECRET_NAME),
//   }).promise();
//
//   console.log('response', response);
//
//   return JSON.parse(<string>response.SecretString);

//
//
// configuration = {
//   isOffline: !!process.env.IS_OFFLINE,
//   tarsReplicaDatabaseHostname: throwIfNotPresent(
//     process.env.TARS_REPLICA_HOST_NAME,
//     'tarsReplicaDatabaseHostname',
//   ),
//   tarsReplicaDatabaseName: throwIfNotPresent(
//     process.env.TARS_REPLICA_DB_NAME,
//     'tarsReplicaDatabaseName',
//   ),
//   tarsReplicaDatabaseUsername: throwIfNotPresent(
//     process.env.TARS_REPLICA_DB_USERNAME,
//     'tarsReplicaDatabaseUsername',
//   ),
//   tarsReplicaDatabasePassword: await tryFetchRdsAccessToken(
//     process.env.TARS_REPLICA_ENDPOINT,
//     process.env.TARS_REPLICA_DB_USERNAME,
//     'SECRET_DB_PASSWORD_KEY',
//   ),
// };
// };

// export const getConfig = (): Config => configuration;

export async function getConfig() {
  const secretsManager = new awsSdk.SecretsManager();
  const response = await secretsManager.getSecretValue({
    SecretId: getEnvSecretName(process.env.SECRET_NAME),
  }).promise();

  console.log('response', response);

  return JSON.parse(<string>response.SecretString);
}
