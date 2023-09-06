import { Stack } from '@chakra-ui/react';

import * as Icons from '../icons/index';
import DashboardFilterButton from './DashboardFilterButton';

function DashboardFilters() {
  return <Stack data-id="bfc7a1ba4448" direction="row" spacing={5}>
    <DashboardFilterButton
      buttonType="allTypes"
      data-id="437242c03224"
      isDisable={false}
      label="All Types" />
    <DashboardFilterButton
      buttonType="audits"
      data-id="fbfbbb7ef1e9"
      icon={Icons.AuditIcon}
      isDisable={false}
      label="Audits" />
    <DashboardFilterButton
      buttonType="licenses"
      data-id="c7e10385351a"
      icon={Icons.LicensesIcon}
      isDisable={false}
      label="Licenses" />
    <DashboardFilterButton
      buttonType="assets"
      data-id="95f41b035a13"
      icon={Icons.AssetsIcon}
      isDisable
      label="Assets" />
    <DashboardFilterButton
      buttonType="actions"
      data-id="9d8462fa4040"
      icon={Icons.ActionsIcon}
      isDisable
      label="Actions" />
    <DashboardFilterButton
      buttonType="investigation"
      data-id="1982a2f1b46f"
      icon={Icons.InvestigationIcon}
      isDisable={false}
      label="Accident Investigation" />
  </Stack>
}

export default DashboardFilters;
