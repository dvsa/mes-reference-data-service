import * as mysql from 'mysql2';
import { findTestCentresRemote, findTestCentresLocal } from '../active-test-centres';
import * as queryBuilder from '../../database/query-builder';
import * as connection from '../../../../../common/config/connection';
import * as database from '../../../../../common/framework/mysql/database';

describe('Test centres', () => {
  describe('findTestCentresRemote', () => {
    let mockConnection: jasmine.SpyObj<mysql.Connection>;
    let mockQueryResult: mysql.RowDataPacket[];

    beforeEach(() => {
      // Mock the mysql.Connection object
      mockConnection = jasmine.createSpyObj<mysql.Connection>('Connection', ['end']);

      // Mock the query result
      mockQueryResult = [{ key: '1' }, { key: '2' }] as mysql.RowDataPacket[];

      // Spy on and mock the dependencies
      spyOn(connection, 'getConnection').and.returnValue(mockConnection);
      spyOn(database, 'query').and.returnValue(Promise.resolve([mockQueryResult] as any));
      spyOn(queryBuilder, 'getTestCentres').and.returnValue('SELECT * FROM TestCentres');
    });

    it('should query the database and return the result', async () => {
      await findTestCentresRemote();
      // Check the dependencies were called as expected
      expect(connection.getConnection).toHaveBeenCalled();
      expect(database.query).toHaveBeenCalledWith(mockConnection, 'SELECT * FROM TestCentres');
      expect(queryBuilder.getTestCentres).toHaveBeenCalled();
      expect(mockConnection.end).toHaveBeenCalled();
    });
  });
  describe('findTestCentresLocal', () => {
    ['live', 'prep', 'uat', 'dev'].forEach((env) => {
      it(`should return a populated active and inactive list when endpoint set for ${env}`, () => {
        process.env.TARS_REPLICA_ENDPOINT = `EP-${env}`;
        const { active } = findTestCentresLocal();
        expect(active.length).toBeGreaterThan(1);
      });
    });
  });
});
