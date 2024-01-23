import { APIGatewayProxyEventQueryStringParameters } from 'aws-lambda';
import { getDate } from '../get-date';

describe('getDate', () => {
  beforeEach(() => {
    const fixedDate = new Date(2023, 0, 1);
    jasmine.clock().mockDate(fixedDate);
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should use query string param when provided', () => {
    const date = getDate({
      param: '2023-11-02',
    } as APIGatewayProxyEventQueryStringParameters, 'param');
    expect(date).toEqual('2023-11-02');
  });
  it('should default date 2 years back if not provided / undefined', () => {
    const date = getDate({
      param: '2023-11-02',
    } as APIGatewayProxyEventQueryStringParameters, 'otherParam');
    expect(date).toEqual('2021-01-01');
  });
});
