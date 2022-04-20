import { DangerIcon, NotesIcon, ThumbUpIcon } from '../icons';

const Icon = ({ icon, ...props }) => {
  switch (icon) {
    case 'danger':
      return <DangerIcon {...props} />;
    case 'thumbUp':
      return <ThumbUpIcon {...props} />;
    case 'notes':
      return <NotesIcon {...props} />;
    default:
      return null;
  }
};

export default Icon;
