import { info } from '@dvsa/mes-microservice-common/application/utils/logger';
import * as mysql from 'mysql2';
import { getTestCentres } from '../database/query-builder';
import { getConnection } from '../../../../common/config/connection';
import { query } from '../../../../common/framework/mysql/database';
import * as testCentresDev from '../../../../assets/test-centres.dev.json';
import * as testCentresUAT from '../../../../assets/test-centres.uat.json';
import * as testCentresLive from '../../../../assets/test-centres.live.json';
import { ExtendedTestCentre } from '../../../../common/domain/extended-test-centre';

interface TestCentre {
  centreId: number;
  costCode: string;
  centreName: string;
}

export interface TestCentres {
  inactive: TestCentre[];
  active: TestCentre[];
}
/**
 * Call TARS replica for a list of all test centres
 */
export const findTestCentresRemote = async (): Promise<ExtendedTestCentre[]> => {
  const connection: mysql.Connection = getConnection();

  let result;

  info('Searching for all test centres using remote data');

  try {
    result = await query(connection, getTestCentres());

    info('Successfully read remote data');
  } finally {
    connection.end();
  }

  return result as ExtendedTestCentre[];
};

/**
 * Call TARS replica for a list of all test centres
 */
export const findTestCentresLocal = (): TestCentres => {
  const endpoint: string[] = (process.env.TARS_REPLICA_ENDPOINT || '').split('-');

  if (endpoint.length === 0) {
    return {
      active: [],
      inactive: [],
    };
  }

  info('Searching for all test centres using local data');

  const env: string = endpoint[1];

  switch (env?.toLowerCase()) {
    case 'live':
    case 'prep':
      return testCentresLive;
    case 'uat':
      return testCentresUAT;
    default:
      return testCentresDev;
  }
};
