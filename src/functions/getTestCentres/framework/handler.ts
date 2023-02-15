import { APIGatewayProxyEvent } from 'aws-lambda';
import { bootstrapLogging, error } from '@dvsa/mes-microservice-common/application/utils/logger';
import { format, subYears } from 'date-fns';
import { HttpStatus } from '../../../common/application/api/HttpStatus';
import createResponse from '../../../common/application/utils/createResponse';
import Response from '../../../common/application/api/Response';
import { bootstrapConfig } from './config/config';
import { findTestCentres } from './application/active-test-centres';
import { getDate } from './application/get-date';

export async function handler(event: APIGatewayProxyEvent): Promise<Response> {
  bootstrapLogging('identify active test centres', event);

  const testCentreActiveDate = getDate(event.queryStringParameters, 'testCentreActiveDate');
  const decommissionDate = getDate(event.queryStringParameters, 'decomissionTimeFrame');

  await bootstrapConfig();
  try {
    const activeTestCentres = await findTestCentres(testCentreActiveDate, decommissionDate);
    const twoYearsTestCentres = await findTestCentres(
      testCentreActiveDate,
      format(subYears(new Date(), 2), 'yyyy-MM-dd'),
    );

    return createResponse({
      activeTestCentres,
      twoYearsTestCentre: twoYearsTestCentres,
    }, 200);
  } catch (err: unknown) {
    error(err as string);
    return createResponse('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
