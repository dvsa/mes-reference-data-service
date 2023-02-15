import * as mysql from 'mysql2';
import { info } from '@dvsa/mes-microservice-common/application/utils/logger';
import { getTestCentres } from '../database/mysql/test-centres';
import { getConnection } from '../config/connection';
import { query } from '../../../../common/framework/mysql/database';

export const findTestCentres = async (activeDate: string, decommissionDate: string): Promise<any> => {
  const connection: mysql.Connection = getConnection();

  info(`Searching for active test centres for ${activeDate}, with a decomission date of ${decommissionDate}`);
  return query(connection, await getTestCentres(activeDate, decommissionDate));
};
