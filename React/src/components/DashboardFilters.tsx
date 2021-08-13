import React from "react";
import { Stack } from "@chakra-ui/react";
import * as Icons from "../icons/index";
import DashboardFilterButton from "./DashboardFilterButton";

const DashboardFilters = () => {
  return (
    <Stack direction="row" spacing={5}>
      <DashboardFilterButton
        label="All Types"
        isDisable={false}
        buttonType="allTypes"
      />
      <DashboardFilterButton
        label="Audits"
        isDisable={false}
        buttonType="audits"
        icon={Icons.AuditIcon}
      />
      <DashboardFilterButton
        label="Licenses"
        isDisable={false}
        buttonType="licenses"
        icon={Icons.LicensesIcon}
      />
      <DashboardFilterButton
        label="Assets"
        isDisable={true}
        buttonType="assets"
        icon={Icons.AssetsIcon}
      />
      <DashboardFilterButton
        label="Actions"
        isDisable={true}
        buttonType="actions"
        icon={Icons.ActionsIcon}
      />
      <DashboardFilterButton
        label="Accident Investigation"
        isDisable={false}
        buttonType="investigation"
        icon={Icons.InvestigationIcon}
      />
    </Stack>
  );
};

export default DashboardFilters;
