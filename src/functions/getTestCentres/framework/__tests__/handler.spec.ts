import { handler } from '../handler';
import * as activeTestCentres from '../repositories/active-test-centres';
import * as bootstrapConfig from '../../../../common/config/config';

const lambdaTestUtils = require('aws-lambda-test-utils');

describe('testCentres handler', () => {
  const mockEvent = lambdaTestUtils.mockEventCreator.createAPIGatewayEvent();

  beforeEach(() => {
    spyOn(bootstrapConfig, 'bootstrapConfig');
  });

  describe('call handler', () => {
    it('should return test centres and a response code of 200', async () => {
      const mockTestCentres = [
        {
          centreId: '3025',
          costCode: 'LON',
          centreName: 'London 1',
          commissionDate: null,
          decommissionDate: null,
        },
        {
          centreId: '3026',
          costCode: 'WALES',
          centreName: 'Wales test centre',
          commissionDate: null,
          decommissionDate: null,
        },
        {
          centreId: '3027',
          costCode: 'SCOT',
          centreName: 'SCOTLAND TEST CENTRE',
          commissionDate: null,
          decommissionDate: null,
        },
      ];

      spyOn(activeTestCentres, 'findTestCentres').and.returnValue(Promise.resolve(mockTestCentres));

      mockEvent.queryStringParameters = {
        testCentreActiveDate: '01/01/2001',
        decommissionTimeFrame: '01/01/2020',
      };

      const resp = await handler(mockEvent);
      expect(resp.statusCode).toBe(200);
      expect(resp.body).toEqual(JSON.stringify(
        {
          active: [
            {
              centreId: '3025',
              costCode: 'LON',
              centreName: 'London 1',
            },
            {
              centreId: '3026',
              costCode: 'WALES',
              centreName: 'Wales test centre',
            },
            {
              centreId: '3027',
              costCode: 'SCOT',
              centreName: 'SCOTLAND TEST CENTRE',
            },
          ],
          inactive: [],
        },
      ));
    });
  });
});
