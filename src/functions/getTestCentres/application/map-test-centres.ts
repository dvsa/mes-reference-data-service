import { ExtendedTestCentre } from '../../../common/domain/extended-test-centre';

export const mapTestCentres = (
  activeTestCentres: ExtendedTestCentre[],
  inactiveTestCentres: ExtendedTestCentre[],
) => ({
  active: activeTestCentres.map(({ commissionDate, decommissionDate, ...centres }) => centres),
  inactive: inactiveTestCentres.map(({ commissionDate, decommissionDate, ...centres }) => centres),
});
