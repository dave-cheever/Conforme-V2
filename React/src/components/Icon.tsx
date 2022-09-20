import {
  DangerIcon,
  GridIcon,
  GroupIcon,
  ListIcon,
  NotesIcon,
  SafeBehaviour,
  SafeCondition,
  ThumbUpIcon,
  UnsafeAct,
  UnsafeCondition,
} from '../icons';

const Icon = ({ icon, ...props }) => {
  switch (icon) {
    case 'safeBehaviour':
      return <SafeBehaviour {...props} />;
    case 'safeCondition':
      return <SafeCondition {...props} />;
    case 'unsafeAct':
      return <UnsafeAct {...props} />;
    case 'unsafeCondition':
      return <UnsafeCondition {...props} />;
    case 'danger':
      return <DangerIcon {...props} />;
    case 'thumbUp':
      return <ThumbUpIcon {...props} />;
    case 'notes':
      return <NotesIcon {...props} />;
    case 'grid':
      return <GridIcon {...props} />;
    case 'list':
      return <ListIcon {...props} />;
    case 'group':
      return <GroupIcon {...props} />;
    default:
      return null;
  }
};

export default Icon;
