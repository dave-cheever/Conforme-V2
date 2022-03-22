import { useAppContext } from "../contexts/AppProvider";
import Audits from "./audits";
import ComplianceItems from "./compliance-items";

const Dashboard = () => {
  const { organizationConfig } = useAppContext();
  if (organizationConfig?.addons.find(({ name }) => name === 'audits')) {
    return <Audits />;
  }
  return <ComplianceItems />;
};

export default Dashboard;
