import { useAppContext } from '../contexts/AppProvider';
import Audits from './audits';
import TrackerItems from './tracker-items';

function Dashboard() {
  const { module } = useAppContext();
  if (module?.type === 'audits') return <Audits data-id="030925-51c537" />;

  return <TrackerItems data-id="030925-d41dfa" />;
}

export default Dashboard;
