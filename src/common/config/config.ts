import { throwIfNotPresent, tryFetchRdsAccessToken } from './config-helpers';

export type Config = {
  isOffline: boolean;
  tarsReplicaDatabaseHostname: string;
  tarsReplicaDatabaseName: string;
  tarsReplicaDatabaseUsername: string;
  tarsReplicaDatabasePassword: string;
};

let configuration: Config;
export const bootstrapConfig = async (): Promise<void> => {
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
    tarsReplicaDatabaseUsername: throwIfNotPresent(
      process.env.TARS_REPLICA_DB_USERNAME,
      'tarsReplicaDatabaseUsername',
    ),
    tarsReplicaDatabasePassword: await tryFetchRdsAccessToken(
      process.env.TARS_REPLICA_ENDPOINT,
      process.env.TARS_REPLICA_DB_USERNAME,
      'SECRET_DB_PASSWORD_KEY',
    ),
  };
};

export const config = (): Config => configuration;
