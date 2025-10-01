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
    <SimpleGrid columns={2} data-id="000468" mb="20px" spacing={2}>
      {selectedAuditors.map((auditor: IAuditor) => (
        <Box data-id="000469">
          <SelectedAuditor
            data-id="000470"
            designation={auditor.designation}
            imgSrc={auditor.imgSrc}
            name={auditor.name} />
        </Box>
      ))}
    </SimpleGrid>
  );
}

export default SelectedUsers;
