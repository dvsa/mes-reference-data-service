import { APIGatewayProxyEventQueryStringParameters } from 'aws-lambda';
import { format, subYears } from 'date-fns';

export function getDate(queryStringParam: APIGatewayProxyEventQueryStringParameters | null, type: string): string {
  const dateParam = (queryStringParam && queryStringParam[type]) ? queryStringParam[type] : null;
  if (dateParam === null
        || typeof dateParam !== 'string'
        || dateParam.length !== 10
        || !Date.parse(dateParam)) {
    console.warn(`No valid date provided for ${type}, using default`);
    return type === 'testCentreActiveDate'
      ? format(new Date(), 'yyyy-MM-dd')
      : format(subYears(new Date(), 2), 'yyyy-MM-dd');
  }
  return dateParam;
}
