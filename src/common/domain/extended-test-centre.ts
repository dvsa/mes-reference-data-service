import { TestCentre } from '@dvsa/mes-journal-schema';

export interface ExtendedTestCentre extends TestCentre {
    commissionDate: number;
    decommissionDate: number;
}
