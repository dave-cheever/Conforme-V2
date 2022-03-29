import { Stack } from '@chakra-ui/react';

import * as Icons from '../icons/index';
import DashboardFilterButton from './DashboardFilterButton';

const DashboardFilters = () => (
  <Stack direction="row" spacing={5}>
    <DashboardFilterButton
      buttonType="allTypes"
      isDisable={false}
      label="All Types"
    />
    <DashboardFilterButton
      buttonType="audits"
      icon={Icons.AuditIcon}
      isDisable={false}
      label="Audits"
    />
    <DashboardFilterButton
      buttonType="licenses"
      icon={Icons.LicensesIcon}
      isDisable={false}
      label="Licenses"
    />
    <DashboardFilterButton
      buttonType="assets"
      icon={Icons.AssetsIcon}
      isDisable
      label="Assets"
    />
    <DashboardFilterButton
      buttonType="actions"
      icon={Icons.ActionsIcon}
      isDisable
      label="Actions"
    />
    <DashboardFilterButton
      buttonType="investigation"
      icon={Icons.InvestigationIcon}
      isDisable={false}
      label="Accident Investigation"
    />
  </Stack>
);

export default DashboardFilters;
