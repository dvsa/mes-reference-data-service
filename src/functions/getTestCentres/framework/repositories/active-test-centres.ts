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

  let batch: mysql.RowDataPacket[];

  try {
    const [rows] = await query(connection, getTestCentres());
    batch = rows as mysql.RowDataPacket[];
  } finally {
    connection.end();
  }

  return batch as ExtendedTestCentre[];
};

/**
 * Call TARS replica for a list of all test centres
 */
export const findTestCentresLocal = (): TestCentres => {
  const endpoint: string[] = (process.env.TARS_REPLICA_ENDPOINT || '').split('-');

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
