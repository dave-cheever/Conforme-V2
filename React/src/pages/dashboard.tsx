import { useAppContext } from '../contexts/AppProvider';
import Audits from './audits';
import ComplianceItems from './compliance-items';

const Dashboard = () => {
  const { module } = useAppContext();
  if (module?.type === 'audits') return <Audits />;

  return <ComplianceItems />;
};

export default Dashboard;
