import { APIGatewayProxyEvent } from 'aws-lambda';
import { bootstrapLogging, error } from '@dvsa/mes-microservice-common/application/utils/logger';
import { isBefore } from 'date-fns';
import { HttpStatus } from '../../../common/application/api/HttpStatus';
import createResponse from '../../../common/application/utils/createResponse';
import Response from '../../../common/application/api/Response';
import { bootstrapConfig } from '../../../common/config/config';
import { findTestCentres } from './repositories/active-test-centres';
import { getDate } from './repositories/get-date';
import { ExtendedTestCentre } from '../../../common/domain/extended-test-centre';

export async function handler(event: APIGatewayProxyEvent): Promise<Response> {
  bootstrapLogging('identify active test centres', event);

  // Set dates to parameters OR defaults
  const testCentreActiveDate = getDate(event.queryStringParameters, 'testCentreActiveDate');
  const testCentreDecommissionDate = getDate(event.queryStringParameters, 'decommissionTimeFrame');

  await bootstrapConfig();
  try {
    const allTestCentres: ExtendedTestCentre[] = await findTestCentres();

    // extract centres between the specified dates
    const activeTestCentres: ExtendedTestCentre[] = allTestCentres.filter((centre) => (
      (centre.commissionDate === null
                    || isBefore(centre.commissionDate, new Date(testCentreActiveDate)))
                && (centre.decommissionDate === null
                    || isBefore(new Date(testCentreDecommissionDate), centre.decommissionDate))
    ));

    // find all centres that weren't between the dates
    const inactiveTestCentres: ExtendedTestCentre[] = allTestCentres
      .filter((centre) => activeTestCentres.indexOf(centre) < 0);

    return createResponse({
      active: activeTestCentres.map(({ commissionDate, decommissionDate, ...centres }) => centres),
      inactive: inactiveTestCentres.map(({ commissionDate, decommissionDate, ...centres }) => centres),
    }, 200);
  } catch (err: unknown) {
    error(err as string);
    return createResponse('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
