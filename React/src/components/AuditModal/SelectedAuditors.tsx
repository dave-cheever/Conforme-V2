import { useContext, useMemo } from 'react';

import { Box, SimpleGrid } from '@chakra-ui/react';

import { IAuditor } from '../../interfaces/IAuditor';
import AuditModalContext from './AuditModalContext';
import SelectedAuditor from './SelectedAuditor';

const SelectedUsers = () => {
  // IAuditor

  const modalContext = useContext(AuditModalContext);
  const selectedAuditors = useMemo(() => modalContext.selectedAuditors, [modalContext.selectedAuditors]);

  return (
    (<SimpleGrid columns={2} data-id="5e928822502c" mb="20px" spacing={2}>
      {selectedAuditors.map((auditor: IAuditor) => (
        <Box data-id="a3ac1293fc15">
          <SelectedAuditor
            data-id="2d9c9f41c895"
            designation={auditor.designation}
            imgSrc={auditor.imgSrc}
            name={auditor.name} />
        </Box>
      ))}
    </SimpleGrid>)
  );
};

export default SelectedUsers;
