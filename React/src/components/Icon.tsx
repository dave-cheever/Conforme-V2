import { DangerIcon, GridIcon, GroupIcon, ListIcon, NotesIcon, ThumbUpIcon } from '../icons';

const Icon = ({ icon, ...props }) => {
  switch (icon) {
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
