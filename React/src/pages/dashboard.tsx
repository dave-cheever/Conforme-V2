import { useAppContext } from '../contexts/AppProvider';
import Audits from './audits';
import TrackerItems from './tracker-items';

function Dashboard() {
  const { module } = useAppContext();
  if (module?.type === 'audits') return <Audits data-id="000184" />;

  return <TrackerItems data-id="000185" />;
}

export default Dashboard;
