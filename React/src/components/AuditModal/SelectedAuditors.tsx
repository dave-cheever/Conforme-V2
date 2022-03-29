import { useContext, useMemo } from 'react';

import { Box, SimpleGrid } from '@chakra-ui/react';

import { IAuditor } from '../../interfaces/IAuditor';
import AuditModalContext from './AuditModalContext';
import SelectedAuditor from './SelectedAuditor';

const SelectedUsers = () => {
  // IAuditor

  const modalContext = useContext(AuditModalContext);
  const selectedAuditors = useMemo(
    () => modalContext.selectedAuditors,
    [modalContext.selectedAuditors],
  );

  return (
    <SimpleGrid columns={2} mb="20px" SimpleGrid spacing={2}>
      {selectedAuditors.map((auditor: IAuditor) => (
        <Box>
          <SelectedAuditor
            designation={auditor.designation}
            imgSrc={auditor.imgSrc}
            name={auditor.name}
          />
        </Box>
      ))}
    </SimpleGrid>
  );
};

export default SelectedUsers;
