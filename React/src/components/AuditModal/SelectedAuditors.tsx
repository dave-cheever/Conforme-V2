import { useContext, useMemo } from 'react';

import { Box, SimpleGrid } from '@chakra-ui/react';

import { IAuditor } from '../../interfaces/IAuditor';
import AuditModalContext from './AuditModalContext';
import SelectedAuditor from './SelectedAuditor';

function SelectedUsers() {
  // IAuditor

  const modalContext = useContext(AuditModalContext);
  const selectedAuditors = useMemo(() => modalContext.selectedAuditors, [modalContext.selectedAuditors]);

  return (
    <SimpleGrid columns={2} data-id="030925-c6bb7e" mb="20px" spacing={2}>
      {selectedAuditors.map((auditor: IAuditor) => (
        <Box data-id="030925-9e3fd6">
          <SelectedAuditor
            data-id="030925-e805b8"
            designation={auditor.designation}
            imgSrc={auditor.imgSrc}
            name={auditor.name} />
        </Box>
      ))}
    </SimpleGrid>
  );
}

export default SelectedUsers;
