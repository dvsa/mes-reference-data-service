import * as mysql from 'mysql2';
import { info } from '@dvsa/mes-microservice-common/application/utils/logger';
import { getTestCentres } from '../database/query-builder';
import { getConnection } from '../../../../common/config/connection';
import { query } from '../../../../common/framework/mysql/database';
/**
 * Call TARS replica for a list of all test centres
 */
export const findTestCentres: () => Promise<any> = async () => {
  const connection: mysql.Connection = getConnection();

  let result;

  info('Searching for all test centres');
  try {
    result = query(connection, getTestCentres());
  } finally {
    connection.end();
  }

  return result;
  // return connection;
};
