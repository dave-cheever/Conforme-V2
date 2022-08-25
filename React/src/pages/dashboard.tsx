import { useAppContext } from '../contexts/AppProvider';
import Audits from './audits';
import TrackerItems from './tracker-items';

const Dashboard = () => {
  const { module } = useAppContext();
  if (module?.type === 'audits') return <Audits />;

  return <TrackerItems />;
};

export default Dashboard;
