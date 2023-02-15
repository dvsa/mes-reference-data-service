import * as mysql from 'mysql2';

/**
 * Get all active test centres.
 * @returns The examiners
 */
export const getTestCentres = async (activeDate: string, decommissionDate: string): Promise<string> => {
  // Todo: amend query to use these parameters when fields are available
  console.log('activeDate', activeDate);
  console.log('decommissionDate', decommissionDate);
  const query = `
            SELECT TC.TC_ID
                 , TC.TC_COST_CENTRE_CODE
                 , TCN.TC_NAME
            FROM TEST_CENTRE TC
               , TEST_CENTRE_NAME TCN
            WHERE TC.TC_ID = TCN.TC_ID
        `;
  const args: string[] = [];
  return mysql.format(query, args);
};
