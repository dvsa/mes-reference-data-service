import { mapTestCentres } from '../map-test-centres';
import { ExtendedTestCentre } from '../../../../common/domain/extended-test-centre';

describe('mapTestCentres', () => {
  it('should ', () => {
    const data: { active: ExtendedTestCentre[], inactive: ExtendedTestCentre[] } = {
      active: [
        {
          decommissionDate: 111, commissionDate: 999, centreId: 1, centreName: 'Name', costCode: 'NM',
        },
        {
          decommissionDate: 222, commissionDate: 888, centreId: 2, centreName: 'Name2', costCode: 'NM2',
        },
      ],
      inactive: [
        {
          decommissionDate: 333, commissionDate: 777, centreId: 3, centreName: 'Name3', costCode: 'NM3',
        },
        {
          decommissionDate: 444, commissionDate: 666, centreId: 4, centreName: 'Name4', costCode: 'NM4',
        },
      ],
    };
    const { active, inactive } = mapTestCentres(
      data.active,
      data.inactive,
    );
    expect(active).toEqual([
      { centreId: 1, centreName: 'Name', costCode: 'NM' },
      { centreId: 2, centreName: 'Name2', costCode: 'NM2' },
    ]);
    expect(inactive).toEqual([
      { centreId: 3, centreName: 'Name3', costCode: 'NM3' },
      { centreId: 4, centreName: 'Name4', costCode: 'NM4' },
    ]);
  });
});
