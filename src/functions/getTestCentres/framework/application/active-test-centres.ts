import * as mysql from 'mysql2';
import { info } from '@dvsa/mes-microservice-common/application/utils/logger';
import { getTestCentres } from '../database/mysql/test-centres';
import { getConnection } from '../config/connection';
import { query } from '../../../../common/framework/mysql/database';

/**
 * Call TARS replica for a list of all test centres
 */
export const findTestCentres = async (): Promise<any> => {
  const connection: mysql.Connection = getConnection();

  info('Searching for all test centres');
  return query(connection, await getTestCentres());
};
