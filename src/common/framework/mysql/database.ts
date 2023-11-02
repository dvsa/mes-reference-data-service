import * as mysql from 'mysql2';

export const query = async (
  connection: mysql.Connection,
  sql: string,
  args: any = [],
) => connection.promise().query(sql, args);
