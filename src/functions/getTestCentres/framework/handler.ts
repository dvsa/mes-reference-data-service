import { APIGatewayProxyEvent } from 'aws-lambda';
import { bootstrapLogging, error } from '@dvsa/mes-microservice-common/application/utils/logger';
import { TestCentre } from '@dvsa/mes-journal-schema';
import { HttpStatus } from '../../../common/application/api/HttpStatus';
import createResponse from '../../../common/application/utils/createResponse';
import Response from '../../../common/application/api/Response';
import { bootstrapConfig } from '../../../common/config/config';
import { findTestCentres } from './repositories/active-test-centres';
import { getDate } from './repositories/get-date';

export async function handler(event: APIGatewayProxyEvent): Promise<Response> {
  bootstrapLogging('identify active test centres', event);

  const testCentreActiveDate = getDate(event.queryStringParameters, 'testCentreActiveDate');
  const decommissionDate = getDate(event.queryStringParameters, 'decommissionTimeFrame');

  console.log('testCentreActiveDate', testCentreActiveDate);
  console.log('decommissionDate', decommissionDate);

  await bootstrapConfig();
  try {
    const testCentres: TestCentre[] = await findTestCentres();

    // TODO: use query parameters to filter payload for
    //   1. all current active test centres
    //   2. all test centres that have been active over the last 2 years (over if decommission date provided)

    return createResponse({
      active: testCentres,
      inactive: testCentres,
    }, 200);
  } catch (err: unknown) {
    error(err as string);
    return createResponse('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
