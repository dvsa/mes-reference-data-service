import { handler } from '../handler';
import * as activeTestCentres from '../repositories/active-test-centres';
import * as bootstrapConfig from '../../../../common/config/config';

const lambdaTestUtils = require('aws-lambda-test-utils');

describe('testCentres handler', () => {
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
  const mockEvent = lambdaTestUtils.mockEventCreator.createAPIGatewayEvent();

  beforeEach(() => {
    spyOn(bootstrapConfig, 'bootstrapConfig');

    mockEvent.queryStringParameters = {
      testCentreActiveDate: '01/01/2001',
      decommissionTimeFrame: '01/01/2020',
    };
  });

  describe('200 - Success', () => {
    it('should return test centres and a response code of 200', async () => {
      spyOn(activeTestCentres, 'findTestCentresRemote').and.returnValue(Promise.resolve(mockTestCentres));
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

  describe('200 - Fallback', () => {
    it('should return test centres and a response code of 200 however using local data', async () => {
      spyOn(activeTestCentres, 'findTestCentresRemote').and.rejectWith(new Error('some error'));

      const resp = await handler(mockEvent);
      expect(resp.statusCode).toBe(200);
      expect(JSON.parse(resp.body as string)?.active.length).toEqual(22);
      expect(JSON.parse(resp.body as string)?.inactive.length).toEqual(0);
    });
  });
});
