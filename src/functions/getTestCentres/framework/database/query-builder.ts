import * as mysql from 'mysql2';

/**
 * Get all active test centres.
 * @returns The examiners
 */
export const getTestCentres = (): string => {
  const query = `
            SELECT TC.TC_ID as centreId
                 , TC.TC_COST_CENTRE_CODE as costCode
                 , TCN.TC_NAME as centreName
                 , TC.COMMISSION_DATE as commissionDate
                 , TC.DECOMMISSION_DATE as decommissionDate
            FROM TEST_CENTRE TC
               , TEST_CENTRE_NAME TCN
            WHERE TC.TC_ID = TCN.TC_ID
        `;
  const args: string[] = [];
  return mysql.format(query, args);
};
