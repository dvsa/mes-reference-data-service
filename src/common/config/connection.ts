import * as mysql from 'mysql2';
import { getConfig } from './config';
import { certificate } from '../certs/ssl_profiles';

// export const getConnection = (): mysql.Connection => {
//   const configuration = getConfig();
//   const connection = await mysql.createConnection({
//     host: configuration.host,
//     user: configuration.username,
//     password: configuration.password,
//     database: configuration.database,
//     charset: 'UTF8_GENERAL_CI',
//     ssl: certificate,
//     authSwitchHandler(data, cb: any) {
//       if (data.pluginName === 'mysql_clear_password') {
//         cb(null, Buffer.from(`${configuration.tarsReplicaDatabasePassword}\0`));
//       }
//     },
//   });
//   return connection;
// };

export const getConnection = async () => {
  const dbCredentials = await getConfig();
  // console.log('responce2', dbCredentials);
  const connection = await mysql.createConnection({
    host: dbCredentials.host,
    user: dbCredentials.username,
    password: dbCredentials.password,
    database: 'tarsreplica',
    charset: 'UTF8_GENERAL_CI',
    ssl: certificate,
    authSwitchHandler(data, cb: any) {
      if (data.pluginName === 'mysql_clear_password') {
        cb(null, Buffer.from(`${dbCredentials.password}\0`));
      }
    },
  });

  return connection;
};
