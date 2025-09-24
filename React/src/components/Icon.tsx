import * as ChakraIcons from '@chakra-ui/icons';

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
      return <SafeBehaviour data-id="000286" {...props} />;
    case 'safeCondition':
      return <SafeCondition data-id="000287" {...props} />;
    case 'unsafeAct':
      return <UnsafeAct data-id="000288" {...props} />;
    case 'unsafeCondition':
      return <UnsafeCondition data-id="000289" {...props} />;
    case 'danger':
      return <DangerIcon data-id="000290" {...props} />;
    case 'thumbUp':
      return <ThumbUpIcon data-id="000291" {...props} />;
    case 'notes':
      return <NotesIcon data-id="000292" {...props} />;
    case 'grid':
      return <GridIcon data-id="000293" {...props} />;
    case 'list':
      return <ListIcon data-id="000294" {...props} />;
    case 'group':
      return <GroupIcon data-id="000295" {...props} />;
    default: {
      const ChakraIconComponent = ChakraIcons[icon];
      if (ChakraIconComponent) 
        return <ChakraIconComponent data-id="000296" {...props} />;
      
      return null;
    }
  }
}

export default Icon;
