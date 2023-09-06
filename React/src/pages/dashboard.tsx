import { useAppContext } from '../contexts/AppProvider';
import Audits from './audits';
import TrackerItems from './tracker-items';

function Dashboard() {
  const { module } = useAppContext();
  if (module?.type === 'audits') return <Audits data-id="a4bd06468ea0" />;

  return <TrackerItems data-id="67f51d57e1ba" />;
}

export default Dashboard;
