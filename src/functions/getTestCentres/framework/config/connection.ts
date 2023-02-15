import * as mysql from 'mysql2';
import { config } from './config';

export const getConnection = (): mysql.Connection => {
  const configuration = config();
  const connection: mysql.Connection = mysql.createConnection({
    host: configuration.tarsReplicaDatabaseHostname,
    database: configuration.tarsReplicaDatabaseName,
    user: configuration.tarsReplicaDatabaseUsername,
    password: configuration.tarsReplicaDatabasePassword,
    charset: 'UTF8_GENERAL_CI',
  });
  return connection;
};
