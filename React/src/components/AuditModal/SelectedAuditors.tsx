import { Box, SimpleGrid } from '@chakra-ui/react'
import { useContext, useMemo } from 'react'
import { IAuditor } from '../../interfaces/IAuditor'
import AuditModalContext from './AuditModalContext'
import SelectedAuditor from './SelectedAuditor'

const SelectedUsers = () => { // IAuditor

  const modalContext = useContext(AuditModalContext);
  const selectedAuditors = useMemo(() => modalContext.selectedAuditors, [modalContext.selectedAuditors]);

  return (
    <SimpleGrid SimpleGrid columns={2} spacing={2} mb="20px" >
      {
        selectedAuditors.map((auditor: IAuditor) => {
          return (
            <Box >
              <SelectedAuditor name={auditor.name}
                designation={auditor.designation}
                imgSrc={auditor.imgSrc} />
            </Box>
          )
        })
      }
    </SimpleGrid >
  )
}

export default SelectedUsers
