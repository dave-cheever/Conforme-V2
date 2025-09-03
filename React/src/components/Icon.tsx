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
      return <SafeBehaviour data-id="030925-39187b" {...props} />;
    case 'safeCondition':
      return <SafeCondition data-id="030925-6584c6" {...props} />;
    case 'unsafeAct':
      return <UnsafeAct data-id="030925-e67190" {...props} />;
    case 'unsafeCondition':
      return <UnsafeCondition data-id="030925-535dff" {...props} />;
    case 'danger':
      return <DangerIcon data-id="030925-85c160" {...props} />;
    case 'thumbUp':
      return <ThumbUpIcon data-id="030925-3b4736" {...props} />;
    case 'notes':
      return <NotesIcon data-id="030925-bce6fd" {...props} />;
    case 'grid':
      return <GridIcon data-id="030925-f0282c" {...props} />;
    case 'list':
      return <ListIcon data-id="030925-21c1bf" {...props} />;
    case 'group':
      return <GroupIcon data-id="030925-da130f" {...props} />;
    default: {
      const ChakraIconComponent = ChakraIcons[icon];
      if (ChakraIconComponent) 
        return <ChakraIconComponent data-id="030925-2fb4c6" {...props} />;
      
      return null;
    }
  }
}

export default Icon;
