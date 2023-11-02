import { Mock, Times } from 'typemoq';
import * as mysql from 'mysql2';
import { IMock } from 'typemoq/Api/IMock';
import { query } from '../database';

describe('Database', () => {
  describe('query', () => {
    let mockConnection: IMock<mysql.Connection>;
    let mockPromise: IMock<any>;
    const mockResults = [{ key: 'result' }, { key: 'result 2' }] as (mysql.RowDataPacket[]);

    beforeEach(() => {
      mockConnection = Mock.ofType<mysql.Connection>();
      mockPromise = Mock.ofType<any>();

      mockConnection.setup((m) => m.promise()).returns(() => mockPromise.object);
      mockPromise.setup((m) => m.query('SELECT * FROM table', []))
        .returns(() => Promise.resolve(mockResults));
    });

    it('should execute a query and return the result', async () => {
      const result = await query(mockConnection.object, 'SELECT * FROM table', []);

      expect(result as mysql.RowDataPacket[]).toEqual(mockResults);

      mockConnection.verify((m) => m.promise(), Times.once());
      mockPromise.verify((m) => m.query('SELECT * FROM table', []), Times.once());
    });
  });
});
