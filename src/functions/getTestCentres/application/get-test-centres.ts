import { isBefore } from 'date-fns';
import { ExtendedTestCentre } from '../../../common/domain/extended-test-centre';

export const getActiveTestCentres = (
  testCentres: ExtendedTestCentre[],
  testCentreActiveDate: string,
  testCentreDecommissionDate: string,
): ExtendedTestCentre[] => testCentres.filter((centre) => (
  (centre.commissionDate === null || isBefore(centre.commissionDate, new Date(testCentreActiveDate)))
  && (centre.decommissionDate === null || isBefore(new Date(testCentreDecommissionDate), centre.decommissionDate))
));

export const getInactiveTestCentres = (
  testCentres: ExtendedTestCentre[],
  activeTestCentres: ExtendedTestCentre[],
): ExtendedTestCentre[] => testCentres.filter(
  (centre) => activeTestCentres.indexOf(centre) < 0,
);
