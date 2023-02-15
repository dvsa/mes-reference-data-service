import * as mysql from 'mysql2';

export const query = async (
  connection: mysql.Connection | mysql.Pool,
  sql: string,
  args?: any,
): Promise<any[]> => new Promise((resolve, reject) => {
  connection.query(sql, args, (err, rows) => {
    if (err) {
      reject(err);
    }
    // @ts-ignore
    resolve(rows);
  });
});
