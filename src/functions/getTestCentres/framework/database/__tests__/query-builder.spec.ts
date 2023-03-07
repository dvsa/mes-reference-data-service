import { getTestCentres } from '../query-builder';

describe('Querybuilder', () => {
  it('should query to be returned', () => {
    const result = getTestCentres();
    const expectedQuery = `
            SELECT TC.TC_ID as centreId
                 , TC.TC_COST_CENTRE_CODE as costCode
                 , TCN.TC_NAME as centreName
                 , TC.COMMISSION_DATE as commissionDate
                 , TC.DECOMMISSION_DATE as decommissionDate
            FROM TEST_CENTRE TC
               , TEST_CENTRE_NAME TCN
            WHERE TC.TC_ID = TCN.TC_ID
        `;
    expect(result).toEqual(expectedQuery);
  });
});
