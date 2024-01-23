import { APIGatewayProxyEvent } from 'aws-lambda';
import { bootstrapLogging, error, info } from '@dvsa/mes-microservice-common/application/utils/logger';
import { createResponse } from '@dvsa/mes-microservice-common/application/api/create-response';
import { bootstrapConfig } from '../../../common/config/config';
import { findTestCentresLocal, findTestCentresRemote } from './repositories/active-test-centres';
import { getDate } from '../application/get-date';
import { ExtendedTestCentre } from '../../../common/domain/extended-test-centre';
import { getInactiveTestCentres, getActiveTestCentres } from '../application/get-test-centres';
import { mapTestCentres } from '../application/map-test-centres';

export async function handler(event: APIGatewayProxyEvent) {
  try {
    bootstrapLogging('ref-data-test-centres', event);

    // Set dates to parameters OR defaults
    const activeDate = getDate(event.queryStringParameters, 'testCentreActiveDate');

    const decommissionDate = getDate(event.queryStringParameters, 'decommissionTimeFrame');

    await bootstrapConfig();

    const allTestCentres: ExtendedTestCentre[] = await findTestCentresRemote();

    info('Successfully read remote data');

    // extract centres between the specified dates
    const activeTestCentres: ExtendedTestCentre[] = getActiveTestCentres(allTestCentres, activeDate, decommissionDate);

    // find all centres that aren't between the dates
    const inactiveTestCentres: ExtendedTestCentre[] = getInactiveTestCentres(allTestCentres, activeTestCentres);

    const response = mapTestCentres(activeTestCentres, inactiveTestCentres);

    return createResponse(response);
  } catch (err) {
    error((err instanceof Error) ? err.message : `Unknown error: ${err}`);

    const { active } = findTestCentresLocal();

    return createResponse({ active, inactive: [] });
  }
}
