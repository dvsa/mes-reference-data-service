import * as mysql from 'mysql2';
import { config } from './config';
import { certificate } from '../certs/ssl_profiles';

export const getConnection = (): mysql.Connection => {
  const configuration = config();
  const connection = mysql.createConnection({
    host: configuration.tarsReplicaDatabaseHostname,
    database: configuration.tarsReplicaDatabaseName,
    user: configuration.tarsReplicaDatabaseUsername,
    password: configuration.tarsReplicaDatabasePassword,
    charset: 'UTF8_GENERAL_CI',
    ssl: certificate,
    // authSwitchHandler(data, cb: any) {
    //   if (data.pluginName === 'mysql_clear_password') {
    //     cb(null, Buffer.from(`${configuration.tarsReplicaDatabasePassword}\0`));
    //   }
    // },
  });
  return connection;
};
