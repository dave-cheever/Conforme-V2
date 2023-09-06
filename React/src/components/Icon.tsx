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

function Icon({ icon, ...props }) {
  switch (icon) {
    case 'safeBehaviour':
      return <SafeBehaviour data-id="8d055665c39e" {...props} />;
    case 'safeCondition':
      return <SafeCondition data-id="4b9930438730" {...props} />;
    case 'unsafeAct':
      return <UnsafeAct data-id="b817b407adaf" {...props} />;
    case 'unsafeCondition':
      return <UnsafeCondition data-id="f5fb61588788" {...props} />;
    case 'danger':
      return <DangerIcon data-id="c2524816c973" {...props} />;
    case 'thumbUp':
      return <ThumbUpIcon data-id="1b5556f87d66" {...props} />;
    case 'notes':
      return <NotesIcon data-id="33ec62f4c793" {...props} />;
    case 'grid':
      return <GridIcon data-id="982d09fa96c9" {...props} />;
    case 'list':
      return <ListIcon data-id="90334fa867b8" {...props} />;
    case 'group':
      return <GroupIcon data-id="988fd98a5c5a" {...props} />;
    default:
      return null;
  }
}

export default Icon;
